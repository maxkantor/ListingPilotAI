// Test Zillow URL parsing with the backend endpoint
const testUrl = 'https://www.zillow.com/homedetails/2302-NW-68th-Dr-Boca-Raton-FL-33496/46698532_zpid/';
const apiUrl = `http://localhost:3000/api/listing-preview?url=${encodeURIComponent(testUrl)}`;

console.log('Testing Zillow preview endpoint...');
console.log('URL:', testUrl);
console.log('API endpoint:', apiUrl);
console.log('');

fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    console.log('Response received:');
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => console.error('Error:', err.message));
