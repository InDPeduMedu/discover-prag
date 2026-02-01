const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log("Testing API Key:", apiKey ? `Present (${apiKey.substring(0, 4)}...)` : "MISSING");

  if (!apiKey) return;

  // The SDK doesn't expose listModels nicely on the main class in some versions,
  // let's try a direct fetch to the API endpoint to see what's what.
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  console.log("Fetching models from:", "https://generativelanguage.googleapis.com/v1beta/models");

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("API Returned Error:", JSON.stringify(data.error, null, 2));
    } else if (data.models) {
      console.log("Available Models:");
      data.models.forEach(m => console.log(` - ${m.name} (${m.supportedGenerationMethods})`));
    } else {
      console.log("Unexpected response:", data);
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}

listModels();
