"use client";
import { useState, useRef } from 'react';



interface icdCode{
    code:string;
    description:string;
}
export default function AudioUploader() {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [icdCode, setIcdCode] = useState<icdCode[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            setAudioFile(file);

            // Create URL for audio preview
            const url = URL.createObjectURL(file);
            setAudioUrl(url);
        }
    };

    const handleReset = () => {
        setAudioFile(null);
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    async function handleTranscribe() {
        if (!audioFile) {
            alert("Please select an audio file first.");
            return;
        }

        const formData = new FormData();
        formData.append("audio", audioFile);

        try {
            const response = await fetch("/api/generatesoapfromaudio", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data);
            setTranscription(data.text);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while processing the audio file.");
        }
    }

    async function handleICD() {
        if(!transcription){
            alert("Please transcribe the audio file first.");
            return;
        }
        try{
            const response = await fetch("/api/generateicdfromsoap", {
                method: "POST",
                body: JSON.stringify({soapNotes: transcription}),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setTranscription("");
            console.log(data.codes);
            setIcdCode(data.codes);
        }
        catch (error) {
            console.error("Error:", error);
            alert("An error occurred while generating the ICD code.");
        }
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Audio File Uploader</h1>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                    Select an audio file:
                </label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
            </div>

            {audioFile && (
                <div className="mt-4 max-h-[500px] overflow-y-scroll">
                    <p className="mb-2">
                        <span className="font-semibold">Selected file:</span> {audioFile.name}
                    </p>
                    <p className="mb-2">
                        <span className="font-semibold">Size:</span> {(audioFile.size / 1024).toFixed(2)} KB
                    </p>

                    <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2">Preview:</h2>
                        {audioUrl && (
                            <audio controls className="w-full">
                                <source src={audioUrl} type={audioFile.type} />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </div>

                    <button
                        onClick={handleReset}
                        className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    >
                        Clear
                    </button>
                    <button onClick={handleTranscribe}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2"
                    >
                        Transcribe
                    </button>
                    <button onClick={handleICD}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2"
                    >Generate ICD
                    </button>
                    <pre className='text-black'>
                        {transcription}
                    </pre>
                    <pre className='text-black'>
                        {icdCode.map((item, index) => (
                            <div key={index}>
                                <p>{item.code} : {item.description}</p>
                            </div>
                        ))}
                    </pre>
                </div>
            )}
        </div>
    );
}