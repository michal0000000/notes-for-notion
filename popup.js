document.getElementById('exportButton').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'exportNotes'});
    });
  });
  