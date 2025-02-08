const { spawn } = require('node:child_process');
const fs = require('fs');

const searchVideo = async (event, value) => {
  event.sender.send('video-thumbnail', '');
  event.sender.send('video-title', 'Searching...');
  event.sender.send('video-duration', '');
  if (fs.existsSync('info.txt')) {
    fs.unlinkSync('info.txt');
  }
  if (!fs.existsSync('info.txt')) {
    fs.writeFileSync('info.txt', '');
  }
  const cleanedFromPlaylist = value.replace(/&list=.*/, '');
  const command = 'yt-dlp';
  const args = ['--print-to-file', '%(thumbnail)s\n%(title)s\n%(duration)s', 'info.txt', cleanedFromPlaylist, '--skip-download'];
  const process = spawn(command, args);

  process.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`Process exited with code ${code}`);
    fs.readFile('info.txt', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }
      const lines = data.split(/\n/);
      console.log(lines);
      event.sender.send('video-thumbnail', lines[0]);
      event.sender.send('video-title', lines[1]);
      event.sender.send('video-duration', parseFloat(lines[2]));
    });
  });
};

module.exports = { searchVideo };
