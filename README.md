# Workflowier
User Script for Workflowy.com that adds some extra features.

## Installation

Install Tampermonkey for Chrome. Go to workflowy.com, click the Tampermonkey icon, then click 'Add new script'. Delete everything in the large text area and copy and paste the contents of script.js instead, hit save. Reload workflowy.com.

## Current features

 - Adds a 'View Tags' button which opens a menu with a link to every hashtag in your document, with a count of how many times each tag appears.
 - Adds 'this week', 'today', and 'just now' buttons to the header to show recently changed items.
 - Random hashtag functionality. Any hashtags with -rand at the end will go to another random item with the same hashtag. Basically recreates the functionality of flash cards.

  Example: #spanish-rand for spanish words you want to study. #capitals-rand for capitals.


## Planned features

 - Store full Tag List as the first Node in Workflowy upon every generation. That way you have access to a full tags list on the mobile apps also.
 - -randlist hash tag that just shows a random child. This may be more useful than having to put the -rand tags on each item you want to flash through.
 - Sort tag list by count.
 - Show percentage of hashtag items that are 'complete'.
 - Show streak of recently created items with hashtags that have been 'completed'. This will replicate "don't break the chain" functionality.
 - Better install/install directions?
 - Saved settings.
 - 'Always show completed items' setting toggle.
 - Color coded hashtags ala painterly.
 - Random links colored differently.
