---
title: Make your HTML5 media player accessible
layout: post
---

In my last article regarding HTML5 media, I implemented a customizable, cross-browser video player for the `<video>` element. This is a good solution for many reasons, including accessibility - HTML5 `<video>` *can be* a lot more accessible than plugin-based alternatives, for example in terms of keyboard accessibility out of the box, and easier to customize without the need for a costly IDE.

But our work does not stop there. The solution I have built so far, like other JavaScript-based widgets, still has a number of accessibility concerns in terms of semantics and discoverability, which could be addressed using the W3C Web Accessibility Initiative's WAI-ARIA specification.

In my latest article on Dev.Opera, I'm trying to address such problems with WAI-ARIA, and add some further accessibility enhancements to the player, such as closed-captions and transcript.

I'm trying to get the best accessible keyboard navigation model possible, that's why I'm not implementing any custom keyboard shortcuts, combinations, access-keys, or the like. Instead I'm relying on well known, easy to use, tab-based navigation for the player controls. This should make it much easier, especially for people using screen-readers, to find and use the controls.

For the sliders, I'm using the ARIA slider `role`, and some further attributes to better describe the current position.

To finish up, I'm wrapping the media in a `<figure>` element, and pointing to a `<figcaption>` element inside it using `aria-describedby` to provide a better description of the media element. I'm not totally sold on this markup approach, but when browsers will expose the new HTML5 elements to screen-readers better, we probably won't need the `aria-describedby` attribute any longer.

*Read the complete article on [Dev.Opera](http://dev.opera.com/): [A more accessible HTML5 `<video>` player](https://web.archive.org/web/20200712114530/https://dev.opera.com/articles/more-accessible-html5-video-player/).*


Source
------
* [acornmediaplayer GitHub repository](https://github.com/ghinda/acornmediaplayer/)
* [Acorn Media Player project page](/acornmediaplayer/)
