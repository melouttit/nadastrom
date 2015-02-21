var tumblr_api_read = null; // this is important do not remove

$(document).ready(function() {	
		// setup our namespace
		$.tumblr = {};
		
		// modify these
		
		$.tumblrNews = "http://nadastrom.tumblr.com/api/read/json?tagged=news&callback=?";
		// $.tumblrMusic = "http://nadastrom.tumblr.com/api/read/json?tagged=music&callback=?";
		
		$.tumblrNewsDiv = $('#nadastromNewsFeed');
		// $.tumblrNewsPageDiv = $('#nadastromNewsPageFeed');
		// $.tumblrMusicDiv = $('#nadastromMusicFeed');
		
		$.tumblr.numPostsToDisplay = 1;
		
		$.tumblr.postMaxDescriptionLength = -1; // set to -1 to turn off jquery.expander
		$.tumblr.videoWidth='200'; // youtube default 400
		$.tumblr.videoHeight='163'; // youtube default 325
		
		// do not modify these unless you are hardcorece
		$.tumblr.imagePath = 'files.nadastrom.com/images/';	
		$.tumblr.postCount = 0;
		
 		reloadTumblr();
});		
  
function reloadTumblr(){  	
  	$('#nadastromNewsFeed').empty();
  	//$(".nadastrom-feed").append("<div class='body'>loading Tumblr <img class='icon' src='" + $.tumblr.imagePath + "loading.gif'/></div>"); //ADD IMAGE TO FILE

    //NEWS
  	$.ajax({
		url: $.tumblrNews,
		dataType: 'script',
		timeout: 10000,
		success:function(){ 
				$.tumblrNewsDiv.empty();
				if ((tumblr_api_read == undefined) || (tumblr_api_read == null)) {
						$.tumblrNewsDiv.append("<div class='title' href='#'>unable to load Tumblr</div>");
						$.tumblrNewsDiv.append("<div class='body'><a href=\"#\" onclick=\"javascript:reloadTumblr();\">[retry]</a></div>");    			
				} else {
						$.tumblr.postCount = 0;
						$.each(tumblr_api_read.posts.slice(0, 10), function(i,post){
								if ($.tumblr.postCount >= 6) {
										return;
								}    			
								parseTumblrJSON(post,$.tumblrNewsDiv);
								$.tumblr.postCount++;
						});
				}
		},
		error:function (xhr, statusTxt, errorTxt){
				$.tumblrNewsDiv.append("<a class='title' href='#'>Tumblr Parse Error</a>");
				$.tumblrNewsDiv.append("<div class='body'>" + errorTxt + "<br/>" + xhr.responseText + "</div>");
		} 					      
         });
	
  }
	
	function formatDate(d) {
		/*
Format  Description                                                                  Example
------  ---------------------------------------------------------------------------  -----------------------
 s      The seconds of the minute between 0-59.                                      "0" to "59"
 ss     The seconds of the minute with leading zero if required.                     "00" to "59"
 
 m      The minute of the hour between 0-59.                                         "0"  or "59"
 mm     The minute of the hour with leading zero if required.                        "00" or "59"
 
 h      The hour of the day between 1-12.                                            "1"  to "12"
 hh     The hour of the day with leading zero if required.                           "01" to "12"
 
 H      The hour of the day between 0-23.                                            "0"  to "23"
 HH     The hour of the day with leading zero if required.                           "00" to "23"
 
 d      The day of the month between 1 and 31.                                       "1"  to "31"
 dd     The day of the month with leading zero if required.                          "01" to "31"
 ddd    Abbreviated day name. Date.CultureInfo.abbreviatedDayNames.                  "Mon" to "Sun" 
 dddd   The full day name. Date.CultureInfo.dayNames.                                "Monday" to "Sunday"
 
 M      The month of the year between 1-12.                                          "1" to "12"
 MM     The month of the year with leading zero if required.                         "01" to "12"
 MMM    Abbreviated month name. Date.CultureInfo.abbreviatedMonthNames.              "Jan" to "Dec"
 MMMM   The full month name. Date.CultureInfo.monthNames.                            "January" to "December"

 yy     The year as a two-digit number.                                              "99" or "08"
 yyyy   The full four digit year.                                                    "1999" or "2008"
 
 t      Displays the first character of the A.M./P.M. designator.                    "A" or "P"
        $C.amDesignator or Date.CultureInfo.pmDesignator
 tt     Displays the A.M./P.M. designator.                                           "AM" or "PM"
        $C.amDesignator or Date.CultureInfo.pmDesignator
 
 S      The ordinal suffix ("st, "nd", "rd" or "th") of the current day.            "st, "nd", "rd" or "th"
 	*/
 		return d.toString('MMMM d');
	}
	
	function processResponse() {  }
	
	//FOR NEWS AND MUSIC ON HOMEPAGE
	function parseTumblrJSON(post,container) {
		//alert(post.type);
		var d = Date.parse(post["date-gmt"]);
		var dateFmt = formatDate(d);
		
    switch(post.type)
    {		    	
    	case "regular":
    	{
    		
		// container.append("<div class='date'>" + dateFmt + "</div>");
    		container.append("<div class='body regular'><time>Posted: " + dateFmt + "</time>" + post["regular-body"] + "</a>");
    		break;
    	}
    	case "link":
    	{				

    		container.append("<time>Posted: " + dateFmt + "</time><a class='title' href='" + post["link-url"] + "' target='_blank'>" + post["link-text"] + "</a>");
    		break;
    	}		    	
    	case "quote":
    	{
    	
    		container.append("<div class='body quote'><time>" + dateFmt + "</time>" + 
    			"<div class='quote expandable'>" + post["quote-text"] + "</div>" +
    			"<div class='quotesrc'>" + post["quote-source"] + "</div>" +
    			"</div>");
    		break;
    	}		    	
    	case "photo":
    	{					
    		// valid values are: photo-url-[75, 100, 250, 400, 500, 1280]
    		
    		container.append("<div class='body photo clearfix'><time>Posted: " + dateFmt + "</time>" +
          "<img class='image-promo' src='" + post["photo-url-500"] + "'/>" + 
    			// "<a class='title' href='" + post.url + "' target='_blank'>View Image &raquo;</a>" + 
    			"</div>");
    		break;
    	}
    	case "conversation":
    	{					
					    		
    		var html = '';
    		container.append("<a class='title' href='" + post.url + "' target='_blank'><time>" + dateFmt + "</time>" + post["conversation-title"] + "</a>");

				for(var i = 0; i < post["conversation"].length; i++) {
					var conv = post["conversation"][i];						
					html += "<div class='convlabel'>" + conv.label + "</div>";
					html += "<div class='convtext expandable'>" + conv.phrase + "</div>";
				}

				/*    		
				$(this).find("line").each(function(){
					html += "<div class='convlabel'>" + $(this).attr("label") + "</div>";
					html += "<div class='convtext'>" + $(this).text() + "</div>";
				});*/
    				    		
    		container.append("<div class='body convo'>" + html + "</div>");
    		break;
    	}
    	case "audio":
    	{

    		container.append("<a class='title' href='" + post.url + "' target='_blank'><time>" + dateFmt + "</time>" + post["audio-caption"] + "</a>");
    		//container.append("<div class='body'>" + post["audio-player"] + "</div>");
    		break;
    	}
    	case "video":
    	{
						
    		container.append("<div class='body video'><time>Posted: " + dateFmt + "<div class='caption'>" + post["video-caption"] + "</div></time><div class='video-player'>" + post["video-player"] + "</div></div>");
    		// resize our video code if possible
    		var vdo = post["video-player"];
    		var re = new RegExp('width=\"([a-zA-Z0-9]*)\"', 'g');
    		vdo = vdo.replace(re, 'width="' + $.tumblr.videoWidth + '"');
    		re = new RegExp('height=\"([a-zA-Z0-9]*)\"', 'g');
    		vdo = vdo.replace(re, 'height="' + $.tumblr.videoHeight + '"');    		
    		re = new RegExp('400,320', 'g');
    		vdo = vdo.replace(re, $.tumblr.videoWidth + ',' + $.tumblr.videoHeight);
    		re = new RegExp('400,250', 'g');
    		vdo = vdo.replace(re, $.tumblr.videoWidth + ',' + $.tumblr.videoHeight);
    		//$("#tumblrFeed").append("<div class='body'>" + vdo + "</div>");
    		break;
    	}		    	
    	default:
    		break;
    }
    // container.append("<div class='clear'>&nbsp;</div>");
	}	
	

