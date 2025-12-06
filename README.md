# Sentinel-9: Real-Time Fraud Detection System

A hyper-realistic Next.js application simulating a phone call interface that detects fraud in real-time using OpenAI's GPT-4o.

DEMO:  https://sentinel-9.vercel.app/
INFO WEBSITE: https://v0-new-chat-weld-ten.vercel.app/

## Features

- **Dual Interface**: `/scammer` and `/victim` views simulating a live phone call.
- **Real-Time Analysis**: Transcribes audio and analyzes it for scam indicators using GPT-4o.
- **Dynamic UI**: The victim's interface reacts to the risk level, changing colors and displaying warnings.
- **Streaming Alerts**: Suspicious phrases are highlighted and streamed in real-time.
- **Push-to-Talk**: Realistic audio interaction.

## Getting Started

### Prerequisites

- Node.js installed.
- An OpenAI API Key.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/supervoltpack/HTR2026.git
    cd HTR2026
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env.local` file in the root directory and add your OpenAI API key:
    ```env
    OPENAI_API_KEY=your_api_key_here
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open the application:
    - **Landing Page**: [http://localhost:3000](http://localhost:3000)
    - **Victim Interface**: [http://localhost:3000/victim](http://localhost:3000/victim)
    - **Scammer Interface**: [http://localhost:3000/scammer](http://localhost:3000/scammer)

## How to Use

1.  Open the **Victim** interface in one window/tab and the **Scammer** interface in another.
2.  On either interface, **press and hold the microphone button** to speak.
3.  Release the button to send the audio.
4.  The system will transcribe the audio, analyze it, and update the Victim's UI if a scam is detected.
5.  Try phrases like "You must pay with gift cards" or "This is the IRS" to trigger the warnings.

## Restarting a Call

To reset the conversation history and risk score:

1.  Go to the **Landing Page** at [http://localhost:3000](http://localhost:3000).
2.  Click the **"Reset Simulation"** button.
3.  This will clear the conversation memory and reset the UI state for both interfaces.





Slide 2 Statistics:
$3.1B Lost annually to scams

Citation: FBI IC3 Elder Fraud Report
Link: [https://www.ic3.gov/Media/PDF/AnnualReport/2023_IC3ElderFraudReport.pdf](https://www.ic3.gov/Media/PDF/AnnualReport/2023_IC3ElderFraudReport.pdf)
Note: The FBI IC3 releases annual elder fraud reports. You may need to verify the exact figure for your specific year.



1 in 5 Elderly adults targeted

AARP Link: [https://www.aarp.org/money/scams-fraud/](https://www.aarp.org/money/scams-fraud/)
FTC Link: [https://www.ftc.gov/news-events/data-visualizations/data-spotlight](https://www.ftc.gov/news-events/data-visualizations/data-spotlight)
Note: AARP's Fraud Watch Network and FTC's Consumer Sentinel Network both track elder fraud statistics.



66% Increase in scam calls

Truecaller Link: [https://www.truecaller.com/blog/research/truecaller-insights-2023-us-spam-scam-report](https://www.truecaller.com/blog/research/truecaller-insights-2023-us-spam-scam-report)
Alternative - First Orion: [https://firstorion.com/scam-call-trends/](https://firstorion.com/scam-call-trends/)
Note: These companies release annual spam and scam call trend reports.
