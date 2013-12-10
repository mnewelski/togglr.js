togglr.js
=========

  togglr.js v.0.1
  
  jQuery Plugin by Matt Newelski

  This plugin introduces toggle of individual FAQ-style items + Hide/Show All items, while keeping track of opened "answers" in a cookie,
  so when users refreshes the page the previous toggle states are applied.

  In order for it to function you need to:

  - include jQuery library (i.e. jquery-1.10.2.min.js)
  - include this script at the end of your HTML document
  - initialize this plugin on selected element (i.e. <script>$("#faqContainer").togglrMe();</script>)
  - ensure that your Show/Hide All functionality is contained in two DIVs of the same class (.ttoggle)
  - esnure your question/answer pairs must be sibling elements and must contain (.ttitle) and (.tcontent) classes respectively
  - host this on a server (IIS/Apache) in order for the cookie functionality to work

  To Do:

  - when user expands/collapses all and then manually toggles more than half of the items, the Show/Hide all needs to toggle as well
    i.e. when user selects Show All (link changed to Hide All, all answers expanded) and then manually toggles more than half of the
    answers the Show All/Hide All link should toggle, since we don't want to end up with it saying Hide All and all answers collapsed
    or Show All and all answers expanded
  - add configuration, so user can specify animations of collapsing/expanding

  Note:

  In the comments below, these are the terms/class names we will use

  togglr = parent element that we initialize the plugin on
  ttoggle = Show All/Hide All element - in HTML these are two DIVs each with the same class
  ttitle = FAQ quesion
  tcontent = FAQ answer
  stateList = array of questions that are open (mirrored in the cookie called "stateListCookie")
