import { GoogleGenAI } from "@google/genai";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const ai  = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });


    try {
        const data = await request.formData();
        const file: Blob | null = data.get("audio") as  Blob;
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const fileArrayBuffer = await file.arrayBuffer();
        const fileObject = new File([fileArrayBuffer], "audio.wav", { type: file.type });


        const transcription = await client.audio.transcriptions.create({
            file: fileObject,
            model: "whisper-1",
        });

        if (!transcription || !transcription.text) {
            return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
        }
        else {

            console.log("Transcription:", transcription.text);

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents:`You will be given the audio transcription of a medical visit. Use it to generate SOAP(Subjective, Objective,Assessment,Plan) notes for the visit.
                The SOAP notes output should be provided in a raw markdown format. Only output the soap notes. No need of any other pleasantries. Here is the transcription: ${transcription.text}`,
                config: {
                    temperature: 0.5,
                    maxOutputTokens: 5000,
                    topP: 0.95,
                }
            })

            if (!response || !response.text) {
                return NextResponse.json({ error: "SOAP generation failed" }, { status: 500 });
            }



            let cleanedText = response.text;

            // remove ```markdown and ``` from the start and end of the text
            if (cleanedText.startsWith("```markdown")) {
                cleanedText = cleanedText.replace("```markdown", "").trim();
            }
            if (cleanedText.endsWith("```")) {
                cleanedText = cleanedText.replace("```", "").trim();
            }
            // remove any leading or trailing whitespace
            cleanedText = cleanedText.trim();
            // remove any leading or trailing newlines
            cleanedText = cleanedText.replace(/^\s*\n/gm, "");
            cleanedText = cleanedText.replace(/\n\s*$/gm, "");
            // remove any leading or trailing spaces
            cleanedText = cleanedText.replace(/^\s+/gm, "");
            cleanedText = cleanedText.replace(/\s+$/gm, "");
            // remove any leading or trailing tabs
            cleanedText = cleanedText.replace(/^\t+/gm, "");

            console.log(response.text);
            return NextResponse.json({ text: cleanedText }, { status: 200 });
        }
    }
    catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Error processing request" }, { status: 500 });
    }
}

function generateSlug() {
    return Math.random().toString(36).substring(2, 15);
}

