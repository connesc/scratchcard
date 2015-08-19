require.config({
	paths: {
		domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
		scratchcard: '../dist/scratchcard-standalone.min'
	}
});

require(['scratchcard', 'domReady!'], function init(Scratchcard) {
	'use strict';

	// Retrieve the target element
	var element = document.getElementById('test');

	// Build the painter
	var painter = new Scratchcard.Painter({color: '#afc928'});

	painter.reset = function reset(ctx, width, height) {
		ctx.fillStyle = this.options.color;
		ctx.globalCompositeOperation = 'source-over';

		ctx.fillRect(0, 0, width, height);

		ctx.font = '2rem Courier';
		ctx.fillStyle = '#000000';
		ctx.fillText('Hello World!', 50, 100);
	};

	// Build the scratchcard
	var scratchcard;
	try {
		scratchcard = new Scratchcard(element, {
			realtime: false,
			painter: painter
		});
	} catch (error) {
		alert(error);
		throw error;
	}

	// Listen for progress events
	scratchcard.on('progress', function onProgress(progress) {
		// console.log('Progress:', progress);
		if ((progress > 0.7) && (progress < 1)) {
			scratchcard.complete();
		}
	});

	// Expose the scratchcard instance for debug/tests
	window.scratchcard = scratchcard;
});
