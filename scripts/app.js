/* ghinda.net
*/

(function() {
  var $nav = document.querySelectorAll('.bubble-action');
  var $bubble = document.querySelector('.hover-bubble');
  var metrics = [];

  var moveBubble = function(e) {
    if(!e.target.classList.contains('bubble-action')) {
      return;
    }

    var index = [].indexOf.call($nav, e.target);

    if(index === 0) {
      $bubble.removeAttribute('style');
      $bubble.classList.remove('hover-bubble--nav');
      return;
    }

    // cache metrics
    if(!metrics[index]) {
      metrics[index] = {
        top: e.target.offsetTop - $bubble.offsetTop,
        left: e.target.offsetLeft - $bubble.offsetLeft,
        width: e.target.offsetWidth,
        height: e.target.offsetHeight
      }
    }

    var metric = metrics[index];

    var transform = 'translate3d(' + metric.left + 'px, ' + metric.top + 'px, 0)';
    $bubble.style.transform = transform;
    $bubble.style.msTransform = transform;
    $bubble.style.mozTransform = transform;
    $bubble.style.webkitTransform = transform;

    $bubble.style.width = metric.width + 'px';
    $bubble.style.height = metric.height + 'px';

    if(!$bubble.classList.contains('hover-bubble--nav')) {
      $bubble.classList.add('hover-bubble--nav');
    }
  };

  // init
  document.addEventListener('mouseover', moveBubble);
  document.addEventListener('touchstart', moveBubble);
  document.addEventListener('mouseout', function() {
    moveBubble({
      target: $nav[0]
    });
  });

  // init jotted
  var $demos = document.querySelectorAll('.editor-demo')
  for (var i = 0; i < $demos.length; i++) {
    var options = {
      files: [],
      plugins: [{
        name: 'codemirror',
        options: {
          lineWrapping: true
        }
      }]
    }

    for (var type in { html: '', css: '', js: '' }) {
      var url = $demos[i].getAttribute('data-' + type)
      if (url) {
        options.files.push({
          type: type,
          url: url
        })
      }
    }

    new Jotted($demos[i], options)
  }
})();
