chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadNotes') {
      let blob = new Blob([request.data], {type: 'text/html'});
      let url = URL.createObjectURL(blob);
      chrome.downloads.download({url: url, filename: 'StudyNotes.html'});
    }
  });
  