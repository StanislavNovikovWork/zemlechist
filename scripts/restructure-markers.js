const fs = require('fs');
const path = require('path');

// Read markers.json
const markersPath = path.join(__dirname, '../constants/markers.json');
const data = JSON.parse(fs.readFileSync(markersPath, 'utf8'));

// Regex to match phone pattern: 8(XXX)XXX-XX-XX
const phoneRegex = /8\(\d{3}\)\d{3}-\d{2}-\d{2}/;

data.features = data.features.map(feature => {
  const description = feature.properties.description || '';
  
  // Extract phone
  const phoneMatch = description.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : '';
  
  // Extract name and remaining description
  let name = '';
  let newDescription = description;
  
  if (phone) {
    // Remove phone from description to get the rest
    const afterPhone = description.replace(phone, '').trim();
    
    // Name is typically at the start until newline, comma, or semicolon
    const nameMatch = afterPhone.match(/^([^,\n;]+)/);
    if (nameMatch) {
      name = nameMatch[1].trim();
      // Remove name from description
      newDescription = afterPhone.replace(nameMatch[0], '').trim();
      // Clean up leading punctuation
      newDescription = newDescription.replace(/^[,\n;]\s*/, '');
    } else {
      newDescription = afterPhone;
    }
  }
  
  // Update properties
  feature.properties = {
    ...feature.properties,
    phone,
    name,
    description: newDescription
  };
  
  return feature;
});

// Write back to markers.json
fs.writeFileSync(markersPath, JSON.stringify(data, null, 2));
console.log('markers.json restructured successfully!');
