const fs = require('fs');

// Read the guide-download-form.tsx
const formContent = fs.readFileSync('client/src/components/guide-download-form.tsx', 'utf8');
console.log('Form component loaded successfully.');

// Check for privacy policy text
if (formContent.includes('By submitting, you agree to receive occasional updates about Cabo')) {
  console.log('Privacy policy notice found in the form.');
} else {
  console.log('Privacy policy notice not found in the form.');
}

// Check for form fields
const requiredFields = ['firstName', 'email', 'phone', 'interestAreas'];
const missingFields = [];

requiredFields.forEach(field => {
  if (!formContent.includes(field)) {
    missingFields.push(field);
  }
});

if (missingFields.length === 0) {
  console.log('All required form fields present.');
} else {
  console.log('Missing fields:', missingFields);
}

console.log('Guide form test complete.');