/* improved debouncer pattern.
 * to trigger on the leading end,
 * and on the trailing end if there are multiple calls.
 */

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

var $input = document.querySelector('input')
var $log = document.querySelector('.log')

$input.onkeyup = debounce(function () {
  var now = new Date()
  $log.innerHTML = '' +
    'KeyUp ' +
    now.getMinutes() + ':' + now.getSeconds() +
    ' <br>' + $log.innerHTML
}, 250)
