"use client";

import { AnimatedAudioWave } from "@/app/components/AudioWave";
import { useAppContext } from "@/app/context-providers";
import { DocumentArrowUpIcon, MicrophoneIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

import dynamic from 'next/dynamic';

const ReactMediaRecorder = dynamic(
    () => import('react-media-recorder').then((mod) => mod.ReactMediaRecorder),
    { ssr: false }
);

export const Recorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { handleStopVisit } = useAppContext();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const blob = new Blob([arrayBuffer], { type: file.type });
                handleStopVisit(blob);
            } catch (error) {
                console.error("Error processing file:", error);
            }
        }
    };

    return (
        <div className="w-full">
            <ReactMediaRecorder
                audio
                onStart={() => setIsRecording(true)}
                onStop={(_, blob) => {
                    setIsRecording(false);
                    handleStopVisit(blob);
                }}
                render={({ startRecording, stopRecording, pauseRecording, mediaBlobUrl }) => {
                    if (!isRecording) {
                        return (
                            <div className="flex flex-col items-center justify-center w-full gap-10">
                                <div className="flex flex-col gap-2 items-center justify-center">
                                    <h2 className="text-xl font-bold">Start Visit Recording</h2>
                                    <p className="text-sm text-gray-500">
                                        Record or upload a visit recording to get started.
                                    </p>
                                </div>

                                <div className="flex flex-row items-center justify-center w-full h-full gap-4">
                                    <button
                                        className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                                        onClick={startRecording}
                                    >
                                        <MicrophoneIcon className="w-4 h-4" />
                                        Capture Visit
                                    </button>

                                    <span className="text-gray-400">or</span>

                                    <button
                                        className="flex flex-row items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <DocumentArrowUpIcon className="w-4 h-4" />
                                        Upload Recording
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="audio/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="flex flex-col items-center justify-center w-full">
                            <p className="text-2xl">Recording...</p>
                            <div className="h-[10rem]">
                                <AnimatedAudioWave animate={!isPaused} />
                            </div>
                            <div className="flex flex-row items-center justify-center w-full gap-2">
                                <button
                                    className="flex h-10 flex-row items-center justify-center gap-2 px-6 py-2 text-white bg-gray-600 rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
                                    onClick={stopRecording}
                                >
                                    <MicrophoneIcon className="w-4 h-4" />
                                    End Visit
                                </button>
                                <button
                                    className="flex h-10 w-10 flex-row items-center justify-center gap-2 text-white bg-gray-600 rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
                                    onClick={() => {
                                        pauseRecording();
                                        setIsPaused(!isPaused);
                                    }}
                                >
                                    {isPaused ?
                                        <PlayIcon className="w-6 h-6" /> :
                                        <PauseIcon className="w-6 h-6" />
                                    }
                                </button>
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};
