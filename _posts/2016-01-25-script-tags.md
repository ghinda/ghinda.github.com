---
title: Run script tags in innerHTML content
layout: post
---

When inserting HTML content in the DOM using innerHTML, the `script` tags inside it will not load or run. This applies to both inline scripts and external ones using the `src` attribute.

## `document.write`

One way to load the scripts is to use `document.write`. Beside the fact that you can’t use  `document.write` most of the time, another problem is that IE9 does not respect execution order with it. Script tags will load and execute in a random order on it.

## `eval`

Another way is to load the external scripts using `XMLHttpRequest`, and run both inline and external ones with `eval`. This is not a good idea because of the security issues `eval` brings along. Also, the same-origin policy restricts requests to other domains.

## `document.createElement`

The other solution is to re-create and re-insert each script tag into the DOM using `document.createElement`. This doesn’t handle execution order by itself, but we can insert the script tags sequentially. We insert a new script tag after the previous one is loaded and executed.

{% highlight js %}
// runs array of async functions in sequential order
function seq (index, arr) {
  // if the first argument is an array,
  // start with index zero
  if (typeof index === 'object') {
    arr = index
    index = 0
  }

  arr[index](function () {
    index++
    if (index !== arr.length) {
      seq(index, arr)
    }
  })
}

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
  seq(runList)
}
{% endhighlight %}

It’s possible that some some external scripts will not load, so we also handle the `onerror` listener.

To preserve execution order we use the `seq` function. It runs array of async functions, moving to the next when the previous reaches the callback function.

Here's a demo of how it works:

<div class="editor-demo" data-html="/demos/script-tags/script-tags.html" data-js="/demos/script-tags/script-tags.js"></div>

