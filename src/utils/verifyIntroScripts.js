// Run this with: node src/utils/verifyIntroScripts.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying introduction-scripts.js structure...\n');

try {
  const filePath = path.join(__dirname, '../content/training/introduction-scripts.js');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const gradeLevels = ['K-2', '3-5', '6-8', '9-12'];
  const requiredFields = ['greeting', 'introduction', 'safety', 'consent'];

  const issues = [];
  const successes = [];

  gradeLevels.forEach((grade, index) => {
    if (fileContent.includes(`'${grade}':`)) {
      successes.push(`✅ Found grade level: ${grade}`);

      const nextGrade = gradeLevels[index + 1] || 'export';
      const gradeStart = fileContent.indexOf(`'${grade}':`);
      const gradeEnd = fileContent.indexOf(`'${nextGrade}'`);
      const gradeSection = gradeEnd !== -1
        ? fileContent.substring(gradeStart, gradeEnd)
        : fileContent.substring(gradeStart);

      requiredFields.forEach((field) => {
        if (gradeSection.includes(`${field}:`)) {
          successes.push(`    ✅ ${grade} has ${field}`);
        } else {
          issues.push(`    ❌ ${grade} missing field: ${field}`);
        }
      });
    } else {
      issues.push(`❌ Missing grade level: ${grade}`);
    }
  });

  console.log('SUCCESSES:');
  successes.forEach((msg) => console.log(msg));

  if (issues.length) {
    console.log('\n⚠️  ISSUES FOUND:');
    issues.forEach((msg) => console.log(msg));
    console.log('\n❌ Fix these issues in introduction-scripts.js');
  } else {
    console.log('\n✅ All checks passed! introduction-scripts.js is properly structured.');
  }
} catch (error) {
  console.error('❌ Error reading file:', error.message);
}
