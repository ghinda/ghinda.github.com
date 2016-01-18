// insert strings into DOM
var htmlContent = ''
htmlContent += '<script src="https://code.jquery.com/jquery-2.2.0.js"><\/script>'
htmlContent += '<script>$(document.body).append("<p>jQuery is loaded.</p>")<\/script>'

var $container = document.querySelector('.container')
$container.innerHTML = htmlContent
runScripts($container)

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
