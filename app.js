require('dotenv').config();

const express = require('express');
const app = express();
const callDb = require('./db');

app.get('/:id', (req, res) => {
    const id = req.params.url;
    callDb(function(db) {
        const collection = db.collection('urls');
        collection.findOne({
            id: {
                $eq: id
            }
        }).then(data => {
            res.json({ data });
        }).catch(err => {
            res.json({ err });
        });
    });
});

app.get('/new/:url', (req, res) => {
    const url = req.params.url;
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
            }
            res.json(data);
            return data;
        }).catch(err => {
            res.json(err);
            return err;
        });
        return operation;
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!')); // eslint-disable-line