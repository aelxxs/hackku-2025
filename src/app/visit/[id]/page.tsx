"use client";

import { ForwardRefEditor } from "@/app/components/ForwardRefEditor";
import { Loading } from "@/app/components/Loading";
import { calculateAge, getPatientById } from "@/app/components/PatientList";
import { ICDWithProbability, State, Step, useAppContext } from "@/app/context-providers";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    useEffect,
    useRef,
    useState
} from "react";
import { useDebouncedCallback } from 'use-debounce';
import { ProgressIndication } from "./components/ProgressIndication";
import { Recorder } from "./components/RecordVisit";


export default function NewVisitorPage({ params }: { params: { id: string } }) {
    const { step, state, handleContinue, setProvider } = useAppContext();
    const router = useRouter();

    const patient = getPatientById(params.id)!;

    setProvider(patient.providerID);

    useEffect(() => {
        if (!patient) {
            router.push("/");
        }
    }, [patient, router]);

    // useEffect(() => {
    //     const handleNavigation = () => {
    //         router.push(`/project/${params.id}`);
    //     };

    //     if (state === "finding-icd-probability") {
    //         handleNavigation();
    //     }
    // }, [state, router, params.id]);

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
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${patient.sex === 'M' ? 'bg-blue-400' : 'bg-pink-400'
                                    }`} />
                                <h3 className="text-lg font-bold">
                                    {patient.preferredName} {patient.lname}
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Patient ID</p>
                                    <p className="text-xs font-mono text-gray-700 break-all">
                                        {patient.PatientID}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Date of Birth</p>
                                    <p className="text-sm text-gray-700">
                                        {new Date(patient.dateOfBirth).toLocaleDateString()}
                                        <span className="block text-xs text-gray-500">
                                            ({calculateAge(patient.dateOfBirth)} years)
                                        </span>
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Contact</p>
                                    <p className="text-sm text-gray-700">
                                        {patient.phoneNum}
                                        <span className="block text-blue-600 hover:underline">
                                            <a href={`mailto:${patient.email}`}>{patient.email}</a>
                                        </span>
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Provider ID</p>
                                    <p className="font-mono font-medium text-purple-600">
                                        #{patient.providerID}
                                    </p>
                                </div>
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
        message: "Processing Visit Recording",
        subMessage: "Loading and analyzing audio data...",
        progressSteps: [
            "Reading audio transcription",
            "Extracting relevant keywords",
            "Preparing for SOAP generation"
        ]
    },
    [Step.GenerateVisitSOAPDocument]: {
        message: "Generating SOAP Document",
        subMessage: "Organizing clinical findings...",
        progressSteps: [
            "Structuring subjective data",
            "Formatting objective metrics",
            "Analyzing assessment patterns",
            "Creating plan recommendations"
        ]
    },
    [Step.CalculateICDCodesForVisit]: {
        message: "Calculating ICD Codes",
        subMessage: "Matching conditions to classifications...",
        progressSteps: [
            "Identifying key diagnoses",
            "Cross-referencing medical databases",
            "Validating code accuracy"
        ]
    },
    [Step.FindProbabilityOfICDCode]: {
        message: "Analyzing Code Probability",
        subMessage: "Calculating diagnostic confidence...",
        progressSteps: [
            "Reviewing patient history",
            "Comparing symptom patterns",
            "Generating probability matrix"
        ]
    }
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
                            progressSteps={loadingStates[step].progressSteps}
                            duration={3500}
                        />
                    )}
                    {state === "editing-soap" && <EditSOAP />}
                    {state === "determining-icd-codes" && (
                        <Loading
                            message={loadingStates[step].message}
                            subMessage={loadingStates[step].subMessage}
                            progressSteps={loadingStates[step].progressSteps}
                            duration={350}
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
        <div className="flex flex-col items-center justify-center w-full h-full overflow-auto gap-4">
            <ForwardRefEditor
                className="w-full h-full text-gray-700 bg-transparent border-none focus:outline-none"
                markdown={soapData}
                onChange={(value) => setSoapData(value)}
                contentEditableClassName="prose h-full overflow-y-auto"
            />
        </div>
    );
};

// Custom hook for click-outside detection
const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [ref, callback]);
};

const EditICDCodes = () => {
    const { icdData, setIcdData } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isError, setIsError] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click-outside handler
    useClickOutside(dropdownRef, () => {
        setSearchResults([])
        setSearchTerm("");
        setIsSearching(false);
        setIsError(false);
        setSelectedIndex(0);
    });

    // Debounced search with error handling
    const debouncedSearch = useDebouncedCallback(async (term: string) => {
        if (term.length > 2) {
            setIsSearching(true);
            setIsError(false);
            try {
                const response = await fetch(`/api/searchicd?query=${term}`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error("Search failed:", error);
                setIsError(true);
            }
            setIsSearching(false);
        } else {
            setSearchResults([]);
        }
    }, 300);

    const handleAddCode = (newCode: any) => {
        if (!icdData.some(code => code.code === newCode.code)) {
            setIcdData(prev => [...prev, newCode]);
            setSearchResults(prev => prev.filter(r => r.code !== newCode.code));
        }
    };

    // Keyboard navigation handler
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (searchResults.length > 0) {
            if (e.key === 'ArrowDown') {
                setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
                handleAddCode(searchResults[selectedIndex]);
            }
        }
    };

    return (
        <div className="w-full h-full p-4 space-y-4">
            {/* Search Container */}
            <div className="max-w-md mx-auto relative" ref={dropdownRef}>
                {/* Accessible Label */}
                <label
                    htmlFor="icd-search-input"
                    className="block text-sm font-medium text-gray-700 mb-1 sr-only"
                >
                    Search ICD codes
                </label>

                <div className="relative">
                    <input
                        id="icd-search-input"
                        type="text"
                        placeholder="Search ICD codes..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            debouncedSearch(e.target.value);
                            setSelectedIndex(0); // Reset selection on new input
                        }}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full
                     focus:ring-blue-500 focus:border-blue-500 pr-10"
                        aria-describedby="search-instructions"
                        aria-autocomplete="list"
                        aria-controls="search-results"
                        aria-expanded={searchResults.length > 0}
                    />

                    {/* Loading Indicator */}
                    {isSearching && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                            <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Screen Reader Instructions */}
                <div id="search-instructions" className="sr-only">
                    Search by ICD code or description. Use arrow keys to navigate results.
                    Press Enter to select a code.
                </div>

                {/* Error Message */}
                {isError && (
                    <div role="alert" className="text-red-600 mt-2 text-sm">
                        Error loading results. Please try again.
                    </div>
                )}

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div
                        role="listbox"
                        id="search-results"
                        aria-labelledby="icd-search-input"
                        className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                        {searchResults.map((result, index) => (
                            <div
                                role="option"
                                aria-selected={index === selectedIndex}
                                key={result.code}
                                className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between
                  ${index === selectedIndex ? 'bg-blue-50' : ''}`}
                                onClick={() => handleAddCode(result)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                {/* Stacked Code + Description */}
                                <div className="flex flex-col gap-1">
                                    <div>
                                        <span className="text-sm font-semibold bg-blue-50 text-blue-800 px-2 py-1 rounded-md">
                                            {result.code}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 pl-2">{result.description}</p>
                                </div>

                                {/* Add Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddCode(result);
                                    }}
                                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap
                    ${icdData.some(c => c.code === result.code) ?
                                            'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                            'bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer'
                                        }`}
                                    disabled={icdData.some(c => c.code === result.code)}
                                >
                                    {icdData.some(c => c.code === result.code) ? 'Added' : 'Add'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Live Region for Results */}
            {searchResults.length > 0 && (
                <div aria-live="polite" className="sr-only">
                    {searchResults.length} results found
                </div>
            )}

            {/* Current Codes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {icdData.map((icd) => (
                    <ICDBlock
                        key={icd.code}
                        code={icd.code}
                        description={icd.description}
                        onDelete={() => setIcdData(prev => prev.filter(c => c.code !== icd.code))}
                    />
                ))}
            </div>
        </div>
    );
};

// ICD Block Component
const ICDBlock = ({ code, description, onDelete }: {
    code: string;
    description: string;
    onDelete: () => void;
}) => {
    return (
        <div className="relative bg-white border border-gray-200 rounded-lg p-4 pr-12 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold bg-blue-50 text-blue-800 px-2 py-1 rounded-md">
                        {code}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{description}</p>
            </div>

            <button
                onClick={onDelete}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1 rounded-full
                  hover:bg-red-50 transition-colors cursor-pointer"
                aria-label={`Delete ${code}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};
// Helper hook for debouncing




const ICDProbabilityBlock = ({ code, description, probability }: ICDWithProbability) => {
    const percentage = Math.round(probability * 100);

    // Color determination
    const getColorClasses = (percent: number) => {
        if (percent >= 90) return 'from-green-400 to-green-600';
        if (percent >= 75) return 'from-green-300 to-green-500';
        if (percent >= 60) return 'from-yellow-400 to-yellow-600';
        if (percent >= 45) return 'from-orange-400 to-orange-600';
        return 'from-red-400 to-red-600';
    };

    const colorClasses = getColorClasses(percentage);

    return (
        <div className="relative bg-white border border-gray-200 rounded-lg p-4 pr-12 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-3">
                {/* Code + Description */}
                <div className="flex items-start gap-3">
                    <span className="text-sm font-semibold bg-blue-50 text-blue-800 px-2.5 py-1.5 rounded-md">
                        {code}
                    </span>
                    <p className="text-sm text-gray-600 flex-1">{description}</p>
                </div>

                {/* Probability Meter */}
                <div className="space-y-1.5">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${colorClasses} rounded-full`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-600">
                            Approval Confidence
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                            {percentage}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FindICDProbability = () => {
    const { icdsWithProbability } = useAppContext();
    const { provider } = useAppContext(); // Assuming you have this in context

    return (
        <div className="w-full h-full p-4">
            <div className="mb-6 max-w-lg">
                <h2 className="text-2xl font-semibold mb-2">
                    ICD Code Approval Rates
                </h2>
                <p className="text-gray-600 text-sm">
                    The confidence levels are based on historical data and may vary depending on specific patient conditions.
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-500 mb-2">
                    Provider ID: <span className="font-mono font-medium text-purple-600">
                        #{provider}</span>
                </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                {icdsWithProbability.map((icd) => (
                    <ICDProbabilityBlock key={icd.code} {...icd} />
                ))}
            </div>

            {/* Optional Loading State */}
            {icdsWithProbability.length === 0 && (
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Calculating probabilities...</p>
                </div>
            )}
        </div>
    );
};
