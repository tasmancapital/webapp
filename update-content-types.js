const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'project', 'src', 'content', 'pages');
const files = fs.readdirSync(contentDir);

const typeMapping = {
  'HomePage': 'home',
  'AboutPage': 'about',
  'InvestmentsPage': 'investments',
  'TeamPage': 'team',
  'ContactPage': 'contact',
  'PrivacyPolicyPage': 'privacy-policy',
  'TermsOfUsePage': 'terms-of-use'
};

files.forEach(file => {
  if (file.endsWith('.json')) {
    const filePath = path.join(contentDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (content.type && typeMapping[content.type]) {
      console.log(`Updating ${file}: ${content.type} -> ${typeMapping[content.type]}`);
      content.type = typeMapping[content.type];
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    } else {
      console.log(`Skipping ${file}: type is ${content.type}`);
    }
  }
});

console.log('Done updating content types!');
