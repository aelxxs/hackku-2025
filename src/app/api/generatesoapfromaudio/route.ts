import { NextRequest, NextResponse } from "next/server";
import fs from "fs"
import OpenAI from "openai";
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { GoogleGenAI } from "@google/genai";



export async function POST(request: NextRequest) {

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    })
    let tempFilePath;
    try {
        const data = await request.formData();
        const file: File | null = data.get("audio") as File;
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${generateSlug()}-${file.name}`;
        const tempFilePath = path.join('/tmp', filename);

        await writeFile(tempFilePath, buffer);

        const transcription = await client.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: "gpt-4o-transcribe",
        });

        if (!transcription || !transcription.text) {
            return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
        }
        else {

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents:`You will be given the audio transcription of a medical visit. Use it to generate SOAP(Subjective, Objective,Assessment,Plan) notes for the visit.
                The SOAP notes output should be provided in a raw markdown format. Only output the soap notes. No need of any other pleasantries. Here is the transcription: ${transcription.text}`,
            })
            if (!response || !response.text) {
                return NextResponse.json({ error: "SOAP generation failed" }, { status: 500 });
            }
            return NextResponse.json({ text: response.text }, { status: 200 });
        }
    }
    catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Error processing request" }, { status: 500 });
    } finally {
        // Always attempt to clean up the file
        if (tempFilePath) {
            try {
                await unlink(tempFilePath);
            } catch (cleanupErr) {
                console.error('Error deleting temp file:', cleanupErr);
            }
        }

    }
}

function generateSlug() {
    return Math.random().toString(36).substring(2, 15);
}