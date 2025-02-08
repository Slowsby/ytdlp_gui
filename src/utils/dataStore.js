const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const checkDataPath = () => {
  if (!fs.existsSync('data.json')) {
    fs.writeFileSync('data.json', JSON.stringify(app.getPath('downloads')));
  }
};

const defaultPath = () => {
  return JSON.parse(fs.readFileSync('data.json'));
};
module.exports = { checkDataPath, defaultPath };
