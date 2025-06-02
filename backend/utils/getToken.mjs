// backend/utils/getToken.mjs
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.WATSONX_API_KEY;

export default async function getToken() {
   // console.log('Loaded API key:',API_KEY);
  //  console.log(process.env);
   // console.log(process.env.WATSONX_PROJECT_ID);
  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to get IAM token: ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}
