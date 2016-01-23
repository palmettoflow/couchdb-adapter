'use strict';

var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();
var follow = require('follow');
var request = require('request');

var _require = require('ramda');

var curry = _require.curry;

module.exports = function (config) {
  if (!valid(config)) throw new Error('config is not valid');
  var url = [config.endpoint, config.app].join('/');
  var handleNotify = curry(notify);
  var handlePost = post;
  // subscribe
  follow({ db: url, include_docs: true, since: 'now' }, handleNotify(ee));
  // publish
  ee.on('send', function (event) {
    return request.post(url, { json: event }, handlePost);
  });
  // return emitter
  return ee;
};

function valid(obj) {
  return allPass([has('endpoint'), has('app')])(obj);
}

function notify(ee, err, chg) {
  if (err) return console.log(err);
  ee.emit(path(['doc', 'to'], chg), prop(doc));
}

function post(err, res, body) {
  if (err) return console.log(err);
}