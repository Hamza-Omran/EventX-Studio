const fs = require('fs');
const path = require('path');

function removeCommentsFromFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove single-line comments (// comment) that are on their own line
        content = content.replace(/^\s*\/\/.*$/gm, '');
        
        // Remove inline comments (code // comment) but be careful not to remove from strings
        // This regex looks for // not inside quotes
        content = content.replace(/([^'"\/])\s*\/\/[^\n\r]*$/gm, '$1');
        
        // Remove multi-line comments (/* comment */)
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove excessive empty lines (more than 2 consecutive)
        content = content.replace(/\n{3,}/g, '\n\n');
        
        // Remove trailing whitespace from lines
        content = content.replace(/[ \t]+$/gm, '');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Processed: ${filePath}`);
    } catch (err) {
        console.error(`✗ Error processing ${filePath}:`, err.message);
    }
}

function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
            removeCommentsFromFile(fullPath);
        }
    }
}

console.log('🚀 Starting comment removal process...');
console.log('📂 Processing backend files...');
processDirectory('./backend/src');

console.log('📂 Processing frontend files...');
processDirectory('./frontend/src');

console.log('✅ Comment removal completed!');
