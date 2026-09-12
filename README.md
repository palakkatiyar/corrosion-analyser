# Corrosion Analyser — AI Powered

A single-page web app that detects corrosion in photos using Gemini Vision AI. Upload an image of any structure, equipment, or surface and it identifies corrosion, assesses severity, and recommends actions.

## Setup

1. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).
2. Create a `.env` file in this folder (it is git-ignored):

   ```
   GEMINI_API_KEY=your_key_here
   ```

## Run

Serve the folder with any static server, then open the page:

```bash
python -m http.server 8000
```

Open http://localhost:8000/corrosion_analyser.html in your browser.

> Note: the page must be served over HTTP (not opened as a file) so it can read the `.env` file. The API key is used client-side, so don't host this publicly with your key in place.
