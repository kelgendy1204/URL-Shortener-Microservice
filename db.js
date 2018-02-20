const MongoClient = require('mongodb').MongoClient;
const dbUrl = process.env.env != 'dev' ? `mongodb://${process.env.dbuser}:${process.env.dbpassword}@${process.env.dburl}` :
    process.env.localdb;

module.exports = async function (callback) {
    await MongoClient.connect(dbUrl, async function (err, client) {
        if (err) return console.log(err); //eslint-disable-line
        const db = client.db(process.env.dbname);
        try {
            await callback(db);
            client.close();
        } catch (error) {
            client.close();
        }
    });
};
