// Variables
let highlightedText = [];

// Functions
function exportNotes() {
  let headline = document.querySelector('h1');
  let headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let result = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Study Notes</title></head><body>';

  console.log(headline)
  console.log(highlightedText)

  if (headline) {
    let headlineText = headline.innerText.trim();
    let headlineNotes = highlightedText.filter(note => note.header === headlineText);
    result += `<h1>${headlineText}</h1>`;
    if (headlineNotes.length > 0) {
      result += '<ul>';
      headlineNotes.forEach(note => {
        result += `<li>${note.text}</li>`;
      });
      result += '</ul>';
    }
  }

  headers.forEach(header => {
    let headerText = header.innerText.trim();
    if (headline && headerText === headline.innerText.trim()) {
      return;
    }

    let notes = highlightedText.filter(note => note.header === headerText);

    if (notes.length > 0) {
      let headerTag = header.tagName.toLowerCase();
      result += `<${headerTag}>${headerText}</${headerTag}>`;
      result += '<ul>';
      notes.forEach(note => {
        result += `<li>${note.text}</li>`;
      });
      result += '</ul>';
    }
  });

  result += '</body></html>';

  chrome.runtime.sendMessage({action: 'downloadNotes', data: result});
}

// Event Listeners
document.addEventListener('keydown', e => {
  if (e.key === 'Control' || e.key === 'Meta') {
    document.addEventListener('mouseup', mouseUpHandler);
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'Control' || e.key === 'Meta') {
    document.removeEventListener('mouseup', mouseUpHandler);
  }
});

function mouseUpHandler(e) {
  let selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    let range = window.getSelection().getRangeAt(0);
    let span = document.createElement('span');
    span.className = 'highlighted-text';
    range.surroundContents(span);

    let header = findClosestHeader(span);
    highlightedText.push({
      text: selectedText,
      header: header ? header.innerText.trim() : 'No Header'
    });
  }
}

function findClosestHeader(elem) {
  while (elem) {
    let header = searchForHeaderInSiblings(elem);
    if (header) {
      return header;
    }
    elem = elem.parentElement;
  }
  return null;
}

function searchForHeaderInSiblings(elem) {
  while (elem) {
    if (elem.matches('h1, h2, h3, h4, h5, h6')) {
      return elem;
    }
    elem = elem.previousElementSibling;
  }
  return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'exportNotes') {
    exportNotes();
  }
});
