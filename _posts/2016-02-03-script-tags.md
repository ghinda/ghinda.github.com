---
title: Run script tags in innerHTML content
layout: post
---

When inserting HTML content in the DOM using innerHTML, `script` tags inside it will not load or run. This applies to both inline scripts and external ones using the `src` attribute.

## `document.write`

One way to load the scripts is to use `document.write`. The problem with it is that Internet Explorer 9 does not respect execution order. Script tags will load and execute in a random order on it.

If you're writing to an iframe, you can use set the `src` attribute to `javascript: '<script>...<\/script>'`. This will work even in Internet Explorer 9 with the correct execution order.

## `eval`

Another way is to load the external scripts using `XMLHttpRequest`, and run both inline and external ones with `eval`. One major drawback of this approach is that the same-origin policy restricts requests to other domains. `eval` also brings in a series of security issues.

## `document.createElement`

The other solution is to re-create and re-insert each script tag into the DOM using `document.createElement`. This doesn't handle execution order by itself, but we can insert the tags sequentially.

### `type` attribute

Following the [HTML spec for script tags](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element), browsers execute only script tags with no `type` attribute, or with a valid [JavaScript MIME type](https://html.spec.whatwg.org/multipage/scripting.html#javascript-mime-type).

Some JavaScript libraries use inline script tags with custom types for precompiled code. For example, Babel's (`5.x`) browser build can compile code from script tags with a `text/babel` type.

To match the browser behavior we must run only tags with an omitted or valid `type` attribute.

### DOMContentLoaded

Browsers fire the [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded) event when the document is loaded and parsed. This includes having loaded and ran all script tags.

Because some of the scripts we run could rely on the event, we must trigger the event manually after all tags load.

For Internet Explorer 9 support we use [createEvent](https://developer.mozilla.org/en-US/docs/Web/API/Document/createEvent), instead of the `Event` constructor.

```javascript
// trigger DOMContentLoaded
function scriptsDone () {
  var DOMContentLoadedEvent = document.createEvent('Event')
  DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true)
  document.dispatchEvent(DOMContentLoadedEvent)
}
```

### Execution order

To preserve execution order we need to insert each script tag after the previous one has finished loading.

We also need to trigger `DOMContentLoaded` after all scripts are loaded.

For this we use a small helper function.

```javascript
// runs an array of async functions in sequential order
function seq (arr, callback, index) {
  // first call, without an index
  if (typeof index === 'undefined') {
    index = 0
  }

  arr[index](function () {
    index++
    if (index === arr.length) {
      callback()
    } else {
      seq(arr, callback, index)
    }
  })
}
```

This runs an array of async functions, moving to the next one when the previous reaches the callback.

When it's all done it runs the main `callback` function.

### Script running

Putting it all together, here's the script running code:

```javascript
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

// https://html.spec.whatwg.org/multipage/scripting.html
var runScriptTypes = [
  'application/javascript',
  'application/ecmascript',
  'application/x-ecmascript',
  'application/x-javascript',
  'text/ecmascript',
  'text/javascript',
  'text/javascript1.0',
  'text/javascript1.1',
  'text/javascript1.2',
  'text/javascript1.3',
  'text/javascript1.4',
  'text/javascript1.5',
  'text/jscript',
  'text/livescript',
  'text/x-ecmascript',
  'text/x-javascript'
]

function runScripts ($container) {
  // get scripts tags from a node
  var $scripts = $container.querySelectorAll('script')
  var runList = []
  var typeAttr

  [].forEach.call($scripts, function ($script) {
    typeAttr = $script.getAttribute('type')

    // only run script tags without the type attribute
    // or with a javascript mime attribute value
    if (!typeAttr || runScriptTypes.indexOf(typeAttr) !== -1) {
      runList.push(function (callback) {
        insertScript($script, callback)
      })
    }
  })

  // insert the script tags sequentially
  // to preserve execution order
  seq(runList, scriptsDone)
}
```

It's possible that some some external scripts will not load, so we also handle the `onerror` listener.

Here's a demo of how it works:

<div class="editor-demo" data-html="/media/demos/script-tags/script-tags.html" data-js="/media/demos/script-tags/script-tags.js"></div>

