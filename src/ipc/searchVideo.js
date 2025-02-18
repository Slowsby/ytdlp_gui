const { spawn, exec } = require('node:child_process');
const fs = require('fs');
const { currentOS } = require('../utils/osCheck.js');

const command = currentOS() === 'win32' ? 'yt-dlp' : './yt-dlp';
const searchVideo = async (event, value) => {
  event.sender.send('video-thumbnail', '');
  event.sender.send('video-duration', '');
  event.sender.send('video-title', 'Searching...');
  if (fs.existsSync('info.txt')) {
    fs.unlinkSync('info.txt');
  }
  if (!fs.existsSync('info.txt')) {
    fs.writeFileSync('info.txt', '');
  }
  const cleanedFromPlaylist = value.replace(/&list=.*/, '');
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
      event.sender.send('video-duration', parseFloat(lines[2]));
      event.sender.send('video-title', lines[1]);
    });
  });

  // Get available video quality
  const qualityCommand = `${command} -F ${cleanedFromPlaylist} > quality.log`;
  const qualityProcess = exec(qualityCommand);
  qualityProcess.stdout.on('data', (data) => {
    console.log(`Quality stdout: ${data}`);
  });
  qualityProcess.stderr.on('data', (data) => {
    console.error(`Quality stderr: ${data}`);
  });
  qualityProcess.on('close', (code) => {
    console.log(`Quality process exited with code ${code}`);
    fs.readFile('quality.log', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }
      const qualities = data
        .split(/\n/)
        .filter((line) => {
          return line.includes('mp4') && !line.includes('audio only') && !line.includes('mp4_dash');
        })
        .map((line) => line.split(' ').filter((word) => word.includes('x')));
      const uniqueQualities = [...new Set(qualities)];
      console.log(uniqueQualities);
      event.sender.send('video-quality', uniqueQualities);
    });
  });
};
module.exports = { searchVideo };
