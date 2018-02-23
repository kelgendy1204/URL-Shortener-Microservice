
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const app = express();
const callDb = require('./db');
const validUrl = require('valid-url');

app.get('/:id', (req, res) => {
    const _id = req.params.id;
    callDb(function(db) {
        const collection = db.collection('urls');
        return collection.findOne({
            _id: new ObjectID(_id)
        }).then(data => {
            if (data) {
                res.writeHead(302, {
                    'Location': data.url
                });
                res.end();
            }
            res.end('no such link');
            return data;
        }).catch(err => {
            res.json({ err });
        });
    });
});

app.get('/new/*', (req, res) => {
    const url = req.params[0];
    if (!validUrl.isUri(url)){
        throw 'Not a valid url';
    }
    callDb(function (db) {
        const collection = db.collection('urls');
        const operation = collection.findOne({
            url: {
                $eq: url
            }
        }).then(data => {
            if (!data) {
                return collection.insertOne({
                    url: url
                })
                    .then(function (result) {
                        res.json({
                            original_url: url,
                            'short_url': `${req.headers.host}/${result.ops[0]._id}`
                        });
                        return result;
                    }).catch(err => {
                        res.json(err);
                    });
            } else {
                res.json({
                    original_url: url,
                    short_url: `${req.headers.host}/${data._id}`
                });
                return data;
            }
        }).catch(err => {
            res.json(err);
            return err;
        });
        return operation;
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!')); // eslint-disable-line