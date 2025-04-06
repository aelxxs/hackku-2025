"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

export enum Step {
    RecordOrUploadVisitRecording,
    GenerateVisitSOAPDocument,
    CalculateICDCodesForVisit,
    FindProbabilityOfICDCode,
}

export type State =
    | "start-visit"
    | "visit-in-progress"
    | "generating-soap-document"
    | "editing-soap"
    | "determining-icd-codes"
    | "editing-icd-codes"
    | "finding-icd-probability";


type ICDData = {
    code: string;
    description: string;
}

type AppContextType = {
    step: Step;
    setStep: (step: Step) => void;
    state: State;
    setState: (state: State) => void;
    soapData: string;
    setSoapData: (soapData: string) => void;
    icdData: ICDData[];
    setIcdData: (icdData: ICDData[]) => void;
    handleStartVisit: () => void;
    handleStopVisit: (file: Blob) => Promise<void>;
    handleConfirmSOAP: () => Promise<void>;
    handleConfirmICD: () => Promise<void>;
    handleContinue: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [step, setStep] = useState(Step.RecordOrUploadVisitRecording);
    const [state, setState] = useState<State>("start-visit");
    const [soapData, setSoapData] = useState("");
    const [icdData, setIcdData] = useState<ICDData[]>([])

    useEffect(() => {
        // Update step based on state
        switch (state) {
            case "start-visit":
                setStep(Step.RecordOrUploadVisitRecording);
                break;
            case "generating-soap-document":
                setStep(Step.GenerateVisitSOAPDocument);
                break;
            case "editing-soap":
                setStep(Step.GenerateVisitSOAPDocument);
                break;
            case "determining-icd-codes":
                setStep(Step.CalculateICDCodesForVisit);
                break;
            case "editing-icd-codes":
                setStep(Step.CalculateICDCodesForVisit);
                break;
            case "finding-icd-probability":
                setStep(Step.FindProbabilityOfICDCode);
                break;
            default:
                break;
        }
    }, [state]);

    const handleStartVisit = useCallback(() => {
        setState("visit-in-progress");
    }, [setState]);

    const handleStopVisit = useCallback(async (file: Blob) => {
        console.log({ file, type: file.type });

        if (!file) {
            console.error("No mediaBlobUrl provided");
            return;
        }

        setState("generating-soap-document");
        try {
            const formData = new FormData();
            formData.append("audio", file);

            const response = await fetch("/api/generatesoapfromaudio", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            const result = await response.json();
            setSoapData(result.text);
            setState("editing-soap");
        } catch (error) {
            console.error("Error generating SOAP from audio:", error);
            alert("Failed to generate SOAP document. Please try again.");
            setState("start-visit");
        }
    }, [setState, setSoapData]);


    const handleConfirmSOAP = useCallback(async () => {
        setState("determining-icd-codes");
        try {
            const response = await fetch("/api/generateicdfromsoap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ soapNotes: soapData }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setIcdData(result.codes);
            setState("editing-icd-codes");
        } catch (error) {
            console.error("Error generating ICDs from SOAP:", error);
            alert("Failed to generate ICD codes. Please try again.");
            setState("editing-soap");
        }
    }, [soapData, setState, setIcdData]);

    const handleConfirmICD = useCallback(async () => {
        setState("finding-icd-probability");
        try {
            const response = await fetch("/checkICDApprovalRates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ icdCodes: icdData }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            // Handle the approval rates as needed
            console.log("ICD Approval Rates:", result);
        } catch (error) {
            console.error("Error checking ICD approval rates:", error);
            alert("Failed to check ICD approval rates. Please try again.");
        }
    }, [icdData, setState]);

    const value: AppContextType = {
        step,
        setStep,
        state,
        setState,
        soapData,
        setSoapData,
        icdData,
        setIcdData,
        handleStartVisit,
        handleStopVisit,
        handleConfirmSOAP,
        handleConfirmICD,
        handleContinue: () => {
            // based on the current step, you can define what to do next
            switch (step) {
                case Step.RecordOrUploadVisitRecording:
                    handleStartVisit();
                    break;
                case Step.GenerateVisitSOAPDocument:
                    handleConfirmSOAP();
                    break;
                case Step.CalculateICDCodesForVisit:
                    handleConfirmICD();
                    break;
                case Step.FindProbabilityOfICDCode:
                    // Handle the logic for this step
                    break;
                default:
                    break;
            }
        }
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
