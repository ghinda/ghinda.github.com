/* test debouncer function performance,
 * when setting the timeout variable once versus
 * setting it multiple times.
 */

// set the timeout var only once
function debounceTimeoutOnce (fn, delay) {
  var cooldown
  var multiple

  var timestamp
  var args
  var context

  function later () {
    if (!multiple) {
      multiple = null
      return
    }

    var last = Date.now() - timestamp

    // if the latest call was less that the wait period ago
    // then we reset the timeout to wait for the difference
    if (last < delay) {
      cooldown = setTimeout(later, delay - last)
    } else {
      fn.apply(context, args)
      cooldown = null
      multiple = null

      console.timeEnd('perf-set-once')
    }
  }

  return function () {

    // last call details
    context = this
    args = [].slice.call(arguments, 0)
    timestamp = Date.now()

    // start it if it doesn't already exist
    if (!cooldown) {
      fn.apply(context, args)
      cooldown = setTimeout(later, delay)
    } else {
      multiple = true
    }

  }
}

// set the timeout var on each trigger
function debounceTimeoutMultiple (fn, delay) {
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
        console.timeEnd('perf-set-multiple')
      }

      cooldown = null
      multiple = null
    }, delay)
  }
}

var perfOnce = debounceTimeoutOnce(function () {
  console.log(new Date())
}, 250)

var perfMultiple = debounceTimeoutMultiple(function () {
  console.log(new Date())
}, 250)

var runs = 10000

console.time('perf-set-once')
for (var i = 0; i < runs; i++) {
  perfOnce()
}

console.time('perf-set-multiple')
for (var j = 0; j < runs; j++) {
  perfMultiple()
}
