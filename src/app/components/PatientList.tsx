"use client";
import { useRouter } from 'next/navigation';

type PatientData = {
    PatientID: string;
    fname: string;
    lname: string;
    preferredName: string;
    dateOfBirth: string;
    sex: string;
    providerID: string;
    phoneNum: string;
    email: string;
}

export const patients = [
    {
        "PatientID": "20f2e103-cda3-4038-9b8b-5a4287164d6a",
        "fname": "Samantha",
        "lname": "Lawson",
        "preferredName": "Samantha",
        "dateOfBirth": "2003-09-19",
        "sex": "F",
        "providerID": "IND901",
        "phoneNum": "454-023-9223",
        "email": "matthewtaylor@gmail.com"
    },
    {
        "PatientID": "fa051d44-dd64-45bb-b818-0bbf036c07bb",
        "fname": "Raven",
        "lname": "Smith",
        "preferredName": "Raven",
        "dateOfBirth": "1949-02-27",
        "sex": "F",
        "providerID": "HEA581",
        "phoneNum": "700-907-5416",
        "email": "lynn72@hotmail.com"
    },
    {
        "PatientID": "b531b75c-5fcc-4560-9364-81510ee70fe4",
        "fname": "Robert",
        "lname": "George",
        "preferredName": "Robert",
        "dateOfBirth": "1968-01-19",
        "sex": "M",
        "providerID": "POI314",
        "phoneNum": "990-890-3037",
        "email": "yateskenneth@hotmail.com"
    },
    {
        "PatientID": "5b82821a-f582-4e85-8d6f-68dbe7245721",
        "fname": "Sonya",
        "lname": "Clark",
        "preferredName": "Sonya",
        "dateOfBirth": "1963-05-17",
        "sex": "F",
        "providerID": "CEN784",
        "phoneNum": "417-081-7007",
        "email": "ewaters@yahoo.com"
    },
    {
        "PatientID": "4d3a89d7-5e85-4913-a309-32022bf324ba",
        "fname": "Kayla",
        "lname": "Cortez",
        "preferredName": "Kayla",
        "dateOfBirth": "1980-08-01",
        "sex": "F",
        "providerID": "HIG748",
        "phoneNum": "984.387.4511",
        "email": "bgalloway@simpson.com"
    },
    {
        "PatientID": "2e84dc62-250d-4bbc-bd69-901201c82a67",
        "fname": "Deborah",
        "lname": "Davis",
        "preferredName": "Deborah",
        "dateOfBirth": "1973-06-25",
        "sex": "M",
        "providerID": "BLU001",
        "phoneNum": "184-129-1359",
        "email": "zwilliams@hall-medina.com"
    },
    {
        "PatientID": "674b2860-1158-4ec8-aa32-edc040d1be00",
        "fname": "Leslie",
        "lname": "Ibarra",
        "preferredName": "Leslie",
        "dateOfBirth": "2005-01-08",
        "sex": "F",
        "providerID": "BLU189",
        "phoneNum": "911-649-0365",
        "email": "ssnyder@yahoo.com"
    },
    {
        "PatientID": "5e340dd3-e6f9-431c-8618-d25b4ce845af",
        "fname": "Patricia",
        "lname": "Ferguson",
        "preferredName": "Patricia",
        "dateOfBirth": "1958-03-18",
        "sex": "F",
        "providerID": "MOL554",
        "phoneNum": "950-190-2488",
        "email": "karen97@best-smith.info"
    },
    {
        "PatientID": "21f60c1e-67bb-456c-ae5e-c614c278248a",
        "fname": "Sandra",
        "lname": "Wilson",
        "preferredName": "Sandra",
        "dateOfBirth": "1996-09-06",
        "sex": "M",
        "providerID": "BLU576",
        "phoneNum": "678-511-3677",
        "email": "lsanchez@gmail.com"
    },
    {
        "PatientID": "42e137d1-f85e-4ec0-a96a-7279173d0b7d",
        "fname": "James",
        "lname": "Molina",
        "preferredName": "James",
        "dateOfBirth": "1962-01-03",
        "sex": "F",
        "providerID": "BLU189",
        "phoneNum": "214-710-1731",
        "email": "codybowman@baker.org"
    },
    {
        "PatientID": "23771c99-f562-4514-98b0-f2a081c1e5e2",
        "fname": "Kristine",
        "lname": "Bryan",
        "preferredName": "Kristine",
        "dateOfBirth": "1971-09-03",
        "sex": "M",
        "providerID": "GUI552",
        "phoneNum": "018-929-4441",
        "email": "jonathan40@yahoo.com"
    },
    {
        "PatientID": "1110b75b-4ec3-4422-a6ce-a262df1fe15c",
        "fname": "Jeffrey",
        "lname": "Rodriguez",
        "preferredName": "Jeffrey",
        "dateOfBirth": "1975-05-15",
        "sex": "F",
        "providerID": "MET161",
        "phoneNum": "579-504-8272",
        "email": "jacqueline59@gmail.com"
    },
    {
        "PatientID": "bf241bea-f06c-4845-8849-fdc41b161d3d",
        "fname": "Jennifer",
        "lname": "Neal",
        "preferredName": "Jennifer",
        "dateOfBirth": "1977-04-11",
        "sex": "M",
        "providerID": "IND901",
        "phoneNum": "243-807-8794",
        "email": "dianesimmons@mills-morris.net"
    },
    {
        "PatientID": "795ac7b4-8885-4bcb-8131-432a858869ce",
        "fname": "Elizabeth",
        "lname": "Arroyo",
        "preferredName": "Elizabeth",
        "dateOfBirth": "1975-11-23",
        "sex": "F",
        "providerID": "BLU189",
        "phoneNum": "821-212-1319",
        "email": "mistycarter@hotmail.com"
    },
    {
        "PatientID": "0c944ae3-a556-44e9-b48d-f4473d0912f5",
        "fname": "Andrew",
        "lname": "Jordan",
        "preferredName": "Andrew",
        "dateOfBirth": "2000-08-11",
        "sex": "M",
        "providerID": "UPM631",
        "phoneNum": "094-443-5945x",
        "email": "brendajennings@yahoo.com"
    },
    {
        "PatientID": "6c3c0da5-4010-493d-ad2b-3fb7b7455d57",
        "fname": "Tommy",
        "lname": "Cochran",
        "preferredName": "Tommy",
        "dateOfBirth": "1974-12-05",
        "sex": "F",
        "providerID": "UPM631",
        "phoneNum": "712-419-8626",
        "email": "leemaria@gmail.com"
    },
    {
        "PatientID": "da1f2f1a-d134-4e27-91bb-7ea7037f2437",
        "fname": "Kimberly",
        "lname": "Bailey",
        "preferredName": "Kimberly",
        "dateOfBirth": "1954-03-15",
        "sex": "F",
        "providerID": "HEA214",
        "phoneNum": "731-774-7201",
        "email": "jacquelinegordon@yahoo.com"
    },
    {
        "PatientID": "b24c11ac-6835-47f2-be0e-b271e70cf33b",
        "fname": "Tina",
        "lname": "White",
        "preferredName": "Tina",
        "dateOfBirth": "1955-08-28",
        "sex": "F",
        "providerID": "KAI393",
        "phoneNum": "577-481-9447",
        "email": "johnhill@manning.com"
    },
    {
        "PatientID": "04d80ce4-4940-4bea-a5ef-b0fa36c2b007",
        "fname": "Aaron",
        "lname": "Gonzalez",
        "preferredName": "Aaron",
        "dateOfBirth": "1962-12-04",
        "sex": "M",
        "providerID": "HEA304",
        "phoneNum": "537-095-7318",
        "email": "hthompson@hernandez-riley.info"
    },
    {
        "PatientID": "7bf0890d-5732-435f-af9f-61b046ffee05",
        "fname": "John",
        "lname": "Murray",
        "preferredName": "John",
        "dateOfBirth": "1995-08-25",
        "sex": "M",
        "providerID": "BLU189",
        "phoneNum": "591-943-7264",
        "email": "swells@hotmail.com"
    }
] as PatientData[];

export const getPatientById = (id: string) => {
    return patients.find((patient) => patient.PatientID === id);
}

export const PatientList = () => {
    return (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto p-4">
            {patients.map((patient) => (
                <PatientCard key={patient.PatientID} patient={patient} />
            ))}
        </div>
    )
}

const PatientCard = ({ patient }: { patient: PatientData }) => {
    const router = useRouter();
    return (
        <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="p-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                {/* Main Patient Info */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${patient.sex === 'M' ? 'bg-blue-400' : 'bg-pink-400'
                            }`}></div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {patient.preferredName} {patient.lname}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <p className="text-gray-500">Date of Birth</p>
                            <p className="font-medium">
                                {new Date(patient.dateOfBirth).toLocaleDateString()}
                                ({calculateAge(patient.dateOfBirth)} years)
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-gray-500">Contact</p>
                            <p className="font-medium">{patient.phoneNum}</p>
                            <p className="text-blue-600 hover:underline">
                                <a href={`mailto:${patient.email}`}>{patient.email}</a>
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-gray-500">Provider ID</p>
                            <p className="font-mono font-medium text-purple-600">
                                #{patient.providerID}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-gray-500">Patient ID</p>
                            <p className="font-mono text-xs text-gray-500 break-all">
                                {patient.PatientID}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col justify-between">
                    <button
                        onClick={() => router.push(`/visit/${patient.PatientID}`)}
                        className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all
                        flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Start Visit
                    </button>
                </div>
            </div>
        </div>
    )
}

// Helper function to calculate age
export const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
