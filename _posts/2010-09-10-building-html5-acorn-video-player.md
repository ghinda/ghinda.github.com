---
title: Building the HTML5 Acorn Video Player
layout: post
categories: 
- code
- design
- accessibility
---


If you’ve been following the latest in web browsers, you’ve surely noticed the widespread support for HTML5 `<video>`, and HTML5 in general. Everybody’s doing it, Opera, Mozilla, Chrome, and even IE9.

Of course, once the majors decided on the coding specs, they couldn’t decide on the codec specs, and that’s probably not going to change. Not in the spec that is. To make sure your videos work everywhere (where `<video>` is available), you’ll have to encode in no less than 3 formats. The good guys (Opera and Mozilla) support the open-source royalty-free [Theora](http://www.theora.org/) codec, while the evil corporate monsters (Apple and Microsoft) support the patent-encumbered H.264 codec. Google supports both, as they’re both good guys supporting a lot of open-source projects, and corporate monsters.

But, the landscape is changing. Google, along with Opera, Mozilla, and others, launched the [the WebM Project](http://www.webmproject.org/) in May 2010. A WebM file consists of VP8 video and Vorbis audio streams, in a container based on a profile of Matroska.

So now, it’s all about choosing sides. And everybody seems to go with WebM, except for the usual bitten apple. You can read [more about Apple and the web on camendesign.com](http://camendesign.com/writing/not_the_web).

Media Controls
--------------
Each browser however provides its own different set of controls for the video element, from the minimal approach of Firefox and Chrome, to the more shiny controls of Opera and Safari. If we want our controls to look consistent everywhere, we’ll have to recreate these controls, and use the JavaScript Media Elements API to make them control the behavior of our media. 

This is what I set out to do with the Acorn Video Player, create a basic HTML5 video player, with less JavaScript and more CSS. My goal was to make it as ‘designer-friendly’ as possible, since I’ve heard a lot of people complaining about how difficult it was to create your own controls.

To make things even easier, both for my and the people who actually use my player, I used jQuery and packed everything up as a plugin. This way, a user could easily implement the player, and focus theming it.

Theming
-------
Since I wanted to give the most control possible to the designer, I used JavaScript only to create the markup and attach the media playback functions to the controls. The whole interface, including interface behavior, such as the disappearing volume slider, is left up to CSS. 
The Tutorial

Tutorial
--------
If you want to see how everything came together, HTML5 video, custom markup and the CSS for theming with some extra bits, you can check out [the tutorial on dev.opera.com](http://dev.opera.com/articles/view/custom-html5-video-player-with-css3-and-jquery/).

What started out more as a proof-of-concept video player ended up being a usable jQuery Plugin. 

Open Source
-----------
I’m constantly trying to improve it and looking for suggestions, so feel free to [contact me](mailto:contact@ghinda.net), or report issues on [its GitHub repository](https://github.com/ghinda/acornmediaplayer/).

Check out the [project page for the open-source Acorn Media Player](http://ghinda.net/acornmediaplayer/).