const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Pablo Andrade/Desktop/rehabroad/rehabroad-main/src/react-app/pages/dashboard';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(dir, function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove PageTransition import from microinteractions import
    content = content.replace(/,\s*PageTransition\s*/g, ' ');
    content = content.replace(/PageTransition\s*,\s*/g, '');
    content = content.replace(/import\s*{\s*PageTransition\s*}\s*from\s*['"]@\/react-app\/components\/ui\/microinteractions['"];?\n?/g, '');
    
    // Cleanup empty imports
    content = content.replace(/import\s*{\s*}\s*from\s*['"]@\/react-app\/components\/ui\/microinteractions['"];?\n?/g, '');
    
    // Replace <PageTransition> with <>
    content = content.replace(/<PageTransition(?:[^>]*)>/g, '<>');
    content = content.replace(/<\/PageTransition>/g, '</>');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
