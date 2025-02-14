const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendInput: (value, quality) => ipcRenderer.send('input-value', value, quality),
  search: (value) => ipcRenderer.send('search', value),
  changePath: () => ipcRenderer.send('changePath'),
  openFolder: () => ipcRenderer.send('open'),
  terminateDownload: () => ipcRenderer.send('force-quit'),
  onDownloadProgress: (progress) => ipcRenderer.on('progress', progress),
  onDownloadPercentage: (progressValue) => ipcRenderer.on('progress-value', progressValue),
  onVideoTitle: (title) => ipcRenderer.on('video-title', title),
  onVideoThumbnail: (thumbnail) => ipcRenderer.on('video-thumbnail', thumbnail),
  onVideoDuration: (duration) => ipcRenderer.on('video-duration', duration),
  onVideoQuality: (quality) => ipcRenderer.on('video-quality', quality),
  onEtaProgress: (eta) => ipcRenderer.on('eta', eta),
  start: () => ipcRenderer.send('start')
});
