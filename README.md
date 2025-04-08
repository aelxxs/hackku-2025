# EirAI

**EirAI** is an AI-powered assistant that streamlines clinical documentation and supports medical coding workflows. Designed for healthcare professionals and medical coders, EirAI transcribes patient-doctor conversations into standardized SOAP notes, extracts ICD-10 codes, and predicts insurance approval rates using historical data.

## Achievements
- 🥈 2nd Place – **Themed Track** @ HackKU 2025

## Key Features

- **Speech-to-Text Transcription**  
  Converts live or recorded doctor-patient conversations into structured SOAP notes (Subjective, Objective, Assessment, Plan).

- **ICD-10 Code Extraction**  
  Automatically identifies and indexes relevant ICD-10 codes from SOAP notes, covering all ~73,000 classification codes.

- **Approval Rate Prediction**  
  Cross-references ICD codes with a custom-built dataset of 1.5M+ simulated historical records to estimate likelihood of insurance approval per provider.

- **Scalable & Modular Design**  
  Built with extensibility in mind, enabling future integration with EHR systems, payer APIs, and provider workflows.

## 🧠 Tech Stack

- **Frontend**: (To be updated)
- **Backend**: Python, Flask/FastAPI (optional)
- **AI Models**: Whisper (speech-to-text), spaCy/NLP for note structuring, custom ML for code classification
- **Data**: Custom dataset simulating 1.5M+ historical claims and all ICD-10 codes
- **Infrastructure**: Docker, GitHub Actions (CI/CD planned)

## Dataset Highlights

- ~73,000 ICD-10 codes indexed
- 1.5 million+ rows of simulated insurance claim data
- Provider-specific historical approval trends
