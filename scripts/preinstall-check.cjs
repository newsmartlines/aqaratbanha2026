const fs = require('fs');
const path = require('path');

const filesToDelete = ['package-lock.json', 'yarn.lock'];

filesToDelete.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${file}`);
    }
});

if (process.env.npm_config_user_agent && !process.env.npm_config_user_agent.startsWith('pnpm/')) {
    console.error('Use pnpm instead');
    process.exit(1);
}
