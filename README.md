# CivicPulse Dashboard 🏙️

**CivicPulse** is a production-grade, brutalist frontend dashboard designed to represent a modern mission-control center for Smart City administration. It integrates real-time telemetry (weather, live currency cross-rates), simulated active citizen profiling, and a live AI assistant.

Built out with a distinct **high-contrast neon brutalist** aesthetic, the application shuns generic "AI-generated" glassmorphism for a tight, editorial look mixing heavy structural fonts (`Syne`) and hyper-utilitarian datastreams (`Space Mono`). 

## 🛠️ Tech Stack & Why It Was Chosen

1. **Vite + React (Hooks)**: The application is fundamentally a frontend Single Page Application (SPA). React functional components allow modular breakdown of the data cards, and Vite ensures lightning-rapid development hot-reloading and heavily optimized production builds.
2. **Vanilla System CSS**: We completely bypassed heavy UI frameworks (Tailwind, Bootstrap) to build a truly bespoke, bespoke brutalist design system injected via CSS properties in `index.css`. This guarantees uniqueness and zero unused utility bloat.
3. **Hugging Face (`router.huggingface.co`)**: We harness Serverless Inference routing connecting directly to Llama 3 (`meta-llama/Llama-3.1-8B-Instruct`). This allows the LLM API to operate exclusively front-end (avoiding server costs) while still providing robust contextual math calculations and systemic data handling natively.
4. **Custom Integrations**:
   - `WeatherAPI`: Tracks real-time climate conditions and dynamically resolves global cities smoothly based on immediate device geocoding.
   - `ER-API`: Free-tier live foreign currency evaluation with a quick-convert utility module inline.
   - `RandomUser`: High-contrast "ID scans" simulating civic monitoring flows.

## 🚀 Running Locally

You'll need `Node.js` installed on your machine.

**1. Clone and Install Dependencies:**
```bash
git clone https://github.com/Vivek-Krishna00/FOAIExam.git
cd FOAIExam  # Or whatever you name the folder
npm install
```

**2. Configure Environment Variables:**
You must provide the necessary API tokens for the platform telemetry to activate. 
Create a `.env` file at the root of the project using the structure found in `.env.example`:
```bash
VITE_HUGGINGFACE_KEY=your_hf_token_here
VITE_WEATHERAPI_KEY=your_weatherapi_key_here
```

**3. Fire it Up:**
```bash
npm run dev
```
Navigate to `http://localhost:5173/` (or the port specified by Vite) and you should see the dashboard!

## 🌐 Deploying to Netlify

This project is pre-configured and completely optimized for Netlify cloud-hosting.

1. Connect your Github Repository to Netlify.
2. The project's build command is automatically flagged via `package.json` (`npm run build`). The publish directory is `dist`.
3. Set your Environment Variables (`VITE_HUGGINGFACE_KEY` and `VITE_WEATHERAPI_KEY`) securely inside the Netlify Project Settings panel directly!
4. **Routing note**: A `public/_redirects` file (`/*  /index.html  200`) has already been included, ensuring the application gracefully recovers internal pathing natively upon remote refresh.
