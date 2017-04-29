function sortByDate(link1, link2) {
  return new Date(link2.created) - new Date(link1.created)
}

function getLinks(callback, errorCallback) {
  var searchUrl = 'http://mattslinks.xyz/api/link/'
  var x = new XMLHttpRequest()
  x.open('GET', searchUrl);
  x.responseType = 'json'
  x.onload = function() {
    var response = x.response
    if (!response) {
      errorCallback('No response from Links');
      return;
    }
    console.log(response)
    var topResults = response
      .sort(sortByDate)
      .slice(0, 5)
    callback(topResults)
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderContent(statusText) {
  document.getElementById('content').textContent = statusText;
}



document.addEventListener('DOMContentLoaded', function() {
  getLinks(function(results) {
    console.log(results)
    document.getElementById('loading').remove()
    for(var idx=0;idx<results.length;idx++) {
      var linkNode = document.createElement('a')
      linkNode.classList.add("link")
      linkNode.href = results[idx].url
      linkNode.target="_blank"
      linkNode.rel="noopener noreferrer"
      var textNode = document.createTextNode(results[idx].title)
      linkNode.appendChild(textNode)

      document.getElementById("content").appendChild(linkNode)
    }
  }, function(errorMessage) {
    console.log("Error: "+errorMessage)
  })
})
