---
title: Mimic native browser focus styles
layout: post
---

When creating custom web components or widgets, elements receiving focus are sometimes hidden. This makes us have to simulate focus on other elements.

This is one way to mimic the default focus styles, as much as possible, in a cross-browser way.

Even with custom components, you should try to use native controls (eg. buttons) that provide their own focus styles. Most of the time you [should not mess with the browser's default focus styles](
http://www.outlinenone.com/).

## Defaults

By default, Firefox and Internet Explorer use a dark thin dotted outline on links and other elements.

Because Firefox tries to integrate with the operating system, native components like buttons provide their own styles, including focus styles, inherited from the OS.

Browsers with WebKit or Blink usually use a blue or gold glow outline. It's defined as `outline: auto` or `outline: -webkit-focus-ring-color auto 5px` in the [browser styles](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css).

## Custom focus

Our custom styles try to mimic focus on interactive controls like buttons, not on text links, so we use a `2px solid` outline for starters.

On WebKit we can use the `-webkit-focus-ring-color` keyword for the outline color.

For other browsers we can use the CSS2 `Highlight` system color. [Highlight](http://www.w3.org/TR/CSS2/ui.html) is defined as "Item(s) selected in a control" so it works for what we need. It's usually a blue-ish color, except for Opera, that uses a light gray.

WebKit browsers have `outline-style` set to `auto` by default, which looks more like a glow rather than a solid line.

Firefox and most other browsers translate `auto` to `none`. That’s why we have to use a WebKit-only media query for the outline style. To group WebKit-only properties together, we also set the WebKit specific outline color inside the media query.

The complete CSS:

```css 
.unreal-focus {
  outline-width: 2px;
  outline-style: solid;
  outline-color: Highlight;
}

/* WebKit gets its native focus styles.
 */
@media (-webkit-min-device-pixel-ratio:0) {
  .unreal-focus {
    outline-color: -webkit-focus-ring-color;
    outline-style: auto;
  }
}
```

How it looks across various browsers:

![Native and custom focus in various browsers and os's](/media/images/mimic-native-focus-screenshots.png)

