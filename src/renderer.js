document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input');
  const quality = document.getElementById('quality');
  const pathBtn = document.getElementById('pathBtn');
  const dlBtn = document.getElementById('dlBtn');
  const searchBtn = document.getElementById('searchBtn');
  const quitBtn = document.getElementById('quitBtn');
  const progressDiv = document.getElementById('progress-div');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const etaDiv = document.getElementById('eta');
  const videoTitle = document.getElementById('video-title');
  const videoThumbnail = document.getElementById('video-thumbnail');
  const videoDuration = document.getElementById('video-duration');
  const downloadDiv = document.getElementById('downloadDiv');
  const openFolder = document.getElementById('openFolder');

  input.addEventListener('keydown', (event) => {
    if (input.value) {
      if (event.key === 'Enter') {
        window.electron.search(input.value);
      }
      progressDiv.classList.remove('flex');
      progressDiv.classList.add('hidden');
      openFolder.classList.remove('flex');
      openFolder.classList.add('hidden');
    }
  });

  pathBtn.addEventListener('click', () => {
    window.electron.changePath();
  });

  dlBtn.addEventListener('click', () => {
    if (input.value) {
      const selectedQuality = quality.value;
      window.electron.sendInput(input.value, selectedQuality);
    }
  });
  searchBtn.addEventListener('click', () => {
    window.electron.search(input.value);
    progressDiv.classList.remove('flex');
    progressDiv.classList.add('hidden');
    openFolder.classList.remove('flex');
    openFolder.classList.add('hidden');
  });
  quitBtn.addEventListener('click', () => {
    window.electron.terminateDownload();
  });

  window.electron.onDownloadProgress((event, progress) => {
    progressText.textContent = progress;
    if (videoTitle.textContent && videoThumbnail.src && progressText.textContent) {
      progressDiv.classList.remove('hidden');
      progressDiv.classList.add('flex');
    } else {
      progressBar.className = `bg-green-600 h-full rounded-xl w-[0%]`;
      progressDiv.classList.remove('flex');
      progressDiv.classList.add('hidden');
    }
    if (progressText.textContent === 'Complete.') {
      openFolder.classList.remove('hidden');
      openFolder.classList.add('flex');
    }
    if (progressText.textContent !== 'Complete.') {
      openFolder.classList.remove('flex');
      openFolder.classList.add('hidden');
    }
  });

  window.electron.onDownloadPercentage((event, progressValue) => {
    if (progressValue === 'Complete') {
      progressBar.className = `bg-green-600 h-full rounded-xl w-[100%]`;
      return;
    }
    const cleanPercentage = Math.floor(progressValue.replace(/%.*/, ''));
    progressBar.className = `bg-green-600 h-full rounded-xl wi-${cleanPercentage}`;
  });

  window.electron.onVideoTitle((event, title) => {
    videoTitle.textContent = title;
    if (videoTitle.textContent && videoThumbnail.src) {
      downloadDiv.classList.remove('hidden');
      downloadDiv.classList.add('flex');
    } else {
      downloadDiv.classList.remove('flex');
      downloadDiv.classList.add('hidden');
    }
  });
  window.electron.onVideoThumbnail((event, thumbnail) => {
    if (thumbnail) {
      videoThumbnail.src = thumbnail;
    } else {
      videoThumbnail.src = '';
    }
  });
  window.electron.onVideoDuration((event, duration) => {
    if (duration > 0) {
      const hrs = Math.floor(duration / 3600);
      const mins = Math.floor((duration % 3600) / 60);
      const secs = duration % 60;
      if (hrs > 0) {
        videoDuration.textContent = `Duration: ${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      } else {
        videoDuration.textContent = `Duration: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    } else {
      videoDuration.textContent = '';
    }
  });
  window.electron.onEtaProgress((event, eta) => {
    etaDiv.textContent = eta;
  });

  openFolder.addEventListener('click', (event) => {
    event.preventDefault();
    window.electron.openFolder();
  });
  window.addEventListener('load', () => {
    window.electron.start();
  });
});
