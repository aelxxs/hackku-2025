import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/utils/supabase";

interface icdCode{
    code:string;
    description:string;
}
export async function POST(request: NextRequest) {
    const icdCodes = new Set();
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    })
    const data = await request.json();
    const soapNotes = data.soapNotes;
    if (!soapNotes) {
        return NextResponse.json({ error: "No SOAP notes provided" }, { status: 400 });
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents:`You will be given the SOAP(Subjective, Objective,Assessment,Plan) notes of a medical visit.
            Use this to generate a list of medical keywords corresponding to the ICD-10 codes for the visit.
            The output should just be a string of comma sepearated singulal medical terms.
            They must be single words.
            The keywords should be relevant to the SOAP notes provided.
            There should be one keyword that is directly taken from the CHIEF COMPLAINT section of the SOAP notes.
            The keywords should as specific as possible but single words.
            The keywords should be related to the particular organ/organs of the body.
            Avoid common words like "Evaluation" or "Dysfunction" or any other words that are a common filler word in medical diagnoses.
            Only use adjective words if they are relevant to the organ/organs of the body.
            There should be no other text in the output.
            Since the dataset is huge, limit yourself to 5 keywords only.
            Here are the SOAP notes: ${soapNotes}`,
        })
        if (!response || !response.text) {
            return NextResponse.json({ error: "ICD-10 code generation failed" }, { status: 500 });
        }
        console.log(response.text)
        const keywords = response.text.split(",").map((keyword) => keyword.trim()).slice(0, 5);
        
        await Promise.all(
            keywords.map(async (keyword)=>{
                
                const {data,error} = await supabase.from("icdCodes").select("*").ilike("description",`%${keyword}%`);
                // if (error) {
                //     console.error("Error fetching ICD codes:", error);
                //     return NextResponse.json({ error: "Error fetching ICD codes" }, { status: 500 });
                // }
                if (data && data.length > 0) {
                    console.log("Keyword: ", keyword)
                    console.log(data.length)
                    console.log("======================")
                    data.map((item)=>{
                        icdCodes.add(item);
                    })
                }
            })
            
        );

        console.log("ICD Codes fetched");
        console.log(icdCodes.size)
        return NextResponse.json({ codes: [...icdCodes] }, { status: 200 });
    }
    catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Error processing request" }, { status: 500 });
    } 
}


