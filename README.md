# Workflowier
User Script for Workflowy.com that adds some extra features.

## Screenshot

http://i.imgur.com/Plhvj50.png

## Installation

### Automated Install
Go to: https://greasyfork.org/en/scripts/18496-workflowier and click 'Install'.

### Manual Install
Install Tampermonkey for Chrome. Go to workflowy.com, click the Tampermonkey icon, then click 'Add new script'. Delete everything in the large text area and copy and paste the contents of script.js instead, hit save. Reload workflowy.com.

## Support

### Community

https://www.reddit.com/r/Workflowier

### Bugs

https://github.com/NickBusey/Workflowier/issues

## Roadmap

### Current features

 - Adds a 'View Tags' button which opens a menu with a link to every hashtag in your document, with a count of how many times each tag appears.
 - Percentage complete of hashtags on mouse-over in the menu (in the title attribute)
 - Stores a list of hashtags ordered by frequency as last Node in Workflowy. That way you have access to a full tags list on Mobile Apps also. Generated on page load and every time you open the 'View Tags' menu. Working on auto-saving of this.
 - Add a 'Recent' menu with 'this week', 'today', and 'just now' buttons to show recently changed items.
 - Random hashtag functionality. Any hashtags with -rand at the end will go to another random item with the same hashtag. Basically recreates the functionality of flash cards.
 - Color coded hashtags ala painterly.

  Example: #spanish-rand for spanish words you want to study. #capitals-rand for capitals.


### Planned features

 - -randlist hash tag that just shows a random child. This may be more useful than having to put the -rand tags on each item you want to flash through.
 - Show percentage of hashtag items that are 'complete'.
 - Show streak of recently created items with hashtags that have been 'completed'. This will replicate "don't break the chain" functionality.
 - Better install/install directions?
 - Saved settings.
 - 'Always show completed items' setting toggle.
 - Random links colored differently.
 - Website with demo gifs
 - Filters for 'shared' and 'embedded'
 - Additional keyboard shortcuts
 - Individual list completion (Given one todo list with a certain hashtag, calculate and display the percentage complete of that list)
 - Generate charts of historical data (Given a hashtag with a data point eg: #chart-weight 150 it will chart the point over time )

