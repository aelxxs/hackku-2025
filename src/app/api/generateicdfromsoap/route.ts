import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/utils/supabase";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI  from "openai";

interface icdCode{
    code:string;
    description:string;
}
export async function POST(request: NextRequest) {
    const icdCodes = new Set();
    console.log('API KEY ANTHRO',process.env.ANTHROPIC_API_KEY)
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    })
    const openAIclient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY, // This is the default and can be omitted
      });
    const data = await request.json();
    const soapNotes = data.soapNotes;
    if (!soapNotes) {
        return NextResponse.json({ error: "No SOAP notes provided" }, { status: 400 });
    }
    try {
        const response= await openAIclient.responses.create({
            input:`You will be given the SOAP(Subjective, Objective,Assessment,Plan) notes of a medical visit.
            Use these notes to generate a the 10 most relevant ICD-10 codes for the visit.
            The output should just be a string of comma separated ICD-10 codes.
            The ICD-10 codes in the database only go from A-Y
            The ICD-10 codes should be relevant to the SOAP notes provided. Here are the SOAP notes: ${soapNotes}`,
            model: "gpt-4o",
            max_output_tokens: 5000,
        });
        // const response = await ai.models.generateContent({
        //     model: "gemini-2.5-pro-preview-03-25",
        //     // contents:`You will be given the SOAP(Subjective, Objective,Assessment,Plan) notes of a medical visit.
        //     // Use this to generate a list of medical keywords corresponding to the ICD-10 codes for the visit.
        //     // The output should just be a string of comma sepearated singulal medical terms.
        //     // They must be single words.
        //     // The keywords should be relevant to the SOAP notes provided.
        //     // There should be one keyword that is directly taken from the CHIEF COMPLAINT and PLAN and OBJECTIVE section of the SOAP notes.
        //     // The keywords should as specific as possible but single words.
        //     // The keywords should be related to the particular organ/organs of the body.
        //     // There should be no other text in the output.
        //     // Since the dataset is huge, give me 5 keywords. The first two keywords are 'main' keywords and the last three are 'secondary' keywords.
        //     // The main keywords should be the most relevant to the SOAP notes and should be the most common ICD-10 codes. The relevant ICD code's description should CONTAIN these keyword.
        //     // The secondary keywords should be less relevant but still related to the SOAP notes.
        //     // The keywords should be in the format of 'mainkeyword1, mainkeyword2, secondarykeyword3, secondarykeyword4, secondarykeyword5'.
        //     // Utilize medical knowledge and give a differential diagnosis from the SOAP notes.
        //     // Here are the SOAP notes: ${soapNotes}`,
        //     contents:`You will be given the SOAP(Subjective, Objective,Assessment,Plan) notes of a medical visit.
        //     Use these notes to generate a the 10 most relevant ICD-10 codes for the visit.
        //     The output should just be a string of comma separated ICD-10 codes.
        //     The ICD-10 codes in the database only go from A-Y
        //     The ICD-10 codes should be relevant to the SOAP notes provided. Here are the SOAP notes: ${soapNotes}`
        // })
       
        const icdCodesArray = response.output_text!.split(",").map((code) => {
            code = code.replace(".", "").trim();
            return code;
        });
        await Promise.all(
            icdCodesArray.map(async (code) => {
                const { data, error } = await supabase.from("icdCodes").select().eq("code", code);
                if (error) {
                    console.error("Error fetching ICD codes:", error);
                    return NextResponse.json({ error: "Error fetching ICD codes" }, { status: 500 });
                }
                if (data && data.length > 0) {
                    console.log("ICD Code: ", code)
                    console.log(data.length)
                    console.log("======================")
                    data.map((item) => {
                        icdCodes.add(item);
                    })
                }
            })
        );
        // const mainkeywords = response.text.split(",").map((keyword) => keyword.trim()).slice(0, 2);
        
        // await Promise.all(
        //     mainkeywords.map(async (keyword)=>{
                
        //         const {data,error} = await supabase.from("icdCodes").select().ilike("description", "%" + keyword + "%");
        //         if (error) {
        //             console.error("Error fetching ICD codes:", error);
        //             return NextResponse.json({ error: "Error fetching ICD codes" }, { status: 500 });
        //         }
        //         if (data && data.length > 0) {
        //             console.log("Keyword: ", keyword)
        //             console.log(data.length)
        //             console.log("======================")
        //             data.map((item)=>{
        //                 icdCodes.add(item);
        //             })
        //         }
        //     })
            
        // );
        // const secondarykeywords = response.text.split(",").map((keyword) => keyword.trim()).slice(2, 5);
        // await Promise.all(
        //     secondarykeywords.map(async (keyword)=>{
        //         const {data,error} = await supabase.from("icdCodes").select().textSearch("description", keyword);
        //         if (error) {
        //             console.error("Error fetching ICD codes:", error);
        //             return NextResponse.json({ error: "Error fetching ICD codes" }, { status: 500 });
        //         }
        //         if (data && data.length > 0) {
        //             console.log("Keyword: ", keyword)
        //             console.log(data.length)
        //             console.log("======================")
        //             data.map((item)=>{
        //                 icdCodes.add(item);
        //             })
        //         }
        //     })
        // );


        console.log("ICD Codes fetched");
        console.log(icdCodes.size)
        return NextResponse.json({ codes: [...icdCodes] }, { status: 200 });
    }
    catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Error processing request" }, { status: 500 });
    } 
}


