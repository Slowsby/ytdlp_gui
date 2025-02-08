const { dialog, app } = require('electron');
const fs = require('fs');

const openDialog = async () => {
  await dialog
    .showOpenDialog({
      title: 'Select a download folder',
      defaultPath: app.getPath('downloads'),
      buttonLabel: 'Select Folder',
      properties: ['openDirectory']
    })
    .then((result) => {
      if (!result.canceled) {
        console.log('Selected path:', result.filePaths[0]);
        fs.writeFileSync('data.json', JSON.stringify(`${result.filePaths[0]}`));
      } else {
        console.log('Choice Cancelled');
      }
    });
};

module.exports = { openDialog };
