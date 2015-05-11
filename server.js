'use strict';

var path = require('path');
var express = require('express');

var app = express();

app.use(express.static(path.resolve(__dirname)));

app.listen(3003);
