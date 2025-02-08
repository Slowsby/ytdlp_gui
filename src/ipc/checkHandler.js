const { ytdlpCheck } = require('../utils/ytdlp');


const handleYtdlpCheck = (event) => {
  ytdlpCheck(event);
};

module.exports = { handleYtdlpCheck };
