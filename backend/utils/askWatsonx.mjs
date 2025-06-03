// backend/utils/askWatsonx.mjs
import fetch from 'node-fetch';
import getToken from './getToken.mjs';
import dotenv from 'dotenv';
dotenv.config();

const PROJECT_ID = process.env.WATSONX_PROJECT_ID;
const MODEL_ID =  process.env.WATSONX_MODEL_ID; // Update if you're using a different model

export default async function askWatsonx(activityText) {
  const token = await getToken();

  const prompt = `
You are a carbon impact estimator. Estimate the CO₂e emissions (in kg) for a given activity and categorize it into an impact level.

Examples:
- "Drive 10 km in a gasoline car" → { "co2e_kg": 2.3, "impact": "red", "category": "transportation", "source": "EPA 2021 Transport Report" }
- "Use LED bulb for 1 hour" → { "co2e_kg": 0.005, "impact": "green", "category": "home", "source": "UK Gov Energy Data 2022" }
- "Eat 100g of lentils" → { "co2e_kg": 0.1, "impact": "green", "category": "food","source": "OurWorldInData.org" }

Activity:
"${activityText}"

Rules:
- Do not suggest any tool calls
- Respond ONLY in the following JSON format:

{
  "co2e_kg": number,
  "impact": "green" | "amber" | "red",
  "category": "such as home, trasportation, food, entertainment,etc based on the activity"
  "source": "short citation or URL"
}
`;

  const response = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: MODEL_ID,
      project_id: PROJECT_ID,
      
        messages: [{ role: 'user', content: prompt }]
      
    })
  });

  const data = await response.json();

  const reply = data?.choices?.[0]?.message?.content;


  try {
    const json = JSON.parse(reply);
    return json;
  } catch (err) {
    console.error('❌ Watsonx response not parseable:', reply);
    throw new Error('Watsonx returned unstructured data.');
  }
}
