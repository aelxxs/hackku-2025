import { Step } from "@/app/context-providers";
import { CheckIcon, DocumentIcon, FolderIcon, MicrophoneIcon, StarIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { motion } from "framer-motion";

const steps = {
    [Step.RecordOrUploadVisitRecording]: {
        title: "Visit Documentation Initiation",
        description: "Begin by recording a new consultation or uploading existing audio for analysis",
        icon: MicrophoneIcon,
    },
    [Step.GenerateVisitSOAPDocument]: {
        title: "Clinical Documentation Automation",
        description: "AI-powered generation of SOAP notes from consultation audio",
        icon: DocumentIcon,
    },
    [Step.CalculateICDCodesForVisit]: {
        title: "Diagnostic Code Optimization",
        description: "Review and refine automatically suggested ICD codes for accuracy",
        icon: FolderIcon,
    },
    [Step.FindProbabilityOfICDCode]: {
        title: "Diagnostic Validation Analysis",
        description: "Predictive modeling of code approval likelihood based on clinical history",
        icon: StarIcon,
    },
};



export const ProgressIndication = ({ step }: { step: Step }) => {
    return (
        <ol className="relative text-gray-500 border-s border-gray-200 border-l-[1.25px] ml-3">
            {Object.entries(steps).map(([key, value], i) => (
                <li
                    key={key}
                    className={`ms-8 ${i === Object.values(steps).length - 1 ? "" : "mb-14"
                        }`}
                >
                    <span
                        className={classNames(
                            "absolute flex items-center justify-center w-10 h-10 rounded-full -start-5 ring-5 ring-white",
                            i < step ? "bg-green-200 text-green-500" : "bg-gray-200",
                            i === step && "ring-gray-700 ring-2"
                        )}
                    >
                        {i < step ? (
                            <CheckIcon className="w-5 h-5" />
                        ) : (
                            <value.icon className="w-5 h-5 stroke-1.5" />
                        )}
                    </span>

                    <motion.h3
                        className={`font-medium leading-tight ${step === +key && "text-black"
                            }`}
                        initial={{ color: step === +key ? "black" : "gray" }}
                        animate={{ color: step === +key ? "black" : "gray" }}
                    >
                        {value.title}
                    </motion.h3>
                    {step === +key && (
                        <motion.div
                            className="text-sm overflow-hidden mt-1"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            layout
                        >
                            <p>{value.description}</p>
                        </motion.div>
                    )}
                </li>
            ))}
        </ol>
    );
};

