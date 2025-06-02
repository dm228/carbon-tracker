import crypto from 'crypto';
import { initStore, saveStore } from './embeddingStore.mjs';
import getEmbedding from './getEmbedding.mjs';

export async function addActivityToVectorDB(text, metadata) {
  const vector = await getEmbedding(text);
  const id = crypto.createHash('md5').update(text).digest('hex');

  const store = await initStore();
  await store.insertOne({ id, vector, metadata });
  await saveStore();
}

export async function findSimilarActivity(text, threshold = 0.95) {
  const vector = await getEmbedding(text);
  const store = await initStore();
  const result = await store.search(vector, 1);

  if (result[0]?.score >= threshold) {
    return result[0]; // includes .score and .metadata
  }

  return null;
}
