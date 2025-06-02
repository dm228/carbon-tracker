// test-watsonx.mjs
import askWatsonx from './utils/askWatsonx.mjs';

const testActivity = 'ate 100g of lentils';

askWatsonx(testActivity)
  .then(result => {
    console.log('Watsonx result:', result);
  })
  .catch(err => {
    console.error('Error testing Watsonx:', err.message);
  });
