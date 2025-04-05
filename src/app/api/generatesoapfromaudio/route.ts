import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
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
            console.log({ transcription });
            return NextResponse.json({ text: transcription.text }, { status: 200 });
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