---
title: Mobile support for the CSS toggle switches
layout: post
categories:
- code
- design
---

While testing the [CSS toggle switches]({% post_url 2011-10-21-css-toggle-switches %}) from my last article, I noticed they had issues, or didn't work at all, in various mobile browsers. The only mobile browsers which seemed to properly support the switches were Firefox Mobile and Opera Mobile.

For both the radio and checkbox-based versions, the switches looked alright but the behavior wasn't working; the toggle buttons didn't move when selected.

The only version that worked properly was the one where the checkbox input was placed inside the label. 

After some digging, I ended up at [The Ninja's website](http://www.thecssninja.com/css/custom-inputs-using-css), who also had similar problems with his custom radio and checkbox inputs. His latest solution to the iOS issue was to make sure the input is topmost, and set it's `opacity` to zero.

When applying this technique on the basic checkbox-based example, after taping the switch, the background, border, and text colors where changing, but the position of the button wasn't.

The `.toggle input:checked + label:after` rule was working, while the `.toggle input:checked ~ span` rule, supposed to change the position of the toggle button, wasn't.

Also, it wasn't working at all for the radio input-based switch.


## Mobile Webkit

After some more digging, it turns out that most mobile Webkits try to prevent reflows, and don't trigger them when checking/selecting radios or checkboxes. I'm guessing this is mostly for performance reasons.

That's why, to get mobile support, you have to force a reflow when toggling the switch. The only way to do this is to use JavaScript.


## Opera Mini

Since Opera Mini is one of the most used mobile browsers, supporting it is big plus. And, even though it's a proxy browser, it does have some support for JavaScript. Still, using the same technique to trigger a reflow as on the other mobile browsers, isn't working.

But, it turns out that setting the `checked` property on the input with JavaScript, does trigger a sort-of-reflow. It will reload the page, with the new option selected. It's probably the best solution we can get for Opera Mini, since it doen't have any "real" interactions on the page.


## The Script

The script I put together is pretty straight forward, except for a couple of things.

{% highlight javascript %}
/* Minimal Touch support test.
 * You should probably use Modernizr.
 */
var touchSupport = ('ontouchstart' in window);

// Utility function, needed to get the input elements next to labels
Object.prototype.previousObject = function() {
	var p = this;
	do p = p.previousSibling;
	while (p && p.nodeType != 1);
	return p;
}

/* Manualy check the input, for Opera Mini/proxy browsers
 */
function checkRadio(e) {	
	e.target.previousObject().checked = true;
};

/* Force reflow
 */
function forceReflow(e) {
	/* There's a delay between taping a label, and checking the input.
	 * That's why we have to 
	 */
	if(e.target.previousObject().checked) {
		// force reflow
		document.body.className = document.body.className;
	} else {
		// if the input is not checked yet, try again
		setTimeout(function() { forceReflow(e) }, 100);
	};	
};

/* Get all labels on the page.
 * You should use a more specific selector on your page.
 */
var labels = document.querySelectorAll('label');

if(touchSupport) {
	// Mobile Webkit(Android, iOS, BB, WebOS, etc.), and others with Touch support
	var i;
	for(i = 0; i < labels.length; i++ ) {
		labels[i].ontouchstart = forceReflow;
	};
	
} else {
	// Non-touch browsers, Opera Mini and other proxy-browsers
	for( var i = 0; i < labels.length; i++ ) {
		labels[i].onclick = checkRadio;
	};
	
};
{% endhighlight %}

I'm using the timeout because there seems to be a delay between taping the label, and the input actually getting checked. If we trigger the reflow too early, before the input is checked, it still won't change it's position. So we have to wait until the input is checked, before the reflow.

The reflow is triggered using:
{% highlight javascript %}
document.body.className = document.body.className
{% endhighlight %}


These solutions should also work on other "checkbox-hack" experiments.

The demos are on Github: [css-toggle-switch](https://github.com/ghinda/css-toggle-switch).