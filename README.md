# Novable 🚀

GrowthPilot is an AI-powered platform that helps businesses generate professional websites and digital content using Google Vertex AI.

---

# Tech Stack

- Python 3.12+
- Google Vertex AI
- Gemini 2.5 Flash
- FastAPI
- Pydantic
- Git

---

# Project Structure

```
growthpilot/

├── agents/
│   └── website_agent.py

├── prompts/
│   └── website_prompt.py

├── schemas/
│   └── website_schema.py

├── services/
│   └── gemini_service.py

├── app.py
├── test.py
├── requirements.txt
└── README.md
```

---

# Setup Guide

## 1. Clone the Repository

```bash
git clone <repository-url>
cd growthpilot
```

---

## 2. Create a Virtual Environment

Windows

```bash
python -m venv .venv
```

Activate

```bash
.venv\Scripts\activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Google Cloud Setup

## Step 1

Install Google Cloud CLI

https://cloud.google.com/sdk/docs/install

Verify installation

```bash
gcloud --version
```

---

## Step 2

Login

```bash
gcloud auth login
```

---

## Step 3

Authenticate Application Default Credentials

```bash
gcloud auth application-default login
```

This step is **required** for Vertex AI.

---

## Step 4

Set the project

```bash
gcloud config set project growthpilot-500605
```

Verify

```bash
gcloud config list
```

You should see

```
account = your-email@gmail.com
project = growthpilot-500605
```

---

## Step 5

Enable Vertex AI API

Open

https://console.cloud.google.com/apis/library/aiplatform.googleapis.com

Select the **growthpilot-500605** project.

Click **Enable**.

---

# Environment Variables

Create a `.env` file in the project root.

```
GOOGLE_CLOUD_PROJECT=growthpilot-500605
GOOGLE_CLOUD_LOCATION=us-central1
```

---

# Running the AI Test

Run

```bash
python test.py
```

If everything is configured correctly, you should receive generated website content from Gemini.

---

# AI Architecture

```
BusinessInput
      │
      ▼
Prompt Builder
      │
      ▼
Website Agent
      │
      ▼
Gemini Service
      │
      ▼
Vertex AI
      │
      ▼
WebsiteOutput
```

The AI layer uses:

- Structured Outputs
- Pydantic schemas
- Google Vertex AI
- Gemini 2.5 Flash

---

# Current Features

- Website generation
- Structured JSON responses
- Vertex AI integration
- Prompt management
- Pydantic validation
