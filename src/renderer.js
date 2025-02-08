document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input');
  const quality = document.getElementById('quality');
  const pathBtn = document.getElementById('pathBtn');
  const dlBtn = document.getElementById('dlBtn');
  const searchBtn = document.getElementById('searchBtn');
  const quitBtn = document.getElementById('quitBtn');
  const progressDiv = document.getElementById('progress');
  const etaDiv = document.getElementById('eta');
  const videoTitle = document.getElementById('video-title');
  const videoThumbnail = document.getElementById('video-thumbnail');
  const videoDuration = document.getElementById('video-duration');
  const downloadDiv = document.getElementById('downloadDiv');

  input.addEventListener('keydown', (event) => {
    const selectedQuality = quality.value;
    if (input.value) {
      if (event.key === 'Enter') {
        window.electron.search(input.value);
      }
    }
  });

  pathBtn.addEventListener('click', (event) => {
    console.log('clicked');
    window.electron.changePath();
  });

  dlBtn.addEventListener('click', (event) => {
    if (input.value) {
      const selectedQuality = quality.value;
      window.electron.sendInput(input.value, selectedQuality);
      input.value = '';
    }
  });
  searchBtn.addEventListener('click', (event) => {
    window.electron.search(input.value);
  });
  quitBtn.addEventListener('click', (event) => {
    console.log('clicked termination');
    window.electron.terminateDownload();
  });

  window.electron.onDownloadProgress((event, progress) => {
    progressDiv.textContent = progress; // Update the progress in the UI
  });
  window.electron.onVideoTitle((event, title) => {
    videoTitle.textContent = title; // Update the progress in the UI

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
      videoThumbnail.src = thumbnail; // Update the progress in the UI
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

  window.addEventListener('load', (event) => {
    window.electron.start();
  });

})
