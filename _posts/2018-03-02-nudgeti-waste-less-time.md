---
title: Nudgeti - waste less time on distracting websites
layout: post
theme: theme-nudgeti
---

Newsfeed algorithms and dark interaction design patterns are designed to trap you. Companies use them to make you spend as much time as possible on their platforms. We need a way around it.

Here's what usually happens:

You want to look up a concert on Facebook, so you go to `facebook.com`. You're greeted by a photo from one of your friends and some political posts, neatly placed in the newsfeed. Keep scrolling and the next thing you know is that 20 minutes have passed. You forgot what you were looking for in the first place.

You watch a short lightning talk on YouTube. Next to the video there's a long list of recommended videos. If you didn't click on one of them, as soon as your video is over, an "Up Next" video countdown shows up. If you cancel the countdown, a grid of similar videos appears.

They're trying to get your attention by any means.

One solution is to block the websites, but this also blocks their utility aspect. You want to be able to watch some videos, see event details or send messages.

## Nudgeti

[Nudgeti](https://www.nudgeti.com/) is a browser extension that helps you snap out of the *newsfeed hypnosis*.

* When you spend more than two minutes on social sites like Facebook or Reddit, a notification will pop-up telling you how long you stayed.

* It uses one of the same attention-grabbing methods, notifications, against them.

* After two more minutes another notification will show up, again telling you the time spent. Afterwards it will leave you alone, you most probably want to be there.

* It won't interrupt you or stop you from going to any website.

<a href="{{ site.url }}/media/images/nudgeti-firefox-plasma-list.png">
  <img src="{{ site.url }}/media/images/nudgeti-firefox-plasma-list.png" alt="Nudgeti notifications in KDE Plasma">
</a>

## Notifications

Notifications are native to your operating system, thanks to Web Notifications. You can see them in the notification history.

They also work in Firefox for Android.

## Privacy

The extension does not collect any personal data or statistics.

Because it's built as a background script, it can only read tab overview details like titles or urls, but can not read tab contents (eg. your emails, facebook messages, etc.).

[See the Nudgeti website.](https://www.nudgeti.com/)

Nudgeti is free software under the GPL license. Get the source code from [github.com/ghinda/nudgeti](https://github.com/ghinda/nudgeti).
