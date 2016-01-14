---
title: Material design ripples with CSS
layout: post
theme: theme-ripple
---

I recently created a Material Design theme for the [css-toggle-switch](/css-toggle-switch) library, and found a way to implement the "ripple" effect using just CSS.

Most Material Design implementations use JavaScript for the ripple effect on the input components, to be able to match the ["surface reaction"](http://www.google.ro/design/spec/animation/responsive-interaction.html#responsive-interaction-surface-reaction) in the design spec.

## Buttons

The technique is a mash of pseudo-classes that trigger an animation on a pseudo-element when matched.

<div class="editor-demo" data-html="/demos/css-material-ripples/button.html" data-css="/demos/css-material-ripples/button.css"></div>

For the `button` element, we create the ripple using `button:after`. Then, to trigger the animation on it, we use `button:not(:active):after`.

{% highlight css %}
button:not(:active):after {
  animation: ripple 1s;
}
{% endhighlight %}

We can't trigger the animation on `:active` because that would cause the animation to abruptly end when we stop clicking.

Setting the animation with the `:not(:active)` selector helps with triggering it again after the button was clicked, when the `:active` pseudo-class no longer matches. This also makes the animation re-play when clicking the button again.

Since the `:not(:active)` selector matches from the start, the animation runs once when the page loads, without any user input.

To fix this, we hide the ripple, and show it only when the button is focused.

{% highlight css %}
button:after {
  visibility: hidden;
}

button:focus:after {
  visibility: visible;
}
{% endhighlight %}

## Checkboxes and radios

Same as for `button`, we implement the ripple for checkboxes and radios using pseudo-classes, but instead of using `:active` we use `:checked`.

<div class="editor-demo" data-html="/demos/css-material-ripples/toggle.html" data-css="/demos/css-material-ripples/toggle.css"></div>

Since radios and checkboxes can use similar markup, we can implement the ripple using a single class on a parent container.

{% highlight html %}
<div class="toggle">
  <input type="checkbox" name="c" id="c1">
  <label for="c1">Checkbox</label>
</div>

<div class="toggle">
  <input type="radio" name="r" id="r1" checked>
  <label for="r1">Radio</label>
</div>
{% endhighlight %}

We create the ripple on the `label:after` pseudo-element.

To trigger the animation when deselecting the checkbox, we use the `.toggle input + label:after` selector.

{% highlight css %}
.toggle input + label:after {
  animation: ripple .4s ease-out;
}
{% endhighlight %}

To re-play the animation when selecting the checkbox, or when selecting a radio button, we need to duplicate the `@keyframes`, and change the animation name.

{% highlight css %}
.toggle input:checked + label:after {
  animation-name: rippleDuplicate;
}
{% endhighlight %}

We use the same `:focus` trick as for the button, to make sure the first animation run is not visible when the page is loaded.


## Drawbacks

The ["Responsive interaction"](http://www.google.ro/design/spec/animation/responsive-interaction.html#responsive-interaction-material-response) section of the Material design spec calls the ripple "instant visual confirmation at the point of contact".

With the CSS implementation the ripple will only show up when the input action was finished. That's because of the pseudo-classes we're using.

The other issue is that we can't position the ripple at the point of click/touch, without using JavaScript.

Another downside is that the ripple will suddenly disappear if you unfocus the button or input while the animation is running. That's because of the `:focus` trick we use to hide the first run of the animation when the page loads.

These snippets are highly experimental and will work only on modern browsers. If you need production ready toggle switches, with or without material design, you can use [css-toggle-switch](/css-toggle-switch).

