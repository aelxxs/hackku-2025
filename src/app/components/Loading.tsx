

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Loading = ({
    message,
    subMessage,
    progressSteps,
    duration
}: {
    message: string;
    subMessage: string;
    progressSteps?: string[];
    duration?: number;
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    // Simulate completion flow
    useEffect(() => {
        if (!progressSteps) return;

        const timer = setTimeout(() => {
            if (currentStep < progressSteps.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setIsComplete(true);
                // Show spinner after 2 seconds of completion
                const spinnerTimer = setTimeout(() => {
                    setShowSpinner(true);
                }, 1000);

                return () => clearTimeout(spinnerTimer);
            }
        }, duration ?? 3000); // 3s per step

        return () => clearTimeout(timer);
    }, [currentStep, progressSteps]);

    // Reset on new steps
    useEffect(() => {
        setCurrentStep(0);
        setIsComplete(false);
        setShowSpinner(false);
    }, [progressSteps]);

    return (
        <div className="max-w-xl w-full flex flex-col space-y-8 ">
            <div className="space-y-4 flex flex-col">
                <h2 className="text-2xl font-semibold">{message}</h2>
                <p className="text-gray-600">{subMessage}</p>
            </div>

            {progressSteps && (
                <div className="space-y-4">
                    {/* Step Indicators */}
                    <div className="flex flex-col gap-2">
                        {progressSteps.map((step, index) => (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: index <= currentStep ? 1 : 0.4,
                                    y: 0
                                }}
                                transition={{ duration: 0.3 }}
                                className={`flex items-center gap-3 ${index === currentStep ? 'text-blue-600' :
                                    index < currentStep ? 'text-green-600' : 'text-gray-400'
                                    }`}
                            >
                                <div className="w-4 h-4 flex items-center justify-center">
                                    {index === currentStep ? (
                                        <motion.div
                                            className="w-2 h-2 bg-blue-600 rounded-full"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1.2, repeat: Infinity }}
                                        />
                                    ) : index < currentStep ? (
                                        <CheckCircleIcon className="w-8 h-8 text-green-500" />
                                    ) : (
                                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                    )}
                                </div>
                                <span className="text-sm">{step}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress Bar / Spinner Container */}
                    <div className="h-12 flex items-center ">
                        {showSpinner ? (
                            <motion.div
                                className="flex items-center gap-2 w-full"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-4 h-4 text-gray-200 animate-spin fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span>Finalizing document...</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{
                                        width: isComplete ? '100%' : `${((currentStep + 1) / progressSteps.length) * 100}%`
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full bg-blue-600 rounded-full"
                                />
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
