import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const mimeTypes = {
	"audio/wav": "wav",
	"audio/x-wav": "wav",
	"audio/x-pcm": "wav",
	"audio/x-aiff": "aiff",
	"audio/aiff": "aiff",
	"audio/x-m4a": "m4a",
	"audio/m4a": "m4a",
	"audio/x-mpeg-3": "mp3",
};

const getFileExtension = (mimeType: string) => {
	const extension = mimeTypes[mimeType];
	if (!extension) {
		throw new Error(`Unsupported MIME type: ${mimeType}`);
	}
	return extension;
};

export async function POST(request: NextRequest) {
	const client = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const ai = new GoogleGenAI({
		apiKey: process.env.GEMINI_API_KEY,
	});

	try {
		const data = await request.formData();
		const file: Blob | null = data.get("audio") as Blob;
		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		const fileArrayBuffer = await file.arrayBuffer();

		const fileExt = getFileExtension(file.type);
		const fileName = `audio-${generateSlug()}.${fileExt}`;

		const fileObject = new File([fileArrayBuffer], fileName, { type: file.type });

		const transcription = await client.audio.transcriptions.create({
			file: fileObject,
			model: "whisper-1",
		});

		if (!transcription || !transcription.text) {
			return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
		} else {
			console.log("Transcription:", transcription.text);

			const response = await ai.models.generateContent({
				model: "gemini-2.0-flash",
				contents: `
                You will be given the audio transcription of a medical visit. Use it to generate SOAP(Subjective, Objective,Assessment,Plan) notes for the visit.
                The SOAP notes output should be provided in a raw markdown format. Only output the soap notes. No need of any other pleasantries.

                Here is the transcription: ${transcription.text}


                You are to outut the SOAP notes in the following format, making sure to abide by the markdown format and rules such as adding new lines and spaces where necessary:

                such as after a heading, or after a list item, etc.


**Patient Presentation**: Gastrointestinal Symptoms

---

## Subjective (S)
**Chief Complaint**: Stomach pain and bloating, especially after meals.
**History of Present Illness**: Patient reports experiencing stomach pain and bloating lately. Symptoms seem to correlate with meal times, occurring shortly after eating. Recently consumed bread toasts from a local grocery store.
**Medications**: Vitamin D3 and Vitamin K supplements.
**Allergies**: No known food allergies, but patient has not been formally tested.
**Diet**: Primarily South Asian home-cooked meals consisting of bread, vegetables, and fruits.
**Family History**: Grandmother intolerant to lentils. Distant cousins have dairy and gluten allergies.

---

## Objective (O)
*Physical exam and vitals not documented in current records.*
Recommendation: Include abdominal exam findings and vital signs in future documentation.

---

## Assessment (A)
**Primary Differential**:
1. **Celiac disease**
2. **Non-celiac gluten sensitivity**
3. **Food intolerance/allergy**

---

## Plan (P)
**Diagnostics**:
- Blood work for celiac serology and nutritional markers
- Allergy testing (skin prick test)
**Dietary Modifications**:
- Temporarily avoid bread and similar carbohydrates
- Implement a food diary
**Follow-Up**:
- Review lab results in 7-10 days
- Schedule follow-up appointment for further management

---

**Next Steps**:
- Coordinate phlebotomy appointment
- Provide gluten-free dietary resources
- Schedule follow-up: [Insert Date]


                `,
				config: {
					temperature: 0.5,
					maxOutputTokens: 5000,
					topP: 0.95,
				},
			});

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
	} catch (error) {
		console.error("Error processing request:", error);
		return NextResponse.json({ error: "Error processing request" }, { status: 500 });
	}
}

function generateSlug() {
	return Math.random().toString(36).substring(2, 15);
}
