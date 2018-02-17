const MongoClient = require('mongodb').MongoClient;
const dbUrl = `mongodb://${process.env.dbuser}:${process.env.dbpassword}@${process.env.dburl}`;

module.exports = function (callback) {
    MongoClient.connect(dbUrl, function (err, client) {
        if (err) return console.log(err); //eslint-disable-line
        const db = client.db(process.env.dbName);
        callback(db);
        client.close();
    });
};
