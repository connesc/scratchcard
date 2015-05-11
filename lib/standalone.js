/* jshint browserify: true */

'use strict';

var util = require('util');

var AnimationFrame = require('animation-frame');

var Scratchcard = require('./scratchcard');

StandaloneScratchard.Painter = Scratchcard.Painter;

module.exports = exports = StandaloneScratchard;

function StandaloneScratchard(element, options) {
	if (!(options.animationFrame instanceof AnimationFrame)) {
		options.animationFrame = new AnimationFrame(options.animationFrame);
	}

	Scratchcard.call(this, element, options);
}

util.inherits(StandaloneScratchard, Scratchcard);
