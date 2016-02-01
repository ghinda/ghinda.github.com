---
title: Run script tags in innerHTML content
layout: post
---

When inserting HTML content in the DOM using innerHTML, the `script` tags inside it will not load or run. This applies to both inline scripts and external ones using the `src` attribute.

## `document.write`

One way to load the scripts is to use `document.write`. Beside the fact that you can’t use  `document.write` most of the time, another problem is that IE9 does not respect execution order with it. Script tags will load and execute in a random order on it.

## `eval`

Another way is to load the external scripts using `XMLHttpRequest`, and run both inline and external ones with `eval`. One major drawback of this approach is that the same-origin policy restricts requests to other domains. `eval` also brings a series of security issues.

## `document.createElement`

The other solution is to re-create and re-insert each script tag into the DOM using `document.createElement`. This doesn’t handle execution order by itself, but we can insert the script tags sequentially. We insert a new script tag after the previous one is loaded and executed.

#### `type` attribute

Following the [HTML spec for script tags](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element), browsers execute only script tags with no `type` attribute, or with a valid [JavaScript MIME type](https://html.spec.whatwg.org/multipage/scripting.html#javascript-mime-type).

Some JavaScript libraries use inline script tags with custom types for precompiled code. For example, Babel's (`5.x`) browser build can compile code from script tags with a `text/babel` type.

To match the browser behavior we must run only those tags with an omitted or valid `type` attribute.

### DOMContentLoaded

Browsers fire the [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded) event when the document is loaded and parsed. This includes having loaded and ran all script tags.

Because some of the scripts we run could rely on the event, we must trigger the event manually after all tags are loaded.

For Internet Explorer 9 support we use [createEvent](https://developer.mozilla.org/en-US/docs/Web/API/Document/createEvent), instead of the `Event` constructor.

{% highlight js %}
// trigger DOMContentLoaded
function scriptsDone () {
  var DOMContentLoadedEvent = document.createEvent('Event')
  DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true)
  document.dispatchEvent(DOMContentLoadedEvent)
}
{% endhighlight %}

### Execution order

To preserve execution order we need to insert each script tag after the previous one has finished loading.

We also need to trigger `DOMContentLoaded` after all scripts are loaded.

For this we use a small helper function.

{% highlight js %}
// runs an array of async functions in sequential order
function seq (index, arr, callback) {
  // if the first argument is an array,
  // start with index zero
  if (typeof index === 'object') {
    arr = index
    index = 0
  }

  arr[index](function () {
    index++
    if (index === arr.length) {
      callback()
    } else {
      seq(index, arr)
    }
  })
}
{% endhighlight %}

It runs an array of async functions, moving to the next one when the previous reaches the callback function.

When it's all done it runs the main `callback` function.

### Script running

Putting it all together, here's how the actual script running code looks:

{% highlight js %}
function insertScript ($script, callback) {
  var s = document.createElement('script')
  s.type = 'text/javascript'
  if ($script.src) {
    s.onload = callback
    s.onerror = callback
    s.src = $script.src
  } else {
    s.textContent = $script.innerText
  }

  // re-insert the script tag so it executes.
  document.head.appendChild(s)

  // clean-up
  $script.parentNode.removeChild($script)

  // run the callback immediately for inline scripts
  if (!$script.src) {
    callback()
  }
}

// run scripts tags from dom content
function runScripts ($container) {
  var $scripts = $container.querySelectorAll('script')
  var runList = []

  for (var i = 0; i < $scripts.length; i++) {
    runList.push((function() {
      var $script = $scripts[i]
      return function (callback) {
        insertScript.call(this, $script, callback)
      }
    })())
  }

  // insert the script tags sequentially
  // to preserve execution order
  seq(runList, scriptsDone)
}
{% endhighlight %}

It’s possible that some some external scripts will not load, so we also handle the `onerror` listener.

Here's a demo of how it works:

<div class="editor-demo" data-html="/demos/script-tags/script-tags.html" data-js="/demos/script-tags/script-tags.js"></div>

