
import pkg from 'vectra';
const { LocalTable, IndexStatus, LocalIndex } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import  getEmbedding  from './getEmbedding.mjs';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, 'data', 'index');

const index = new LocalIndex(indexPath);

// Add a new activity and its embedding to the index
export const addActivityToVectorDB = async (activity, metadata = {}) => {
    if (!(await index.isIndexCreated())) {
    await index.createIndex();
}
  const embedding = await getEmbedding(activity);
//console.log('Loaded embedding:', embedding);
  await index.insertItem({
    vector: embedding,
    metadata: {
      activity,
      ...metadata
    }
  });

  //await index.save(); // Save to disk
};

// Find similar activity
export const findSimilarActivity = async (activity, threshold = 0.95) => {
    if (!(await index.isIndexCreated())) {
    await index.createIndex();
}
  const embedding = await getEmbedding(activity);
//console.log('Loaded embedding:', embedding);
  const results = await index.queryItems(
    embedding,
    3
  );

  if (results.length > 0) {
    const match = results[0];
  //  console.log("found match", results);
    if(isNaN(match.score) || match.score < threshold )
        return null;
    return {
      similarity: match.score,
      activity: match.item.metadata.activity,
      metadata: match.item.metadata,
    };
  }

  return null;
};