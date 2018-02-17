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
        collection.findOne({
            url: {
                $eq: url
            }
        }).then(data => {
            if(!data) {
                collection.insertOne({
                    url: url
                })
                    .then(function (result) {
                        res.json({
                            original_url: url,
                            'short_url': `${req.headers.host}/${result.id}`
                        });
                    });
            }
        }).catch(err => {
            res.json({ err });
        });
    });
});


// callDb(function(db) {
//     const collection = db.collection('urls');
// });

app.listen(3000, () => console.log('Example app listening on port 3000!')); // eslint-disable-line