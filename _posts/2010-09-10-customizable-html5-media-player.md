---
title: Build your own customizable HTML5 media player
layout: post
---

If you’ve been following the latest in web browser tech, you’ve surely noticed the widespread support for HTML5 `<video>` by now. Even IE9 is supporting it!

There are many advantages of having video embedded natively in the browser (covered in the article [Introduction to HTML5 video](http://dev.opera.com/articles/view/introduction-html5-video/) by Bruce Lawson), so many developers are trying to use it as soon as possible. There are a couple of barriers to this that remain, most notably the problem of which codecs are supported in each browser, with a disagreement between Opera/Firefox and IE/Safari. That might not be a problem for much longer though, with Google recently releasing the VP8 codec, and the WebM project coming into existence. Opera, Firefox, Chrome and IE9 all have support in final builds, developer builds, or at least support announced for this format, and Flash will be able to play VP8. This means that we will soon be able to create a single version of the video that will play in the `<video>` element in most browsers, and the Flash Player in those that don't support WebM natively.

The other major barrier to consider is building up a custom HTML5 `<video>` player — this is where a Flash-only solution currently has an advantage, with the powerful Flash IDE providing an easy interface with which to create a customized video player component. If we want to write a customized player for the HTML5 `<video>` element we need to code all the HTML5, CSS3, JavaScript, and any other open standards we want to use to build a player!

Tutorial
--------
I've recently wrote an article for [Dev.Opera](http://dev.opera.com/) addressing the custom media controls issue, and explaing step-by-step how you could create your own HTML5 media player "shell", using jQuery, the slider component from jQuery UI and some CSS3 wizzardry.

**Read the article on Dev.Opera, here: [Building a custom HTML5 video player with CSS3 and jQuery](http://dev.opera.com/articles/view/custom-html5-video-player-with-css3-and-jquery/).**

Open Source
-----------
What started out more as a proof-of-concept video player ended up being a usable jQuery Plugin.

Therefore, I’m constantly trying to improve it, and looking for suggestions. So feel free to [contact me](mailto:contact@ghinda.net), contribute code or report issues on the [acornmediaplayer GitHub repository](https://github.com/ghinda/acornmediaplayer/).

You can also check out the [Acorn Media Player](http://ghinda.net/acornmediaplayer/) project page for some demos and documentation on how to use the plugin.
