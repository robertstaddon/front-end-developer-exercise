$( document ).ready(function() {
	$('body').addClass('js');
	
	SocialSteps.init();		
    TabbedContent.init();
});

/*
 * TabbedContent: Control tab functionality
 */
var TabbedContent = TabbedContent || {};
(function(obj) {
    obj.init = function() {
		$('.content nav li a').first().addClass('active');
		
		$('.content nav').on('click', 'li a', function(event) {
			$(this).parent().siblings().children().removeClass('active');
			$(this).addClass('active');

			slideTabBg($(this));
			slideContent($(this));
			
			event.preventDefault();
		});
    };

	function slideTabBg(tab) {
		var bgObj = tab.parents('nav').find('.moving-bg');
		var bgMarginTop = parseInt( tab.parents('ol').css('marginTop') );
		$(bgObj).stop().animate({
			top: tab.position()['top'] + bgMarginTop
		}, 800, 'swing' );
	};

    function slideContent(tab) {
		var articleEl = tab.parents('div.content').find('article');
		var sectionEl = tab.parents('div.content').find('section');
		var tabNum = tab.parent().prevAll().length;
		
		var margin = sectionEl.height() * tabNum * -1;
		
		articleEl.stop().animate({
			marginTop: margin + "px"
		}, 800, 'swing' );
    };
})(TabbedContent);

/*
 * SocialSteps: Load social information for each Baby Step
 */
var SocialSteps = SocialSteps || {};
(function(obj) {
	obj.init = function() {
		$.getJSON('baby-steps.json', function(data) {
			totalSteps = 7;
			
			_.times(totalSteps, function(n) {
				var stepNumber = n + 1;
				
				var friends = _.where(data.friends, { babyStep: stepNumber });
				
				var socialText = getText(friends, stepNumber);
				
				if(!_.isEmpty(socialText))
					$( "article#baby-step-" + stepNumber ).append('<p class="social">' + socialText + '</p>');
			});
		});
	};
	
	function getText(friends, stepNumber) {
		friends = _.sortByAll(friends, ["lastName", "firstName"]);
		
		var socialText = "";
		switch(_.size(friends)) {
			case 0:
				break;
			case 1:
				socialText =
					displayName(friends[0]) + " is also in Baby Step " + stepNumber;
				break;				
			case 2:
				socialText =
					displayName(friends[0]) + " and " +
					displayName(friends[1]) + " are also in Baby Step " + stepNumber;
				break;
			case 3:
				socialText =
					displayName(friends[0]) + ", " +
					displayName(friends[1]) + ", and 1 other friend are also in Baby Step " + stepNumber;
				break;
			default:
				var otherFriends = _.size(friends) - 2;
				socialText =
					displayName(friends[0]) + ", " +
					displayName(friends[1]) + ", and " + otherFriends + " other friends are also in Baby Step " + stepNumber;
				break;
		}
		return socialText;
	};
	
	function displayName(friend) {
		return '<a href="">' + friend.firstName + ' ' + friend.lastName + '</a>';
	};
})(SocialSteps);