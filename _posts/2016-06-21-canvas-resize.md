---
title: Downscaling large images in Canvas
layout: post
---

When resizing high resolution images in `canvas` elements, they usually end up [aliased](https://en.wikipedia.org/wiki/Jaggies).

To work around this we can use *step-down* downscaling. This means reducing the image size in steps, rather than setting the final dimensions directly.

Here’s a basic function that will half the image resolution until it's close to the right size.

<div class="editor-demo" data-html="/media/demos/canvas-resize/canvas-resize.html" data-js="/media/demos/canvas-resize/canvas-resize.js"></div>

The main downside of this approach is that the resulting image is sometimes blurry.

## pica

If you don’t want to implement the downscaling function yourself, you can use [pica](https://github.com/nodeca/pica).
