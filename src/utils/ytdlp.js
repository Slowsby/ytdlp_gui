const fs = require('fs');
const { exec } = require('node:child_process');

const ytdlpCheck = async (event) => {
  if (fs.existsSync('yt-dlp.exe')) {
    console.log('yt-dlp exists, looking for update');
    exec('yt-dlp -U', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  } else if (!fs.existsSync('yt-dlp.exe')) {
    setTimeout(() => {
      event.sender.send('progress', '');
    }, 5000);
    event.sender.send('progress', 'Downloading YT-DLP');
    console.log('downloading yt-dlp');
    exec('curl -LO https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
};

module.exports = { ytdlpCheck };
