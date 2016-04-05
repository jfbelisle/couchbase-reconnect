## Couchbase Reconnect

This is a simple wrapper for the [couchbase](https://www.npmjs.com/package/couchbase), it provider a simple function to reconnect with couchbase.


#### APIs

* __openBucket__: will return the same object as `couchbase.cluster.openBucket` function, but the bucket will cache in memory, next time when you call `openBucket` with the same name will just return the cache object.

* __reconnectAll__: It will try to reconnect all the cached bucket. 

* __reconnect__: It will try to reconnect the single cached bucket with the given name as argument.


#### Example

When you use [express](https://www.npmjs.com/package/express) framework, you use an error handler at the end.

```JavaScript
app.use((err, req, res, next) => {
  // Handle the bucket was shutdown. And the network failure with `LCB_CNTL_DETAILED_ERRCODES` error.
  if (err) {
    if (err.message === 'cannot perform operations on a shutdown bucket' ||
      (err instanceof couchbase.Error && err.code === 16)) {
      cluster.reconnectAll();
    }
  }
  next(err);
});
```

#### T.B.D
* Add a ping function let bucket ping itself.

## LICENSE

MIT 
