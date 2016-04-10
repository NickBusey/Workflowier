// ==UserScript==
// @name         Workflowier
// @namespace    Workflowier
// @include      https://workflowy.com/*
// @author       Nick Busey
// @grant        none
// @description  User Script for Workflowy.com that adds some extra features.
// @version      0.0.2.1
// @updateURL    https://greasyfork.org/scripts/18496-workflowier/code/Workflowier.user.js
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

    jQ('#showRecentLinks').click(function(e) {
        e.preventDefault();
        jQ('#recentLinksMenu').slideToggle();
    });

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

    var generateTagList = function() {
        // Generate list of all hashtags
        var tags = $('.contentTagText');
        var tagObjs = {};
        tags.each(function(ii, obj) {
            var tag = jQ(obj).text().toLowerCase();

            var tagObj = tagObjs[tag];
            if (!tagObj) {
                tagObj = {'count':1};
            } else {
                tagObj.count++;
            }
            tagObjs[tag] = tagObj;
        });
        var tagObjsArray = [];
        for (var tag in tagObjs) {
            var tagObj = tagObjs[tag];
            tagObj.tag = tag;
            tagObjsArray.push(tagObj);
        }
        return tagObjsArray.sort(function (a, b) {
            return b.count - a.count;
        });
    };

    var generateTags = function() {
        var currentSearch = jQ('#searchBox').val();
        // First let's delete the existing tags index, or else it will count those and old tags are never removed.
        search.searchProjectTree('#wf-tag-list');
        $('.project.matches:last .notes .content').text('');
        $('.project.matches:last .content').trigger('blur');
        // Now find existing tags.
        search.searchProjectTree('#');
        var allTags = generateTagList();
        // Now find which of those are completed
        search.searchProjectTree('# is:complete');
        var completedTags = generateTagList();

        // Store the list of tags
        updateTagsNote(allTags);

        // Update the menu
        var tagLinkOutput = '';
        for (var ii in allTags) {
            var count = allTags[ii]['count'];
            var tag = allTags[ii]['tag'];
            var completed = completedTags.filter(function (obj) {
                return obj.tag === tag;
            });
            var completed_count = (completed[0]) ? completed[0].count : 0;
            tagLinkOutput += "<a href='/#/"+tag+"?q=%23"+tag+"' title='"+Math.round(100*(completed_count/count))+"% "+completed_count+"/"+count+" complete.'><strong>"+count+"</strong> #"+tag+"</a>";
        }
        $('#tagsMenu').html(tagLinkOutput);
        search.searchProjectTree(currentSearch);

    };

    var generateTagsMenu = function () {
        // Ensure the search is ready. This will throw an exception if not.
        var currentSearch = jQ('#searchBox').val();
        search.searchProjectTree('#wf-tag-list');
        search.searchProjectTree(currentSearch);

        generateTags();
        jQ('#savedViewHUDButton').after("<div class='button menuButton'><div class='topBarButtonTextContainer'><a href='#' class='button' id='openTags'>View Tags</a></div></div><div class='menu-options' id='tagsMenu'></div>");
        jQ('#openTags').on('click',function(e) {
            e.preventDefault();
            // If we're showing the tags menu, regenerate the tags list. Don't do it on hide.
            if ($('#tagsMenu:visible').length < 1) {
                generateTags();
            }
            jQ('#tagsMenu').slideToggle();
        });
    };

    var updateTagsNote = function(tagArray) {
        window.location.hash='';
        search.searchProjectTree('#wf-tag-list');
        var tagList = '';
        for (var ii in tagArray) {
            var count = tagArray[ii]['count'];
            var tag = tagArray[ii]['tag'];
            tagList += count+" #"+tag+" - ";
        }

        $('.project.matches:last .notes .content').text('View Full List: '+tagList);
        $('.project.matches:last .content').trigger('blur');
    };

    var attemptTags = function() {
        setTimeout(function() {
            try {
                generateTagsMenu();
            } catch(e) {
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

    // Add image popups
    // jQ('a').live('mouseenter',function (e) {
    //     console.log(e);
    // });

    // Add styles
    jQ('body').append("<style>"+
        "#tagsMenu{ height:300px; overflow:scroll; max-width: 250px; right: 140px; }"+
        "#tagsMenu a { margin: 0 5px; display: block; }"+
        "#recentLinksMenu{ right:400px; }"+
        ".menuButton{ display: block; color: white; margin-left: -1px;    padding: 8px 1em;    font-size: 13px;    text-align: center;    float: right;    border-bottom: none;    border-left: 1px solid #111;    border-right: 1px solid #111; border-radius: 0;    background-color: #555;    position: relative;}"+
    "</style>");

    // Add coloring styles (ala Paintly, stolen from: https://userstyles.org/styles/125832/re-workflowy-re-painter)
    setInterval(function() {
        $('.content').css('color','');
        var colors = {
            'red':'#FFB5B5',
            'orange':'#FFD8B5',
            'yellow':'#FFFAB5',
            'lime':'#E1FFB5',
            'olive':'#B5FFC9',
            'green':'#CCFFB5',
            'teal':'#B5FFD7',
            'aquea':'#B5FFFC',
            'blu':'#B5E8FF',
            'navy':'#B9B5FF',
            'fuchia':'#F1B5FF',
            'purple':'#D3B5FF',
            'maroon':'#C08F8F',
            'silver':'silver',
            'gray':'gray',
            'black':'black',
            'white':'white'
        };
        for (var ii in colors) {
            var color = colors[ii];
            $('.content:contains("#'+ii+'")').css('background-color',color);
        }
    },500);
}

// load jQuery and execute the main function
addJQuery(main);
