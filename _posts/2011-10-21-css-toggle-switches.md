---
title: CSS toggle switches
published: true
layout: post
---

> **Update December 2012**
>
> The latest version of the toggle switch has full mobile support and easy integration with [Twitter Bootstrap](https://ghinda.net/css-toggle-switch/bootstrap.html) or [ZURB Foundation](https://ghinda.net/css-toggle-switch/foundation.html).
>
> See the latest demos: [CSS Toggle Switch](https://ghinda.net/css-toggle-switch/).

Back in August I saw [Orman Clark](http://www.premiumpixels.com)'s latest work at the time, a [set of beautiful toggle switches](http://www.premiumpixels.com/freebies/sort-switches-toggles-psd/), and decided I'd have a go at creating a functional version of them.

We must start with some meaningful markup, this will ensure our switches are accessible and work everywhere.

## Radio

The best way to mark up the multi-state switch is to use radio buttons. The first obvious advantage is that it supports an unlimited number of options, and is easily usable by keyboard alone.

```html
<fieldset>
  <legend>View: </legend>

  <input id="week" name="view" type="radio" checked>
  <label for="week">Week</label>

  <input id="month" name="view" type="radio">
  <label for="month">Month</label>

  <span></span>
</fieldset>
```

I use a `fieldset` to wrap the switch, along with a `legend` for the switch label, and the radio buttons with a label for each.

### Accessibility

We don't have to use any `aria-roles` for the switch, because we're using proper markup, and screen-readers (or other assistive technology) will recognize it as a form control.

We need to hide the inputs, but we can't use `display: none`, because this will also hide them from screen readers, and make them unreachable by keyboard.

To overcome these issues we hide them by moving them off screen.

```css
fieldset input {
  position: absolute;
  top: -9999px;
}
```

NVDA will reach the `fieldset`, read the `legend`, and stop on the first input. Then we can use the up-down/left-right keys to switch between the `input`s.

### Switch button
&ldquo;So what that's empty `span`?&rdquo;, you might ask.
While I'm not really a fan of empty elements used only for styling purposes, we're forced to use an actual element, rather than a pseudo-element, if we want to be able to use transitions on the switch.

There is a bug in most web browsers right now, except Firefox 4+, that prevents CSS3 animation and transitions on pseudo-elements. More about [Transitions and Animations on CSS Generated Content](http://css-tricks.com/13555-transitions-and-animations-on-css-generated-content/).

### Look

We create the background slide rail with an `:after` pseudo-element on the `legend`.

```css 
legend:after {
  content: '';

  position: absolute;
  top: 0;
  left: 50%;
  z-index: 0;

  width: 50%;
  height: 100%;
  padding: 2px;
  background-color: #2d3035;

  border-radius: 3px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3), 0 1px 0px rgba(255, 255, 255, 0.2);
}
```

Then we position the labels next to each other, and create the look of the switch button. I won't go into to many details regarding the look of the switch, since you're all pretty familiar with CSS rounded corners, gradients and box-shadows.

### Behavior

This is where all the magic happens. We implement the full functionality of the switch only with CSS, by targeting the `span`, from the last `:checked` input, using the general sibling selector.

```css
fieldset input:last-of-type:checked ~ span {
  left: 75%;
}
```

The switch is now fully functional, but we're lacking one important feature: a way to style the focused label, this is especially useful for users that are unable to use a mouse.

### Active label

To style the active label differently, we target the label following the checked input, using the adjacent sibling selector.

```css
fieldset input:checked + label {
  color: #2d592a;
  text-shadow: 0 1px 0 rgba(255,255,255,0.5);
}
```

We also need to provide a way to highlight the focused label, even if the associated input is not checked. We'll use the same technique we used for the checked item, but instead of using the `:checked` pseudo-class, we'll use `:focus`, and provide an outline for it.

```css
fieldset input:focus + label {
  outline: 1px dotted #fff;
}
```

This benefits mostly Opera, since it's the only browser that allows you to reach each option using Tab, and select it by pressing the Enter or Space keys. Other browsers jump to the next fieldset when pressing Tab.

Every browser, except Chrome, will also focus the label when clicking it. Chrome will only focus it when reached by keyboard.

## Checkbox

*Update: This approach has been removed from the latest version of the toggle switches, because of accessibility issues.*

My next approach was using a checkbox, instead of radio input. This means we can simplify the markup a bit, since we don't have multiple input elements, like in the radio version.

```html
<label>
  View:
  <input type="checkbox" />
  <span></span>
</label>
```

Notice I'm not using the fieldset element any more, but just wrapping the input in a label, and again, than empty span.

### On/Off Labels

We can only use the main text in the label, so we have to use generated content to create the &ldquo;Week&rdquo; and &ldquo;Month&rdquo; labels.

```html
<label data-on="Week" data-off="Month">
```

To be able to easily reuse the toggle switch, you can see I'm using custom HTML5 attributes for these labels.

```css 
label:after {
  position: relative;
  width: 50%;

  content: attr(data-on) "\a" attr(data-off);
  white-space: pre;
  text-align: center;

  column-count: 2;
}
```

In the content property, I use the attr() notation to get the value of the custom `data-` attributes, and separate them using the `\a` newline character.

I'm doing that to be able to properly position them. The problem is that, because of the look of the switch, I need to use the :before pseudo-element to create the background of the switch. This leaves me with only one element for both the text labels.

So, in order to properly position them I use the CSS3 column-count property to split the `:after` element into two columns, and center each label in each of these columns.

That's where the `\a` character comes in. Using it, I'm pushing the &ldquo;Off&rdquo; label to next line, and since it's a single line, the next column.

### Accessibility

NVDA will read the label as &ldquo;View, checkbox, not checked, Week Month&rdquo;. But this is only because the latest version of NVDA(2011.2 right now) also reads generated content.
Other screen readers, and especially older versions, don't read generated content *at all*. So the &ldquo;Week&rdquo; and &ldquo;Month&rdquo; labels won't be available to screen reader users.

This is one of the main downsides of this approach.

The other downside is from a semantic point of view. Checkboxes are just not suitable for for these type of selections, but rather for on/off states.

Add these to the bigger issue, that, even if using a modern screen reader that can read generated content, the read label just doesn't make proper sense. Which one is selected? Which one is checked or unchecked?

Needless to say, these would be impossible to use using a screen-reader. Which brings me to my next approach.

## Checkbox, used properly

Since checkboxes should be used for on/off states, I'm using another one of Orman's great designs as a starting point, this [set of on/off switches](http://www.premiumpixels.com/freebies/onoff-switches-and-toggles-psd/).

### Markup

You'll notice I'm using a structure similar to the one used in the radio version, that allows for more flexibility in CSS.

```html 
<fieldset>
  <input id="wireless" type="checkbox" />
  <label for="wireless">Wireless:</label>
  <span></span>
</fieldset>
```

### Behaviour

When activated, the switch needs to move the toggle button and change the style of the rail. For this, I use the sibling selectors.

```css 
/* Move the toggle button */
input:focus ~ span {
  right: 45px;
}

/* Change the style of the rail */
input:checked + label:after {
  background-color: #a0c66b;
  border-color: #87aa5b;

  color: #60783f;
}
```

I've used the `label:after` pseudo-element to generate the rail, like in the radio version, and also included the On/Off text labels in it, since they're on the same depth.

### Accessibility

NVDA will read the switch as &ldquo;Checkbox, not checked. Wireless. Off, On&rdquo;. Once reached, it can be controlled (checked/unchecked) using the Space or Enter key.

Even if you're using a screen-reader that doesn't read generated content, the switch still makes sense, because it will read the checkbox as &ldquo;checked&rdquo; or &ldquo;unchecked&rdquo;.

It's usable, but it would be ideal if we could place the label before the input, so that the screen-reader will read it before reaching the checkbox.
But we can't change the order of the elements, since we need to reach the `label` and `span` elements using the `+` and '~' sibling selectors.

Still, it's not an absolute must, since many form layouts place the checkbox before the label, and people are probably used to it.

## Internet Explorer

The switches work right, without transitions, in IE9. But, as usual, IE8 and bellow will need special treatment. There's two ways you can deal with this.

Either use conditional comments, or classes created with conditional comments, to make the input visible again, and provide standard form controls.

Or, since we don't really have nothing specific to feature-detect, wrap the switch-specific code in a plain `@media all` media query.
This will make sure [browsers that support media queries](http://caniuse.com/#feat=css-mediaqueries) get the proper switch, while browser that don't, such as IE8 and bellow or older mobile browsers, get the perfectly usable, standard form controls.

## Mobile support

After some quick testing on mobile browsers (Mobile Safari, Android, S60, Opera Mobile and Mini), the only one that seem to properly support the switches is Opera Mobile.

The switches look right in all the browsers, but the toggle buttons don't move when selected, in either the radio or checkbox versions.

<p>
<del>I'm working on a solution for this, and will follow-up with a new post addressing mobile support for the switches. </del>
</p>

> I've added mobile support for the toggle switches, describing the development process in a new article: [Mobile support for the CSS toggle switches](/article/css-toggle-switches-mobile).

*Any ideas?* You can contribute to the [css-toggle-switch GitHub repository](https://github.com/ghinda/css-toggle-switch).
