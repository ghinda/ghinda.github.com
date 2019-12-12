---
title: Send a JPEG Blob with AJAX on Android
layout: post
---

Having to upload a JPEG image as a raw Blob on Android 4.0+ revealed a couple of bugs.

If you have direct access to the specific JPEG image, when the image is on the same domain as the rest of your app, or you are in an environment without cross-origin restrictions, such as a PhoneGap webview, you can use the XHR2 `responseType` property to specify the format of the returned data.

[XMLHttpRequest 2 support](http://caniuse.com/#feat=xhr2) was introduced in Android 3.0.

```javascript 
var imageXhr = new XMLHttpRequest();
imageXhr.open('GET', 'path/to/image.jpg', true);
imageXhr.responseType = 'blob';
```

## Get image from `canvas`

If you have to get the image data from a `canvas`, you should be able to get the dataURL, write it to an `ArrayBuffer` and then write it to a Blob. In the near future we'll be able to use the [`toBlob()` method](https://developer.mozilla.org/en-US/docs/DOM/HTMLCanvasElement#Methods), which will return the image data as a Blob. Right now, to be "future friendly", we can detect support for `toBlob()` and use Sebastian Tschan's [canvas.toBlob() polyfill](https://github.com/blueimp/JavaScript-Canvas-to-Blob) if there's no native support for it.

Unfortunately, if you need the image data as a JPEG you'll hit an Android bug.

The `toDataURL` method allows you to specify the type of the returned `data:`, so you should be able to specify the 'image/jpeg' type, and get a JPEG image. While this works on most desktop browsers, Android always returns the image as a PNG.

Here's a simple [test for the `canvas.toDataURL('image/jpeg')` method](http://jsfiddle.net/ghinda/na86m/), demonstrating the bug. While this will work on desktop browsers, testing it on Android 3+ will always return `image/png`.

The only work-around is to use a [JavaScript JPEG Encoder](http://web.archive.org/web/20120830003356/http://www.bytestrom.eu/blog/2009/1120a_jpeg_encoder_for_javascript), and encode the raw image data yourself.

```javascript 
var encoder = new JPEGEncoder();
var imageData = encoder.encode(canvas.getContext('2d').getImageData(0, 0, canvasWidth, canvasHeight), 100);
```

You can now convert the image data to a Blob.


## Blobs

Android introduced [support for Blobs](http://caniuse.com/#feat=blobbuilder) in 3.0, using the now deprecated `BlobBuilder` interface, and has kept it the same up to the latest version (4.2 as of November 2012).

According to [chromestatus.com](https://sites.google.com/a/chromium.org/dev/developers/web-platform-status), Chrome for Android also has support only for the `BlobBuilder` interface right now.

This isn't really a problem, since we can check support for `BlobBuilder`, and create the Blob using the supported interface.

The `canvas.toBlob` polyfill adds an additional function called [`dataURLtoBlob`](https://github.com/blueimp/JavaScript-Canvas-to-Blob#api), which can convert a data url to a Blob. We can use this method on the manually-encoded JPEG image data.


## Sending the Blob with AJAX

XHR2 allows us to send additional formats with AJAX beside FormData, like Blob or ArrayBuffer. We can simply use the `send` method with our Blob as the parameter.

```javascript 
var xhr = new XMLHttpRequest();
xhr.open('POST', 'upload/binary/jpeg', true);
xhr.setRequestHeader('Content-Type', 'image/jpeg');
xhr.send(blob);
```

While the request works as expected on supporting desktop browsers, there seems to be a bug in Android that sends the request completely empty. Here's a [test for `xhr.send(blob)` using GitHub's API](http://jsfiddle.net/ghinda/fRgbf/), which sends both a Blob and an ArrayBuffer.

On supporting desktop browsers, you'll get the proper response from the API, while on Android you'll get an error for the Blob-based request, because the API request doesn't send the required parameters, sending the request without any payload.

Weirdly, the work-around is to send an `ArrayBuffer`, instead of a Blob, which will have the exact same effect. You can convert a Blob to an `ArrayBuffer` using the `FileReader` object. Check the `str2ab_blobreader` function in the example above to see how you use it exactly.


## Bug reports

I've opened bug reports for these bugs on the Android bug tracker:

* [Browser: canvas.toDataURL('image/jpeg') returns image/png](https://code.google.com/p/android/issues/detail?id=39885)
* [Browser: Trying to send a Blob with XHR2 sends the request with an empty body](https://code.google.com/p/android/issues/detail?id=39882)

And also on the [Device-Bugs issue collection](https://github.com/scottjehl/Device-Bugs):

* [canvas.toDataURL('image/jpeg') returns image/png on Android](https://github.com/scottjehl/Device-Bugs/issues/33)
* [Trying to send a Blob with XHR2 sends the request with an empty body on Android 4+](https://github.com/scottjehl/Device-Bugs/issues/34)

Please help me get the attention of the Android developers, so that they can get these bugs fixed for newer releases.
