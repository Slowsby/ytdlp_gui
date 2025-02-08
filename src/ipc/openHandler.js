const { shell } = require('electron');
const { defaultPath } = require('../utils/dataStore.js');

const open = () => {
  shell.openPath(defaultPath());
};

module.exports = { open };
