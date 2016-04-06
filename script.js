// ==UserScript==
// @name         Workflowier
// @namespace    Workflowier
// @include      https://workflowy.com/*
// @author       Nick Busey
// @description  User Script for Workflowy.com that adds some extra features.
// @version      0.0.1.5
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
    var recentLinks = "<div class='menu-options' id='recentLinksMenu'>"+
    "<div class='button'><div class='topBarButtonTextContainer'><a href='#' id='recentLink_1wk'>This Week</a></div></div>"+
    "<div class='button'><div class='topBarButtonTextContainer'><a href='#' class='button' id='recentLink_24hrs'>Today</a></div></div>"+
    "<div class='button'><div class='topBarButtonTextContainer'><a href='#' class='button' id='recentLink_1hr'>Last Hour</a></div></div>"+
    "</div>";
    jQ('#savedViewHUDButton').after("<div class='menuButton button'><div class='topBarButtonTextContainer'><a href='#' id='showRecentLinks'>Recent</a></div></div>"+recentLinks);

    jQ('#showRecentLinks').click(function() {jQ('#recentLinksMenu').slideToggle()});

    jQ('#recentLink_1wk').click(function(e) {
        e.preventDefault();
        if (jQ('#searchBox').val()=='last-changed:7d') {
            search.searchProjectTree('');
        } else {
            search.searchProjectTree('last-changed:7d');
        }
    });
    jQ('#recentLink_24hrs').click(function(e) {
        e.preventDefault();
        if (jQ('#searchBox').val()=='last-changed:1d') {
            search.searchProjectTree('');
        } else {
            search.searchProjectTree('last-changed:1d');
        }
    });
    jQ('#recentLink_1hr').click(function(e) {
        e.preventDefault();
        if (jQ('#searchBox').val()=='last-changed:1h') {
            search.searchProjectTree('');
        } else {
            search.searchProjectTree('last-changed:1h');
        }
    });
    var generateTagsMenu = function() {
        var currentSearch = jQ('#searchBox').val();
        search.searchProjectTree('#');
        var tags = $('.contentTagText');
        // Generate list of all hashtags
        var tagObjs = {};
        tags.each(function(ii, obj) {
            // console.log(obj);
            // console.log(jQ(obj).text());
            var tag = jQ(obj).text();

            var tagObj = tagObjs[tag];
            // console.log(tag,' - ',tagObj);
            if (!tagObj) {
                //   console.log("No tag object, make an empty one.")
                tagObj = {'count':1};
            } else {
                tagObj['count']++;
            }
            tagObjs[tag] = tagObj;
        });
        //   console.log(tagObjs);
        var tagObjsArray = [];
        for (var tag in tagObjs) {
            var tagObj = tagObjs[tag];
            tagObj['tag'] = tag;
            // console.log(tag,tagObj);
            tagObjsArray.push(tagObj);
        }
        //   console.log(tagObjsArray);
        var sortedTagObjsArray = tagObjsArray.sort(function (a, b) {
            return b.count - a.count;
        });
        globTest = sortedTagObjsArray;
        //   console.log(sortedTagObjsArray);
        var tagLinkOutput = '';
        for (var ii in sortedTagObjsArray) {
            var count = sortedTagObjsArray[ii]['count'];
            var tag = sortedTagObjsArray[ii]['tag'];
            tagLinkOutput += "<a href='/#/"+tag+"?q=%23"+tag+"' title='percentage: done/total complete.'><strong>"+count+"</strong> #"+tag+"</a>";
        }
        //   console.log(tagLinkOutput);
        var menu = "<div class='menu-options' id='tagsMenu'>"+tagLinkOutput+"</div>";

        jQ('#savedViewHUDButton').after("<div class='button menuButton'><div class='topBarButtonTextContainer'><a href='#' class='button' id='openTags'>View Tags</a></div></div>"+menu);
        jQ('#openTags').click(function() {jQ('#tagsMenu').slideToggle()});
        search.searchProjectTree(currentSearch);

    };

    // search.searchProjectTree('#daily-teeth');
    // var total = $('.contentMatch').size()/2;
    // search.searchProjectTree('#daily-teeth is:complete');
    // var done = $('.contentMatch').size()/2;
    // console.log(total,done);
    // console.log(done/total);
    // var pct = done/total;

    var attemptTags = function() {
        setTimeout(function() {
            try {
                // console.log('Generate tags');
                generateTagsMenu();
            } catch(e) {
                // console.log("Got exception",e);
                attemptTags();
            }
        },500);
    };

    attemptTags();

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


    // Add styles
    jQ('body').append("<style>"+
    "#tagsMenu{max-width: 250px; right: 140px;}"+
    "#tagsMenu a {margin: 0 5px; display: block;}"+
    "#recentLinksMenu{right:400px}"+
    ".menuButton{display: block; color: white; margin-left: -1px;    padding: 8px 1em;    font-size: 13px;    text-align: center;    float: right;    border-bottom: none;    border-left: 1px solid #111;    border-right: 1px solid #111; border-radius: 0;    background-color: #555;    position: relative;}"+
    "</style>");
}

// load jQuery and execute the main function
addJQuery(main);
