'use strict';

var options = {
	thickness: 100
};

AnimationFrame.shim();

window.Scratchcard = function Scratchcard(element) {
	var self = this;

	var canvas = document.createElement('canvas');
	if (!canvas.getContext) {
		throw new Error('Canvas not supported');
	}

	canvas.style.position = 'absolute';
	canvas.width = element.clientWidth;
	canvas.height = element.clientHeight;
	canvas.style.zIndex = 100;

	var wrapper = document.createElement('div');
	wrapper.style.position = 'relative';
	wrapper.appendChild(canvas);
	element.parentNode.insertBefore(wrapper, element);

	var ctx = null;

	var previousFingers = {};
	var currentFingers = {};

	this.getElement = function getElement() {
		return element;
	};

	this.setElement = function setElement(newElement) {
		element = newElement;
		element.parentNode.insertBefore(wrapper, element);
		reset();
	}

	this.getCanvas = function getCanvas() {
		return canvas;
	}

	reset();

	canvas.addEventListener('mousedown', onMouseDown, true);
	canvas.addEventListener('touchstart', onTouchStart, true);

	animate();

	function reset() {
		ctx = canvas.getContext('2d');

		// TODO: let the user do this
		ctx.fillStyle = 'silver';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		element.style.visibility = 'visible';
	}

	function animate() {
		requestAnimationFrame(animate);

		if (wrapper.nextSibling !== element) {
			element.parentNode.insertBefore(wrapper, element);
		}

		if ((canvas.width !== element.clientWidth) || (canvas.height !== element.clientHeight)) {
			canvas.width = element.clientWidth;
			canvas.height = element.clientHeight;
			reset();
		}

		for (var identifier in currentFingers) {
			var previousFinger = previousFingers[identifier];
			var currentFinger = currentFingers[identifier];

			if (!previousFinger) {
				drawPoint(currentFinger);
			} else if ((currentFinger.x !== previousFinger.x) || (currentFinger.y !== previousFinger.y)) {
				drawLine(previousFinger, currentFinger);
			}
		}

		previousFingers = currentFingers;
	}

	function drawPoint(point) {
		ctx.fillStyle = 'rgba(0,0,0,1)'
		ctx.globalCompositeOperation = 'destination-out';

		ctx.beginPath();
		ctx.arc(point.x, point.y, options.thickness / 2, 0, 2 * Math.PI);
		ctx.fill();
	}

	function drawLine(start, end) {
		ctx.lineWidth = options.thickness;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.stokeStyle = 'rgba(0,0,0,1)'
		ctx.globalCompositeOperation = 'destination-out';

		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
	}

	function onMouseDown(event) {
		if (event.button !== 0) {
			return;
		}

		event.preventDefault();

		// console.log('mousedown');
		var boundingRect = canvas.getBoundingClientRect();
		currentFingers = [{
			x: event.clientX - boundingRect.left,
			y: event.clientY - boundingRect.top
		}];

		document.addEventListener('mousemove', onMouseMove, true);
		document.addEventListener('mouseup', onMouseUp, true);

		canvas.removeEventListener('mousedown', onMouseDown, true);
		canvas.removeEventListener('touchstart', onTouchStart, true);
	}

	function onMouseMove(event) {
		if (event.button !== 0) {
			return;
		}

		event.preventDefault();

		// console.log('mousemove');
		var boundingRect = canvas.getBoundingClientRect();
		currentFingers = {
				mouse: {
				x: event.clientX - boundingRect.left,
				y: event.clientY - boundingRect.top
			}
		};
	}

	function onMouseUp(event) {
		if (event.button !== 0) {
			return;
		}

		event.preventDefault();

		// console.log('mouseup');
		currentFingers = {};

		document.removeEventListener('mousemove', onMouseMove, true);
		document.removeEventListener('mouseup', onMouseUp, true);

		canvas.addEventListener('mousedown', onMouseDown, true);
		canvas.addEventListener('touchstart', onTouchStart, true);
	}

	function onTouchStart(event) {
		event.preventDefault();

		// console.log('touchstart');
		currentFingers = {};
		var boundingRect = canvas.getBoundingClientRect();

		for (var index = 0, count = event.touches.length; index < count; index++) {
			var touch = event.touches[index];

			currentFingers[touch.identifier] = {
				x: touch.clientX - boundingRect.left,
				y: touch.clientY - boundingRect.top
			};
		}

		document.addEventListener('touchstart', onTouch, true);
		document.addEventListener('touchmove', onTouch, true);
		document.addEventListener('touchend', onTouch, true);

		canvas.removeEventListener('mousedown', onMouseDown, true);
		canvas.removeEventListener('touchstart', onTouchStart, true);
	}

	function onTouch(event) {
		event.preventDefault();

		// console.log(event.type);
		currentFingers = {};
		var count = event.touches.length;

		if (count > 0) {
			var boundingRect = canvas.getBoundingClientRect();

			for (var index = 0; index < count; index++) {
				var touch = event.touches[index];

				currentFingers[touch.identifier] = {
					x: touch.clientX - boundingRect.left,
					y: touch.clientY - boundingRect.top
				};
			}

		} else {
			document.removeEventListener('touchstart', onTouch, true);
			document.removeEventListener('touchmove', onTouch, true);
			document.removeEventListener('touchend', onTouch, true);

			canvas.addEventListener('mousedown', onMouseDown, true);
			canvas.addEventListener('touchstart', onTouchStart, true);
		}
	}
}
