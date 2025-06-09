const fs = require('fs');
const path = require('path');

// Folder and file structure
const structure = {
  'controllers': ['userController.js'],
  'models': ['db.js', 'userModel.js', 'managerModel.js'],
  'routes': ['userRoutes.js'],
  'utils': ['validators.js'],
  '': ['app.js', 'README.md', 'package.json']  // root files
};

// Create folders and files
for (const [folder, files] of Object.entries(structure)) {
  const folderPath = path.join(__dirname, folder);

  if (folder && !fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`📁 Created folder: ${folder}`);
  }

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
      console.log(`📝 Created file: ${path.join(folder, file)}`);
    }
  });
}

console.log('\n✅ Project structure created successfully!');
