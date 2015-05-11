require.config({
	paths: {
		domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
		scratchcard: '/dist/scratchcard-standalone.min'
	}
});

require(['scratchcard', 'domReady!'], function init(Scratchcard) {
	'use strict';

	var element = document.getElementById('test');

	var painter = new Scratchcard.Painter({color: '#afc928'});

	painter.reset = function reset(ctx, width, height) {
		ctx.fillStyle = this.options.color;
		ctx.globalCompositeOperation = 'source-over';

		ctx.fillRect(0, 0, width, height);

		ctx.font = '50px Courier';
		ctx.fillStyle = '#000000';
		ctx.fillText('Hello World!', 100, 100);
	};

	var scratchcard = window.scratchcard = new Scratchcard(element, {
		realtime: false,
		painter: painter
	});

	window.painter = scratchcard.getPainter();

	scratchcard.on('progress', function onProgress(progress) {
		// console.log('Progress:', progress);
		if ((progress > 0.7) && (progress < 1)) {
			scratchcard.complete();
		}
	});
});
