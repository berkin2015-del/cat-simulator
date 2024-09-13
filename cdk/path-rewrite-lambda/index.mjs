//https://stackoverflow.com/questions/57960849/regex-to-match-a-url-with-no-file-extension
'use strict';

export const handler = (event, context, callback) => {
    let request = event.Records[0].cf.request;
    let olduri = request.uri;
    console.log("Old URI: " + olduri);
    if (/(?:\/|^)[^.\/]+$/.test(olduri)) {
        request.uri = '/index.html'
    };
    console.log("New URI: " + request.uri);
    return callback(null, request);
};