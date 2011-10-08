---
title: CSS toggle switches
published: true
layout: post
categories:
- code
- design
- accessibility
---

Back in August I saw [Orman Clark](http://www.premiumpixels.com)'s latest work at the time, a [set of beautiful toggle switches](http://www.premiumpixels.com/freebies/sort-switches-toggles-psd/), and decided I'd have a go at creating a functional version of them.

We must start with some meaningful markup, this will ensure our switches are accessible and work everywhere.

## Radio

The best way to mark up the multi-state switch is to use radio buttons. The first obvious advantage is that it supports an unlimited number of options, and is easily usable by keyboard alone.

{% highlight html %}
<fieldset>
	<legend>View: </legend>
	
	<input id="week" name="view" type="radio" checked>
	<label for="week">Week</label>

	<input id="month" name="view" type="radio">	
	<label for="month">Month</label>
	
	<span class="switch-button"></span>
</fieldset>
{% endhighlight %}

I use a `fieldset` to wrap the switch, along with a `legend` for the switch label, and the radio buttons with a label for each.

### Accessibility
We don't have to use any `aria-roles` for the switch, because we're using proper markup, and screen-readers (or other assistive technology) will properly recognize it as a form control.

We need to hide the inputs, but we can't use `display: none`, because this will also hide them from screen readers, and make them unreachable by keyboard. 

To overcome these issues we hide them by moving them off screen. 

{% highlight css %}
input
hide
{% endhighlight %}

NVDA will reach the `fieldset`, read the `legend`, and stop on the first input. Then we can use the up-down/left-right keys to switch between the `input`s.

### Switch button
So what that's horrible empty `.switch-button` `span`?!
While I'm not really a fan of empty elements used only for styling purposes, we're forced to use an actual element, rather than a pseudo-element, if we want to be able to use transitions on the switch.

There is a bug in most current web browsers, except Firefox 4+, that prevents CSS3 animation and transitions on pseudo-element. More about [Transitions and Animations on CSS Generated Content](http://css-tricks.com/13555-transitions-and-animations-on-css-generated-content/).

### Look

We create the background slide rail with an `:after` pseudo-element on the `legend`.

{% highlight css %}
leged:after code
{% endhighlight %}

Then we position the labels next to each other, and create the look of the switch button. I won't go into to many details regarding the look of the switch, since you're all pretty familiar with CSS rounded corners, gradients and box-shadows.

### Behavior

This is where all the magic happens. We implement the full functionality of the switch only with CSS, by targeting the `.switch-button`, from the `:checked` input, using the general sibling selector.

{% highlight css %}
input:checked ~ d.switch-button
{% endhighlight %}

The switch is now fully functional, but we're lacking one important feature: a way to style the focused label, this is especially useful for users that are unable to use a mouse.

### Active label

To style the active label differently, we target the label following the checked input, using the adjacent sibling selector.

{% highlight css %}
input:checked + label
{% endhighlight %}

We also need to provide a way to highlight the focused label, even if the associated input is not checked. We'll use the same technique we used for the checked item, but instead of using the `:checked` pseudo-class, we'll use `:focus`, and provide an outline for it.

{% highlight css %}
input:focus + label
{% endhighlight %}

This benefits mostly Opera, since it's the only browser that allows you to reach each option using Tab, and select it by pressing the Enter/Return or Space keys. Other browsers jump to the next fieldset when pressing Tab. 

Every browser, except Chrome, will also focus the label when clicking it. Chrome will only focus it when reached by keyboard.


## Checkbox

