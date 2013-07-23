---
title: Community driven development
layout: post
---

Just following trends is a bad idea at any time. But this is not about following trends. This is about switching open-source development tools because of the communities around them.

What I've learned is that with free software projects, large communities are a definite sign of health and bring a lot of benefits in terms of code, documentation, testing or bug reports.

## From Brunch to Yeoman

The first decent build tool I used for my JavaScript projects was [Brunch](http://brunch.io/). It has a simple config file, clear directory structure, and it’s flexible enough. It's great. But I'm switching to Yeoman now. And here's why.

Brunch itself is written in CoffeeScript, but other than that, it's language agnostic, so it doesn't force it on you unless you want to contribute to the project directly. Still, because of this the community around it is also CoffeeScript-based, so most plugins, skeletons, and tutorials are CoffeeScript, so you can't contribute to those either, unless you write CoffeeScript.

Even after Grunt and Yeoman were released, I stuck with Brunch. But in the meantime the community around Yeoman and Grunt has gotten much bigger, and that means more plugins, generators and help available online right now.

I'm not switching from one to the other because of a lack of features, but because I would have to invest more time in the development process if I didn't. If I would stick with the project with the smaller community I'd have to be write plugins, skeletons and find documentation.

## Same thing, different tools

Around late 2009, after using Subversion for a pretty long time, I decided to move on to distributed version control.

On most projects I worked on with Svn, we used a single branch, continuously merged our code, and used tags for stable releases. It was less than optimal, and that's why I was really looking forward to the proper branching features in DVCS'.

The most popular options were, and still are, Mercurial and Git, so I had to choose between the two.

Most of the people I work with use Windows, so good support for it was a must. This was definitely a plus for Mercurial, since Git was pretty shaky on Windows at the time.

I also liked the more clean and monolithic architecture of Mercurial, instead of the more MacGyver-ish Git, which had many different ways of doing more or less the same thing.

Since I chose Hg and wanted to have my repositories available online, I started using Bitbucket.

Bitbucket was great, but it didn't have a community as large as GitHub's. This meant more people with GitHub accounts, and possibly more contributions, bug reports, and overall better visibility for a public project there, rather than on Bitbucket.

That's why, when I released [Acorn Media Player](https://github.com/ghinda/acornmediaplayer), I hosted it on GitHub. There haven't been that many contributions over time, but I'm sure there were more then there would have been if the repository would be on Bitbucket.

At work I was still using Svn, but planned on moving to Hg, as I decided initially. I looked around for a web interface for Hg initially, like Bitbucket and Github, but open-source and self-hosted.

Browsing around, I found RhodeCode and Gitlab. After I tested them both, it was clear that Gitlab was better for us, and just as with Github/Bitbucket, it had a larger community than RhodeCode and a faster development pace.

This, along with GitHub’s popularity and the larger community around Git, which also meant more help available online, made me switch completely to Git for all my projects.

## Competition vs. Collaboration?

Ever since I took this decisions I wonder: is this popularity contest ok? Should we try to take a different approach?

Maybe trying to improve the tool we're currently using? But, again, wouldn't this just be wasted time, if everybody else still switches to the other, more popular project, eventually?

Having a common system of plugins, packages or modules, used by multiple projects would definitely solve a part of the issue, but i'’s probably not going to happen too soon.

In an [issue on GitHub discussing the differences between Yeoman and Brunch](https://github.com/brunch/brunch/issues/408) Paul Miller, the creator of Brunch, says:

> I believe existence of Yeoman is a potentially good thing, because it brings competition to the board. Yeoman will become better, brunch will become better.

Free software should be about collaboration, but collaboration rarely happens between projects with the same scope, so we just end up creating the same functionality in different ways.

This is the same type of competition that goes on between closed-source projects. Is this better than collaboration?

