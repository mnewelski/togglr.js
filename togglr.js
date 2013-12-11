/*
  Togglr.js v.0.1
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

*/
(function( $ ) {
  
      var stateList = [];
    
    $.fn.togglrMe = function() {
      return this.each(function() {
      //add class togglr to your parent element - needed for functionality
      $(this).addClass('togglr');
      //stateList contains classes of opened tcontents in the format tc1, tc2, etc.
      stateList = checkCookie();
      //all questions are open in the cookie - change from default Show All to Hide All
      if ($(".tcontent").size() == stateList.length) {$(".ttoggle").toggle(); $(".togglr").addClass("texpanded");}
      //hide all tcontent elements by default - this removes the necessity of adding display: none; to tcontent in CSS
    	$(".tcontent").hide();
      //for each of the tcontent elements
    	$(".tcontent").each(function(index) {
    		//add class tc+number, so first tcontent element will have class tc0 added, the second will have tc1, etc.
        $(this).addClass("tc" + index);
    		//if current tcontent element is found in the stateList array, expand it
        if (jQuery.inArray("tc" + index, stateList ) != -1) {
    		   $(this).show();
           $(this).prev(".ttitle").addClass("topen");
    		}
    	});

      //user clicks on the Show/Hide All button
    	$(".ttoggle").on('click',function(){
    		//if all questions are expanded
        if ($(".togglr").hasClass("texpanded"))
    		{
          //collapse all, so clear the array
    			stateList = [];
          //hide all tcontent elements
    			$(".tcontent").hide();
          //remove class topen from all tcontent elements
          $(".tcontent").prev(".ttitle").removeClass("topen");
          //remove class texpanded from togglr element
    			$(".togglr").removeClass("texpanded");
          //change Show All to Hide All
    			$(".ttoggle").toggle();
          //clear the stateListCookie - no tcontent elements should be visible
          //setCookie("stateListCookie", '', 365);
    		}
        //all questions are collapsed (since togglr has no class texpanded)
    		else
    		{
          //clear the stateListCookie - getting gready to populate new values
    			stateList = [];
          //show all tcontent elements
    			$(".tcontent").show();
          // add class topen to all tcontent elements
          $(".tcontent").prev(".ttitle").addClass("topen");
          //add class texpanded to togglr element
    			$(".togglr").addClass("texpanded");
          //change Hide All to Show All
    			$(".ttoggle").toggle();
          //for each tcontent element
    			$(".tcontent").each(function(index) {
            //append its unique class to the array (i.e. tc0, tc1, tc2, etc.)
  		  		  stateList.push("tc" + index);
  		  	});
          //update the stateListCookie - all tcontent elements should be visible - this array gets turned into a string with "," being the delimiter
    			//setCookie("stateListCookie", stateList.join(','), 365);
    		}
    	});
      //user clicks on the ttitle (i.e. question)
    	$(".ttitle").on('click', function(){
        //if the next tcontent (i.e. answer) element is hidden/collapsed
    		if ($(this).next(".tcontent").is(":hidden")) {
          //display it
    			$(this).next(".tcontent").show();
          //add class topen to ttitle element (note: no class gets added to the tcontent element)
          $(this).addClass("topen");
          //add this tcontent element to the stateList array (since it now became visible/expanded)
    			stateList.push("tc" + $(this).next(".tcontent").attr("class").split("tc").pop());
          //update the cookie with the current state of stateList - this array gets turned into a string with "," being the delimiter
          //setCookie("stateListCookie", stateList.join(','), 365);
    		}
        //else, the next tcontent (i.e. answer) element is visible/expanded
    		else {
          //hide it
    			$(this).next(".tcontent").hide();
          //remove class topen from title element (note: no class gets removed from the tcontent element)
          $(this).removeClass("topen");
          //remove this tcontent element from the stateList array (since it now became hidden/collapsed)
    			stateList.splice( $.inArray("tc" + $(this).next(".tcontent").attr("class").split("tc").pop(), stateList),  1);
          //update the cookie with the current state of stateList
    			//setCookie("stateListCookie", stateList.join(','), 365);
    		}
    	});

      window.onbeforeunload = function (){
        setCookie("stateListCookie", stateList.join(','), 365);
      }
    });



  /* 

  Cookie functionality - copied from ttp://www.w3schools.com/js/js_cookies.asp
  
  Note: the W3Schools example was modified to accomodate for different cookie name and the fact that we need to split the array before storing it in the cookie

*/

function getCookie(c_name)
{
var c_value = document.cookie;
var c_start = c_value.indexOf(" " + c_name + "=");
if (c_start == -1)
{
c_start = c_value.indexOf(c_name + "=");
}
if (c_start == -1)
{
c_value = null;
}
else
{
c_start = c_value.indexOf("=", c_start) + 1;
var c_end = c_value.indexOf(";", c_start);
if (c_end == -1)
{
c_end = c_value.length;
}
c_value = unescape(c_value.substring(c_start,c_end));
}
return c_value;
}

function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}

function checkCookie()
{
var stateListCookie = getCookie("stateListCookie");
if (stateListCookie!=null && stateListCookie!="")
  {

    stateList = stateListCookie.split(",");
    return stateList;
    
  }
  else {
    return stateList;
  }
}




  };
 
}( jQuery ));
