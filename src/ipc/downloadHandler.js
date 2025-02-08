const { exec } = require('node:child_process');
const fs = require('fs');
const { defaultPath } = require('../utils/dataStore.js');
let intervalId;
let ytDlpCommand;
let terminated = false;
const handleDownload = (event, value, quality) => {
  console.log('Received input:', value, quality);
  ytDlpCommand = exec(`yt-dlp -S res:${quality},acodec:m4a ${value} --no-mtime --force-overwrites -o "${defaultPath()}\\%(title)s [%(id)s].%(ext)s"`);

  let cleanedData;

  ytDlpCommand.stdout.on('data', (data) => {
    console.log(data.toString());
    cleanedData = data
      .toString()
      .replace('[download]', '')
      .replace(/\([^)]*\)/g, '');
  });
  intervalId = setInterval(() => {
    if (cleanedData && cleanedData.includes('ETA')) {
      const timeRemaining = cleanedData.replace(/.*ETA\s*/, '');
      event.sender.send('eta', timeRemaining + ' remaining');
      event.sender.send('progress', cleanedData.replace(/\s*ETA.*$/, ''));
    } else {
      event.sender.send('progress', 'Running...');
    }
  }, 1000);
  ytDlpCommand.on('close', () => {
    if (!terminated) {
      setTimeout(() => {
        event.sender.send('progress', '');
        event.sender.send('eta', '');
      }, 5000);
      clearInterval(intervalId);
      event.sender.send('progress', 'Complete.');
    }
  });
};

const forceQuitDownload = (event) => {
  event.sender.send('video-title', '');
  event.sender.send('video-thumbnail', '');
  event.sender.send('video-duration', '');
  if (ytDlpCommand) {
    event.sender.send('eta', '');
    terminated = true;
    clearInterval(intervalId);
    exec('taskkill /F /T /PID ' + ytDlpCommand.pid);
    setTimeout(() => {
      event.sender.send('progress', '');
      terminated = false;
    }, 2500);
    event.sender.send('progress', 'Terminated download.');
  } else {
    console.log('No active yt-dlp process found.');
  }
};

module.exports = { handleDownload, forceQuitDownload };
