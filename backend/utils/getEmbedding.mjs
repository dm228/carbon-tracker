import fetch from 'node-fetch';
import getToken from './getToken.mjs';
import dotenv from 'dotenv';
dotenv.config();

const EMBEDDING_MODEL_ID = 'ibm/slate-125m-english-rtrvr'; // or another available model

export default async function getEmbedding(text) {
  const token = await getToken();

  const response = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/embeddings?version=2023-10-25', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: EMBEDDING_MODEL_ID,
      project_id: process.env.WATSONX_PROJECT_ID,
      inputs: 
        [text]
      
    })
  });

  const data = await response.json();
  console.log("embedding: ",  data?.results?.[0]?.embedding);
  return data?.results?.[0]?.embedding;
}
