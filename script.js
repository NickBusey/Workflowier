
// ==UserScript==
// @name         Workflowier
// @namespace    Workflowier
// @include      *
// @author       Nick Busey
// @description  User Script for Workflowy.com that adds some extra features.
// @match        https://workflowy.com/#
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

searching = false;

// the guts of this userscript
function main() {
  // Note, jQ replaces jQ to avoid conflicts.
  // Insert recent links
    jQ('#savedViewHUDButton').after("<div class='showCompletedButton button'><div class='topBarButtonTextContainer'><a href='#' id='recentLink_1wk'>1wk</a></div></div>");
    jQ('#recentLink_1wk').click(function(e) {
      e.preventDefault();
      if (jQ('#searchBox').val()=='last-changed:7d') {
        search.searchProjectTree('');
      } else {
        search.searchProjectTree('last-changed:7d');
      }
    });
    jQ('#savedViewHUDButton').after("<div class='showCompletedButton button'><div class='topBarButtonTextContainer'><a href='#' class='button' id='recentLink_24hrs'>24hrs</a></div></div>");
    jQ('#recentLink_24hrs').click(function(e) {
      e.preventDefault();
      if (jQ('#searchBox').val()=='last-changed:1d') {
        search.searchProjectTree('');
      } else {
        search.searchProjectTree('last-changed:1d');
      }
    });

  // Add -rand functionality
    jQ(window).on('hashchange',function(e) {
      if (searching) {
        return false;
      }

      var query = jQ('#searchBox').val();
      var needle=/(%23\w*-rand)+/;
      var match = window.location.href.match(needle);
      if (match) {
        // A tag with -rand on the end has been clicked. Locate another.
        searching = true;
        var tag = match[0]; //matches "2 chapters"
        tag = "#"+tag.slice(3);
        window.location.href='/#';
        search.searchProjectTree(tag);
        var target = null;
        var count = 0;
        var tags = $('.contentMatch');
        var random = $(tags[Math.floor(Math.random()*tags.length)])[0];
        var parent = jQ(random).parents('.name').find('a').first();
        var href = jQ(parent).attr('href');
        window.location.href = href;
        setTimeout(function() {
          searching = false;
        },100);
      }
    });
}

// load jQuery and execute the main function
addJQuery(main);
