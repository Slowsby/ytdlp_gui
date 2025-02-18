const os = require('os');

const currentOS = () => {
  return os.platform();
};

module.exports = { currentOS };
