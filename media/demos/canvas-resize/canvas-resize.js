/* resize images in canvas, in steps.
 */

var $direct = document.querySelector('#direct-resize')
var $step = document.querySelector('#step-resize')
var $img = document.querySelector('img')

function downstep (image, size, callback) {
    var scale = 2
    var img = new Image()
    img.src = image.src

    img.addEventListener('load', function () {
      while (img.width / scale > size) {
        var c = document.createElement('canvas')
        var ctx = c.getContext('2d')

        img.width = img.width / scale
        img.height = img.height / scale

        c.width = img.width
        c.height = img.height

        ctx.drawImage(img, 0, 0, c.width, c.height)

        img.src = c.toDataURL('image/png')
      }

      callback(img)
    })
}

$img.addEventListener('load', function () {
  // direct canvas resize
  $direct.getContext('2d').drawImage($img, 0, 0, 200, 133)

  // down-step canvas resize
  downstep($img, 200, function (img) {
    $step.getContext('2d').drawImage(img, 0, 0, 200, 133)
  })
})
