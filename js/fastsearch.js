var fuse;
var searchVisible = false;
var firstRun = true;
var list = document.getElementById('search-results');
var first = list.firstChild;
var last = list.lastChild;
var maininput = document.getElementById('search-input');
var resultsAvailable = false;
document.addEventListener('keydown', function (event) {
  if (event.metaKey && event.which === 191) {
    uknowhow2srh();
    if (firstRun) {
      loadSearch();
      firstRun = false;
    }
    if (!searchVisible) {
      document.getElementById('fast-search').style.visibility = 'visible';
      document.getElementById('search-input').focus();
      searchVisible = true;
    } else {
      document.getElementById('fast-search').style.visibility = 'hidden';
      document.activeElement.blur();
      searchVisible = false;
    }
  }
  if (event.which == 27) {
    if (searchVisible) {
      document.getElementById('fast-search').style.visibility = 'hidden';
      document.activeElement.blur();
      searchVisible = false;
    }
  }
  if (event.which == 40) {
    if (searchVisible && resultsAvailable) {
      event.preventDefault();
      if (document.activeElement == maininput) {
        first.focus();
      } else if (document.activeElement == last) {
        last.focus();
      } else {
        document.activeElement.parentElement.nextSibling.firstElementChild.focus();
      }
    }
  }
  if (event.which == 38) {
    if (searchVisible && resultsAvailable) {
      event.preventDefault();
      if (document.activeElement == maininput) {
        maininput.focus();
      } else if (document.activeElement == first) {
        maininput.focus();
      } else {
        document.activeElement.parentElement.previousSibling.firstElementChild.focus();
      }
    }
  }
});
document.getElementById('search-input').onkeyup = function (e) {
  executeSearch(this.value);
};
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}
function loadSearch() {
  fetchJSONFile('/index.json', function (data) {
    var options = {
      shouldSort: true,
      location: 0,
      distance: 100,
      threshold: 0.4,
      minMatchCharLength: 2,
      keys: ['title', 'permalink', 'content'],
      limit: 10,
    };
    fuse = new Fuse(data, options);
  });
}
function executeSearch(term) {
  let results = fuse.search(term);
  let searchitems = '';
  if (results.length === 0) {
    resultsAvailable = false;
    searchitems = '';
  } else {
    for (let item in results.slice(0, 5)) {
      let shortContent = '';
      if (results[item].summary) {
        shortContent =
          '<span class="summary">' + results[item].summary + '</span></a></li>';
      }
      searchitems =
        searchitems +
        '<div class="list-item"><a href="' +
        results[item].permalink +
        '" tabindex="0">' +
        '<span class="title">' +
        results[item].title +
        '</span><br />' +
        shortContent +
        '</a></div>';
    }
    resultsAvailable = true;
  }
  document.getElementById('search-results').innerHTML = searchitems;
  if (results.length > 0) {
    first = list.firstChild.firstElementChild;
    last = list.lastChild.firstElementChild;
  }
}
