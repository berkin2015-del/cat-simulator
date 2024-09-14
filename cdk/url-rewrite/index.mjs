'use strict';

export const handler = (e, c, cb) => {
    const r = e.Records[0].cf.request;
    console.log('uri: ', r.uri);
    // it works, look for the last / from there capture *.* breaks when trailing path has ".".
    if (r.uri.match(/^.*\/(.*\..*)\.*$/)) {
        return cb(null, r);
    };
    r.uri = '/index.html'//(r.uri.endsWith('/') ? r.uri : r.uri + '/').replace(/\/$/, '\/index.html');
    console.log('new uri: ', r.uri);
    return cb(null, r)
}