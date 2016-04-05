/*
 * couchbase-reconnect - test.js
 * Copyright(c) 2016 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

'use strict';

const should = require('should');
const couchbase = require('../');

describe('Singleton:couchbase', () => {

  it('should be a function.', () => {
    couchbase.should.be.a.Function();
    couchbase.CouchCluster.should.be.a.Function();
  });

  it('should get a CouchCluster instance.', () => {
    const c = couchbase('couchbase://127.0.0.1');
    c.should.instanceof(couchbase.CouchCluster);
  });

  describe('bucket', () => {
    const cluster = couchbase('http://127.0.0.1:8091');
    const buketName = 'test-bucket';

    it('should have property.', () => {
      cluster.should.have.property('openBucket').which.is.a.Function();
      cluster.should.have.property('buckets').which.is.a.Object();
    });

    it('should open a bucket failed.', done => {
      const bucket = cluster.openBucket('ipsum');
      cluster.once('error', (err, name) => {
        should.equal(name, 'ipsum');
        should.exists(err);
        done();
      });
    });

    it('should open a bucket.', done => {
      const bucket = cluster.openBucket('lorem');
      bucket.once('connect', done);
    });

    it('should cache the bucket.', done => {
      const bucket = cluster.buckets['lorem'];
      should.exists(bucket);
      bucket.get('1', (err) => {
        should.equal(err.code, 13); // 13 means not found.
        done();
      });
    });

    it('should cache the bucket.', done => {
      const bucket = cluster.openBucket('lorem');
      should.exists(bucket);
      bucket.get('1', (err) => {
        should.equal(err.code, 13); // 13 means not found.
        done();
      });
    });

    it('should cause error.', done => {
      const bucket = cluster.openBucket('lorem');
      bucket.disconnect();
      should.exists(bucket);
      try {
        bucket.get('1', (err) => {

        });
      } catch (err) {
        should.exists(err);
        delete cluster.buckets['lorem'];
        done();
      }
    });

    it('should reconnect.', function(done) {
      let bucket = cluster.openBucket('lorem');
      bucket.connected = false;
      should.exists(bucket);
      try {
        bucket.get('1', (err) => {

        });
      } catch (err) {
        should.exists(err);
        cluster.reconnectAll();
        bucket = cluster.openBucket('lorem');
        bucket.get('1', (err) => {
          should.exists(err);
          done();
        });
      }
    });

  });
});
