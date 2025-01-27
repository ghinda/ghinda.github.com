---
title: Improved JavaScript debouncer
layout: post
---

Debouncer functions are used as rate limiters for functions that trigger many times in rapid succession. This is an attempt to improve the pattern by triggering the function earlier, making it seem more responsive.

To quote [css-tricks.com](https://css-tricks.com/the-difference-between-throttling-and-debouncing/):

> Debouncing enforces that a function not be called again until a certain amount of time has passed without it being called. As in "execute this function only if 100 milliseconds have passed without it being called."

## Existing approaches

Some popular implementations are [Ben Alman](http://benalman.com/projects/jquery-throttle-debounce-plugin/)’s or [Remy Sharp](https://remysharp.com/2010/07/21/throttling-function-calls)’s.

The problem with the existing approaches is that they trigger only on the trailing end. Your function will trigger when the event has stopped firing for the configured time.

For example, using a debouncer on the `keyup` event will only trigger the function once you stopped typing. It will not fire when you start typing.

![Typing in a textfield and showing the keyup debounced callback being called only when we stop typing.](/media/images/debounce-regular.gif)


## Improved debouncer

This improved debouncer triggers the first call immediately, and only debounces the next calls. It will trigger again on the trailing end only if it detects more calls.

```javascript
function debounce (fn, delay) {
  var cooldown = null
  var multiple = null

  return function () {
    var self = this
    var args = arguments

    if (cooldown) {
      multiple = true
      clearTimeout(cooldown)
    } else {
      fn.apply(self, args)
    }

    cooldown = setTimeout(function () {
      if (multiple) {
        fn.apply(self, args)
      }

      cooldown = null
      multiple = null
    }, delay)
  }
}
```

Here’s a simple demo of the debouncer in action:

<div class="editor-demo" data-html="/media/demos/improved-debouncer/improved-debouncer.html" data-js="/media/demos/improved-debouncer/improved-debouncer.js"></div>

## Performance

For performance, we could refactor the code to set the timeout only once. After testing both approaches with 10.000 debounced function calls, the difference between the version setting the timeout once and the one setting it multiple times is around ~50ms.

This is calculated using `console.time`, starting when we begin calling the functions, and ending when the last debounced function is called.

Based on these results, I would say optimizing the debouncer to only set the timeout once, thus making it more verbose, is not worth it.

Here’s the small performance test I used. Make sure you have the console open (for `console.time`).

<div class="editor-demo" data-js="/media/demos/improved-debouncer/debouncer-perf.js"></div>


## lodash

The debouncer in [lodash](https://lodash.com/docs#debounce) has a `leading` option that makes it behave like this improved debouncer, but is much more complex.
