document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input');
  const quality = document.getElementById('quality');
  const pathBtn = document.getElementById('pathBtn');
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
    if (progressText.textContent.includes('Terminated')) {
      setTimeout(() => {
        etaDiv.textContent = '';
      }, 1500);
      etaDiv.textContent = 'Download cancelled';
      progressDiv.classList.remove('flex');
      progressDiv.classList.add('hidden');
      return;
    }
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
    if (videoTitle.textContent && videoThumbnail.src && videoDuration.textContent) {
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
      const secs = Math.floor(duration % 60);
      if (hrs > 0) {
        videoDuration.textContent = `Duration: ${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      } else {
        videoDuration.textContent = `Duration: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    } else {
      videoDuration.textContent = '';
    }
  });

  window.electron.onVideoQuality((event, qualityArr) => {
    let opts = ['360', '480', '720', '1080', '1440', '2160'];
    console.log('AAAAAA' + qualityArr);
    if (!qualityArr.some((arr) => arr[0].includes('2160'))) {
      opts = opts.filter((value) => value !== '2160');
    }
    if (!qualityArr.some((arr) => arr[0].includes('1440'))) {
      opts = opts.filter((value) => value !== '1440');
    }
    if (!qualityArr.some((arr) => arr[0].includes('1080'))) {
      opts = opts.filter((value) => value !== '1080');
    }
    if (!qualityArr.some((arr) => arr[0].includes('720'))) {
      opts = opts.filter((value) => value !== '720');
    }
    if (!qualityArr.some((arr) => arr[0].includes('480'))) {
      opts = opts.filter((value) => value !== '480');
    }
    if (!qualityArr.some((arr) => arr[0].includes('360'))) {
      opts = opts.filter((value) => value !== '360');
    }
    let qualityOpts = opts
      .map((value) => {
        return `<option value="${value}">${value}p</option>`;
      })
      .join('');
    quality.innerHTML = '<option value="download" selected>Download</option>' + qualityOpts;
  });
  window.electron.onEtaProgress((event, eta) => {
    etaDiv.textContent = eta;
  });

  quality.addEventListener('change', () => {
    const selectedQuality = quality.value;
    if (input.value) {
      window.electron.sendInput(input.value, selectedQuality);
      etaDiv.textContent = 'Downloading...';
      quality.value = 'download';
    }
  });

  openFolder.addEventListener('click', (event) => {
    event.preventDefault();
    window.electron.openFolder();
  });
  window.addEventListener('load', () => {
    window.electron.start();
  });
});
