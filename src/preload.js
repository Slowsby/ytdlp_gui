const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendInput: (value, quality) => ipcRenderer.send('input-value', value, quality),
  search: (value, quality) => ipcRenderer.send('search', value),
  changePath: () => ipcRenderer.send('changePath'),
  terminateDownload: () => ipcRenderer.send('force-quit'),
  onDownloadProgress: (progress) => ipcRenderer.on('progress', progress),
  onVideoTitle: (title) => ipcRenderer.on('video-title', title),
  onVideoThumbnail: (thumbnail) => ipcRenderer.on('video-thumbnail', thumbnail),
  onVideoDuration: (duration) => ipcRenderer.on('video-duration', duration),
  onEtaProgress: (eta) => ipcRenderer.on('eta', eta),
  start: () => ipcRenderer.send('start')
});
