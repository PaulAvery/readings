#!/usr/bin/env node
require('source-map-support').install();

import path from 'path';
import route from 'koa-route';
import serve from 'koa-static-cache';
import Isomorphic from 'isomorphic-mithril';

import api from './api';
import views from './views';
import * as frame from './views/frame';

/* Change into another directory if provided */
if(process.argv[2]) process.chdir(process.argv[2]);

/* Set up app */
let app = new Isomorphic();
app.use(require('koa-error')());
app.use(require('koa-compress')());
app.use(require('koa-json')());
app.use(require('koa-conditional-get')());
app.use(require('koa-etag')());

/* Set up our api */
app.use(api(route('/api')));

/* Set up views */
let assets = path.join(__dirname, 'assets');
app.mount(frame, '/', views);
app.use(serve(assets, {prefix: '/assets', gzip: false}));

/* Start */
app.listen(process.env.PORT || 3000);
