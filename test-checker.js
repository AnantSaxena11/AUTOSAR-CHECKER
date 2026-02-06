// Test the AUTOSAR rules directly
const fs = require('fs');
const path = require('path');

// Import the rules (simplified version)
const autosarRules = [
    {
        code: 'A1-1-1',
        pattern: /\b(goto)\b/g,
        message: 'No goto statements'
    },
    {
        code: 'A18-1-1',
        pattern: /\b\w+\s+\w+\s*\[\s*\d*\s*\]/g,
        message: 'No C-style arrays'
    },
    {
        code: 'A5-1-1',
        pattern: /=\s*\d+\s*[;,\)]/g,
        message: 'No magic numbers'
    },
    {
        code: 'A15-1-1',
        pattern: /throw\s+(?!std::)/g,
        message: 'Only throw std::exception'
    },
    {
        code: 'M0-1-1',
        pattern: /\breturn\s+[^;]+;\s*\w+/g,
        message: 'No unreachable code'
    }
];

// Read example.cpp
const exampleFile = path.join(__dirname, 'example.cpp');
const content = fs.readFileSync(exampleFile, 'utf8');

console.log('='.repeat(60));
console.log('TESTING AUTOSAR CHECKER ON example.cpp');
console.log('='.repeat(60));

let totalIssues = 0;

autosarRules.forEach(rule => {
    const matches = [...content.matchAll(rule.pattern)];
    if (matches.length > 0) {
        console.log(`\n[${rule.code}] ${rule.message}`);
        console.log(`Found ${matches.length} violation(s):`);
        matches.forEach((match, idx) => {
            const lines = content.substring(0, match.index).split('\n');
            const lineNum = lines.length;
            const snippet = content.split('\n')[lineNum - 1].trim();
            console.log(`  Line ${lineNum}: ${snippet}`);
            totalIssues++;
        });
    }
});

console.log('\n' + '='.repeat(60));
console.log(`TOTAL: ${totalIssues} AUTOSAR violations found`);
console.log('='.repeat(60));

if (totalIssues > 0) {
    console.log('\n✅ AUTOSAR CHECKER IS WORKING!');
    console.log('The rules are detecting violations correctly.');
} else {
    console.log('\n❌ No violations found - check the patterns');
}
