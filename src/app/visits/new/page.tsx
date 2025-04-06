"use client";

import { ForwardRefEditor } from "@/app/components/ForwardRefEditor";
import { Loading } from "@/app/components/Loading";
import { State, Step, useAppContext } from "@/app/context-providers";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    useEffect
} from "react";
import { ProgressIndication } from "./components/ProgressIndication";
import { Recorder } from "./components/RecordVisit";

export default function NewVisitorPage({ params }: { params: { id: string } }) {
    const { step, state, handleContinue } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        const handleNavigation = () => {
            router.push(`/project/${params.id}`);
        };

        if (state === "finding-icd-probability") {
            handleNavigation();
        }
    }, [state, router, params.id]);

    let continueButtonText = "Continue";
    if (state === "editing-soap") {
        continueButtonText = "Confirm SOAP";
    } else if (state === "editing-icd-codes") {
        continueButtonText = "Confirm ICD Codes";
    } else if (state === "finding-icd-probability") {
        continueButtonText = "Finish";
    }

    const showContinueButton =
        state === "editing-soap" ||
        state === "editing-icd-codes" ||
        state === "finding-icd-probability";

    return (
        <div className="sidebar">
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold">Patient Visit</h2>
                <ProgressIndication step={step} />
            </div>
            <div className="flex flex-row gap-6">
                <div className="flex flex-1 flex-col items-end gap-3">
                    <Playground step={step} state={state} />
                    {showContinueButton && (
                        <button
                            className="px-4 py-2 text-white bg-blue-600 rounded-full disabled:opacity-50"
                            onClick={handleContinue}
                            disabled={
                                state === "generating-soap-document" ||
                                state === "determining-icd-codes"
                            }
                        >
                            {continueButtonText}
                        </button>
                    )}
                </div>
                <div className="flex flex-col gap-4">
                    <div className="w-[16rem] bg-gray-100 border border-gray-200 rounded-lg">
                        <div className="flex flex-col justify-center w-full h-full gap-4 p-4">
                            <h3 className="text-lg font-bold">Patient Name</h3>
                            <p className="text-sm text-gray-500">Patient ID: 123456</p>
                            <div className="flex flex-col gap-2">
                                <p>Date of Birth</p>
                                <p className="text-sm text-gray-500">01/01/1990</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p>Insurance Provider</p>
                                <p className="text-sm text-gray-500">ABC Insurance</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p>Policy Number</p>
                                <p className="text-sm text-gray-500">XYZ123456</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const loadingStates = {
    [Step.RecordOrUploadVisitRecording]: {
        message: "Loading Visit Recording",
        subMessage: "Please wait while we load the visit recording.",
    },
    [Step.GenerateVisitSOAPDocument]: {
        message: "Generating Visit SOAP Document",
        subMessage: "Please wait while we generate the visit SOAP document.",
    },
    [Step.CalculateICDCodesForVisit]: {
        message: "Calculating ICD Codes for Visit",
        subMessage: "Please wait while we calculate the ICD codes for the visit.",
    },
    [Step.FindProbabilityOfICDCode]: {
        message: "Finding Probability of ICD Code",
        subMessage:
            "Analyzing patient data to determine the probability of each ICD code.",
    },
};

const Playground = ({ step, state }: { step: Step; state: State }) => {
    return (
        <div className="w-full h-[40rem] max-h-[100%] border border-gray-200 rounded-lg">
            <AnimatePresence mode="wait">
                <motion.div
                    key={state}
                    className="w-full h-full flex items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.23 }}
                >
                    {/* {state === "start-visit" && <StartVisitRecording />} */}
                    {state === "visit-in-progress" || state === "start-visit" && <Recorder />}
                    {state === "generating-soap-document" && (
                        <Loading
                            message={loadingStates[step].message}
                            subMessage={loadingStates[step].subMessage}
                        />
                    )}
                    {state === "editing-soap" && <EditSOAP />}
                    {state === "determining-icd-codes" && (
                        <Loading
                            message={loadingStates[step].message}
                            subMessage={loadingStates[step].subMessage}
                        />
                    )}
                    {state === "editing-icd-codes" && <EditICDCodes />}
                    {state === "finding-icd-probability" && <FindICDProbability />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};





const EditSOAP = () => {
    const { soapData, setSoapData } = useAppContext();
    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            {/* <p>Edit SOAP Document</p>
            <textarea
                className="w-full h-64 border rounded p-2"
                value={soapData}
                onChange={(e) => setSoapData(e.target.value)}
            ></textarea> */}

            <ForwardRefEditor
                className="w-full h-full text-gray-700 bg-transparent border-none focus:outline-none"
                markdown={soapData}
                onChange={(value) => setSoapData(value)}
                contentEditableClassName="prose h-[30rem] overflow-y-auto"
            />
        </div>
    );
};

const EditICDCodes = () => {
    const { icdData } = useAppContext();
    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <p>Edit ICD Codes</p>
            {icdData.map((icd, index) => (
                <ICDBlock
                    key={index}
                    code={icd.code}
                    description={icd.description}
                />
            ))}
        </div>
    );
};


const ICDBlock = ({ code, description }: { code: string; description: string }) => {
    return (
        <div className="flex flex-row items-center justify-between w-full p-2 border-b border-gray-200">
            <div className="flex flex-col">
                <p className="text-sm font-semibold">{code}</p>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
        </div>
    );
}

const FindICDProbability = () => {
    const { soapData, icdData } = useAppContext();
    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <p>SOAP Document:</p>
            <textarea
                className="w-full h-32 border rounded p-2"
                value={soapData}
                readOnly
            ></textarea>
            <p>ICD Codes:</p>
            {/* <textarea
                className="w-full h-32 border rounded p-2"
                value={icdData}
                readOnly
            ></textarea> */}
            <p>Probability Analysis:</p>
            {/* Add your probability analysis component here */}
            <div>[Probability Analysis Component Placeholder]</div>
        </div>
    );
};



