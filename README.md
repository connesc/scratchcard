# Scratchcard.js

Mimic a [scratchcard](http://en.wikipedia.org/wiki/Scratchcard) with HTML5.

![Bower version](https://img.shields.io/bower/v/scratchcard.svg)
[![npm version](https://img.shields.io/npm/v/scratchcard.svg)](https://www.npmjs.com/package/scratchcard)
[![Dependencies status](https://img.shields.io/david/connesc/scratchcard.svg)](https://david-dm.org/connesc/scratchcard)
[![Dev dependencies status](https://img.shields.io/david/dev/connesc/scratchcard.svg)](https://david-dm.org/connesc/scratchcard#info=devDependencies)

## Installation

The `scratchcard` package can be installed through Bower or [npm](https://www.npmjs.com/package/scratchcard).

Alternatively, the following bundles are available in the [`dist`](https://github.com/connesc/scratchcard/tree/master/dist) directory:
 - `scratchcard[.min].js` wraps the `scratchcard` module, including its dependencies.
 - `scratchcard-standalone[.min].js` wraps the `scratchcard` module, including its dependencies **and** the [`animation-frame`](https://github.com/kof/animation-frame) shim for a maximal compatibility (see [below](#compatibility)).

## Get started

### CommonJS (Browserify)

```javascript
var Scratchcard = require('scratchcard');

var scratchcard = new Scratchcard(document.getElementById('hidden-content'));

scratchcard.on('progress', function onProgress(progress) {
    console.log('Progress: ' + Math.floor(progress * 100) + '%');
});
```

### AMD (RequireJS)

```javascript
require.config({
    paths: {
        scratchcard: 'path/to/scratchcard',
    }
});

define(['scratchcard'], function (Scratchcard) {
    var scratchcard = new Scratchcard(document.getElementById('hidden-content'));

    scratchcard.on('progress', function onProgress(progress) {
        console.log('Progress: ' + Math.floor(progress * 100) + '%');
    });
});
```

### Browser

```html
<script src="path/to/scratchcard.js"></script>
<script>
    var scratchcard = new Scratchcard(document.getElementById('hidden-content'));

    scratchcard.on('progress', function onProgress(progress) {
        console.log('Progress: ' + Math.floor(progress * 100) + '%');
    });
</script>
```

## API

TL;DR: for a working example, see the [`example`](https://github.com/connesc/scratchcard/tree/master/example) directory ([live demo](http://connesc.github.io/scratchcard/example/)).

### Scratchcard class

The `scratchcard` module exposes the `Scratchcard` class as its single entry point:
```javascript
var scratchcard = new Scratchcard(element, options);
```

The given DOM `element` is immediately covered with an HTML5 canvas, and its `visibility` is set to `visible`. In order to prevent your content from being revealed too early, ensure that the `visibility` of the DOM element is set to `hidden` by default.

The `options` parameter is optional. It can be either a raw object (see [below](#scratchcard-options)) or a [`Painter`](#painter-class) instance.

#### Scratchcard options

| Name | Type | Description | Default |
| ---- | ---- | ----------- | ------- |
| `threshold` | Integer between 0 and 255 | The minimal alpha value for considering a pixel as _revealed_. | `255` (only fully transparent pixels are considrered as _revealed_) |
| `realtime` | Boolean | Whether to report the `progress` events during the user interaction (dynamically), or only when when the user releases the scratchcard. Enabling this option may affect performances on some devices. | `false` (fastest interaction) |
| `layers` | Positive integer | The number of layers to be inserted below the scratchcard. | `0` |
| `painter` | A `Painter` instance or a raw object | The painter to be used, or a set of options to be passed to the default `Painter` constructor. | `{}` (default painter) |
| `animationFrame` | An object defining a `request` method | An alternative implementation for the native `requestAnimationFrame` API. An instance of the [`animation-frame`](https://github.com/kof/animation-frame) module fits perfectly here, but feel free to provide the implementation of your choice. | `null` (native implementation) |

#### Scratchcard methods

| Signature | Description |
| --------- | ----------- |
| `getElement` | Retrieve the attached DOM element. |
| `setElement(element)` | Attach this scratchcard to another DOM element. Pass `null` to detach this scratchcard from the DOM. |
| `getPainter` | Retrieve the current painter. |
| `setPainter(painter|options)` | Replace the current painter by the given one. If the given parameter is not a `Painter` instance, it is passed as options to the default `Painter` constructor. |
| `getWrapper` | Retrieve the wrapper element. |
| `getCanvas` | Retrieve the canvas element. |
| `reset` | Reset this scratchcard. |
| `complete` | Reveal the content of this scratchcard. |
| `getProgress` | Compute the current scratching progress. |

### Painter class

A `Painter` instance allow to control how things are drawn on the canvas element. A default implementation is accessible through `Scratchcard.Painter`:
```javascript
var painter = new Scratchcard.Painter(options);
```

You can either:
 - use the default implementation (eventually with custom options)
 - patch an instance of the default implementation (_on the fly_) to add some custom behavior
 - subclass the default implementation to define your very own drawing logic

#### Default painter options

| Name | Type | Description | Default |
| ---- | ---- | ----------- | ------- |
| `color` | Color | The inital color of the scratchcard | `'silver'` |
| `thickness` | Positive integer | The thickness of a scratching path | `50` |

#### Painter methods

| Signature | Description |
| --------- | ----------- |
| `reset(ctx, width, height)` | (Re)set the scratchcard to its initial state. |
| `drawPoint(ctx, point)` | Draw the initial point of a scratching path. |
| `drawLine(ctx, start, end)` | Draw a segment between two points of a scratching path. |
| `complete(ctx, width, height)` | Force the scrathcard to its final state. |
| `drawLayer(ctx, width, height, index)` | Draw the given layer. |

## Compatibility

Scratchcard.js is intended to work on all major browsers (desktop & mobile), except Internet Explorer prior to version 9.

However, Scratchcard.js heavily relies on the `requestAnimationFrame` API, which is [not always available](http://caniuse.com/#feat=requestanimationframe), especially on mobile browsers. Thus, although optional, using a strong shim like [`animation-frame`](https://github.com/kof/animation-frame) is recommended to reach a maximal compatibility level.

For convenience, the `scratchcard-standalone[.min].js` bundle does include the [`animation-frame`](https://github.com/kof/animation-frame) shim by default.

## Limitations

Currently, Scratchcard.js does not work as expected when attached to elements with borders and/or margins (padding is OK).

## Dependencies

Scratchcard.js depends on [`lodash.defaults`](https://lodash.com/docs#defaults).

The [`animation-frame`](https://github.com/kof/animation-frame) dependency is only used for the `scratchcard-standalone` bundle.

## Contributors

 - [Cédric Connes](https://github.com/connesc): original author
 - [Unitag](https://github.com/unitag): various contributions, especially tests

## License

[MIT](https://github.com/connesc/scratchcard/blob/master/LICENSE)
