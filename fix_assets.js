const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        let edited = content.replace(/(['"])\/(photos|launch-photos|city-photos|Logos)\/([^'"]+)\1/g, '`${import.meta.env.BASE_URL}$2/$3`');
        
        if (edited !== content) {
            fs.writeFileSync(filePath, edited);
            console.log("Updated", filePath);
        }
    }
});
