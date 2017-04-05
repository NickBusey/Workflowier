# NOTICE: This project is no longer developed or maintained.

## Instead work is proceeding on http://github.com/NickBusey/BulletNotes

http://workflowier.com/

User Script for Workflowy.com that adds some extra features.

## Screenshot

http://imgur.com/a/CMegu

## Installation

### Automated Install

Go here: https://openuserjs.org/scripts/NickBusey/Workflowier

Click Install.

### Manual Install
Install Tampermonkey for Chrome. Go to workflowy.com, click the Tampermonkey icon, then click 'Add new script'. Delete everything in the large text area and copy and paste the contents of script.js instead, hit save. Reload workflowy.com.

## Features

 - Calendar view, shows upcoming tasks with date completion percentage.
 - Adds a 'View Tags' button which opens a menu with a link to every hashtag in your document, with a count of how many times each tag appears.
 - Percentage complete of hashtags on mouse-over in the menu (in the title attribute)
 - Stores a list of hashtags ordered by frequency as last Node in Workflowy. That way you have access to a full tags list on Mobile Apps also. Generated on page load and every time you open the 'View Tags' menu. Working on auto-saving of this.
 - Add a 'Recent' menu with 'this week', 'today', and 'just now' buttons to show recently changed items.
 - Random hashtag functionality. Any hashtags with -rand at the end will go to another random item with the same hashtag. Basically recreates the functionality of flash cards.
  Example: #spanish-rand for spanish words you want to study. #capitals-rand for capitals.
 - Color coded hashtags ala painterly.
 - Image Previews

### Planned Features

https://github.com/NickBusey/Workflowier/projects/1
