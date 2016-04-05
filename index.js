/*
 * couchbase-reconnect - index.js
 * Copyright(c) 2016 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

'use strict';

const debug = require('debug')('couchbase:reconnect');
const assert = require('assert');
const Couchbase = require('couchbase');
const EventEmitter = require('events');

let cluster = null;

function couchbase(options) {

  if (cluster) return cluster;

  return cluster = new CouchCluster(options);
}

class CouchCluster extends EventEmitter {

  constructor(cnstr, options) {
    super();
    this.buckets = {};
    this.cluster = new Couchbase.Cluster(cnstr, options);
  }

  openBucket(name, pass) {
    assert(name);
    if (this.buckets[name]) return this.buckets[name];

    return this._openBuket.apply(this, arguments);
  }

  reconnectAll() {
    for (let i in this.buckets) {
      debug('reconnect bucket %s', i);
      this.reconnect(i);
    }
  }

  reconnect(name) {
    this.buckets[name].connected = true;
  }

  _openBuket(name, pass) {
    debug('connecting to bucket %s', name);
    this.buckets[name] = this.cluster.openBucket(name, pass);
    this.buckets[name].on('connect', () => {
      debug('connected to bucket %s', name);
      this.emit('connect');
    });
    this.buckets[name].on('error', this._onError.bind(this, name));
    return this.buckets[name];
  }

  _onError(name, err) {
    debug('connect failed to bucket %s', name);
    delete this.buckets[name];
    this.emit('error', err, name);
  }

}

couchbase.CouchCluster = CouchCluster;
couchbase.Error = Couchbase.Error;

module.exports = couchbase;
