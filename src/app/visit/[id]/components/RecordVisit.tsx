"use client";

import { AnimatedAudioWave } from "@/app/components/AudioWave";
import { useAppContext } from "@/app/context-providers";
import { DocumentArrowUpIcon, MicrophoneIcon, PauseIcon, PlayIcon, StopCircleIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from "react";

const ReactMediaRecorder = dynamic(
    () => import('react-media-recorder').then((mod) => mod.ReactMediaRecorder),
    { ssr: false }
);

export const Recorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [showVisualizer, setShowVisualizer] = useState(false);
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

    useEffect(() => {
        if (isRecording) {
            const timer = setTimeout(() => setShowVisualizer(true), 300);
            return () => clearTimeout(timer);
        } else {
            setShowVisualizer(false);
        }
    }, [isRecording]);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <ReactMediaRecorder
                audio
                onStart={() => setIsRecording(true)}
                onStop={(_, blob) => {
                    setIsRecording(false);
                    handleStopVisit(blob);
                }}
                render={({ startRecording, stopRecording, pauseRecording, mediaBlobUrl }) => (
                    <div className="w-full max-w-2xl px-4">
                        <AnimatePresence mode="wait">
                            {!isRecording ? (
                                <motion.div
                                    key="initial"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center gap-8"
                                >
                                    <div className="text-center space-y-2">
                                        <h2 className="text-2xl font-bold">Start Visit Recording</h2>
                                        <p className="text-gray-500 max-w-md">
                                            Record audio directly or upload an existing recording to begin analysis
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <button
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all
                                            hover:shadow-lg hover:scale-102 active:scale-95 cursor-pointer"
                                            onClick={startRecording}
                                        >
                                            <MicrophoneIcon className="w-5 h-5" />
                                            <span className="font-medium">Start Recording</span>
                                        </button>

                                        <div className="text-gray-400">or</div>

                                        <button
                                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full transition-all
                                            hover:shadow-lg hover:scale-102 active:scale-95 cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <DocumentArrowUpIcon className="w-5 h-5" />
                                            <span className="font-medium">Upload File</span>
                                        </button>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="audio/*"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="recording"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center gap-8"
                                >
                                    <div className="text-center space-y-2">
                                        <h2 className="text-2xl font-bold">Recording Session</h2>
                                        <p className="text-gray-500">
                                            {isPaused ? "Paused" : "Active recording in progress"}
                                        </p>
                                    </div>

                                    <div className="w-full max-w-md relative h-40">
                                        <AnimatePresence>
                                            {showVisualizer && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="absolute inset-0"
                                                >
                                                    <AnimatedAudioWave animate={!isPaused} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-red-700 text-white rounded-full transition-all
                                            hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                                            onClick={stopRecording}
                                        >
                                            <MicrophoneIcon className="w-5 h-5" />
                                            <span className="font-medium">End Visit</span>
                                        </button>

                                        <button
                                            className="flex items-center justify-center w-12 h-12 bg-gray-700 hover:bg-gray-800 text-white rounded-full transition-all
                                            hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                                            onClick={() => {
                                                pauseRecording();
                                                setIsPaused(!isPaused);
                                            }}
                                        >
                                            {isPaused ? (
                                                <PlayIcon className="w-6 h-6" />
                                            ) : (
                                                <PauseIcon className="w-6 h-6" />
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            />
        </div>
    );
};
