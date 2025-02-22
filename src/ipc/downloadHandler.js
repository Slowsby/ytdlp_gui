const { exec, spawn } = require('node:child_process');
const { defaultPath } = require('../utils/dataStore.js');
const path = require('path');
const { currentOS } = require('../utils/osCheck.js');
let intervalId;
let process;
let terminated = false;
let isDownloading = false;
const handleDownload = (event, value, quality) => {
  if (quality === 'quality') {
    setTimeout(() => {
      event.sender.send('eta', '');
    }, 1000);
    event.sender.send('eta', 'Please select a quality');
    return;
  }
  const cleanedFromPlaylist = value.replace(/&list=.*/, '');
  if (isDownloading) {
    console.log('Download already in progress.');
    event.sender.send('progress', 'Download already in progress.');
    return;
  }

  isDownloading = true;
  console.log('Received input:', value, quality);
  const command = currentOS() === 'win32' ? 'yt-dlp' : './yt-dlp';
  const args = ['-S', `res:${quality},acodec:m4a`, cleanedFromPlaylist, '--no-mtime', '--force-overwrites', '-o', path.join(defaultPath(), '\\%(title)s [%(id)s].%(ext)s')];
  process = spawn(command, args);
  let cleanedData;

  process.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    cleanedData = data
      .toString()
      .replace('[download]', '')
      .replace(/\([^)]*\)/g, '');
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on('close', () => {
    if (!terminated) {
      event.sender.send('eta', '');
      clearInterval(intervalId);
      event.sender.send('progress', 'Complete.');
      event.sender.send('progress-value', 'Complete');
      isDownloading = false;
    }
  });

  intervalId = setInterval(() => {
    if (cleanedData && cleanedData.includes('ETA')) {
      const timeRemaining = cleanedData.replace(/.*ETA\s*/, '');
      event.sender.send('eta', timeRemaining + ' remaining');
      event.sender.send('progress', cleanedData.replace(/\s*ETA.*$/, ''));
      event.sender.send('progress-value', cleanedData);
    } else {
      event.sender.send('progress', 'Running...');
    }
  }, 1000);
};

const forceQuitDownload = (event) => {
  if (process) {
    event.sender.send('eta', '');
    terminated = true;
    clearInterval(intervalId);
    if (currentOS() === 'win32') {
      exec('taskkill /F /T /PID ' + process.pid);
    } else if (currentOS() === 'linux') {
      exec('kill -9 ' + process.pid);
    }
    isDownloading = false;
    console.log('Killed yt-dlp');
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
