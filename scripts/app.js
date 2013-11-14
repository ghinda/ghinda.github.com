/* ghinda.net
 */

(function() {

	var $header = document.querySelector('header'),
		$nav = $header.querySelectorAll('a'),
		$bubble = $header.querySelector('.hover-bubble'),
		bubbleTop = $bubble.offsetTop,
		bubbleLeft = $bubble.offsetLeft,
		metrics = [];

	var i,
		hovers,
		$item;

	for(i = 0; i < $nav.length; i++) {
		$item = $nav[i];

		metrics[i] = {
			top: $item.offsetTop - bubbleTop,
			left: $item.offsetLeft - bubbleLeft,
			width: $item.offsetWidth,
			height: $item.offsetHeight
		}

		var mouseover = function() {
			var j = i;
			return function() {
				moveBubble(j);
			}
		}();

		$nav[i].addEventListener('mouseover', mouseover);

		$nav[i].addEventListener('mouseout', function() {
			moveBubble(0);
		});
	}

	var moveBubble = function(index) {

		if(index === 0) {
			$bubble.removeAttribute('style');
			$bubble.classList.remove('hover-bubble--nav');
			return;
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


})();
