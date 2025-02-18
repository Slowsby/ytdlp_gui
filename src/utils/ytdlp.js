const fs = require('fs');
const { exec } = require('node:child_process');
const { currentOS } = require('./osCheck.js');

const ytdlpCheck = async (event) => {
  const command = currentOS() === 'win32' ? 'yt-dlp' : './yt-dlp';
  const file = currentOS() === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
  if (fs.existsSync(file)) {
    console.log('yt-dlp exists, looking for update');
    exec(`${command} -U`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  } else if (!fs.existsSync(file)) {
    setTimeout(() => {
      event.sender.send('progress', '');
    }, 5000);
    event.sender.send('progress', 'Downloading YT-DLP');
    console.log('downloading yt-dlp');
    const dlCommand = exec(`curl -LO https://github.com/yt-dlp/yt-dlp/releases/latest/download/${file}`, (err, stdout, stderr) => {
      if (err) {
        console.log('error: ' + err);
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });

    dlCommand.on('close', () => {
      if (currentOS() === 'linux') {
        exec('chmod +x "yt-dlp"');
      }
    });
  }
};

module.exports = { ytdlpCheck };
