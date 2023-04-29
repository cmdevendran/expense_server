const { MongoClient } = require('mongodb');
var config = require('../../config');

// MongoClient now auto-connects so no need to store the connect()
// promise anywhere and reference it.
const client = new MongoClient(config.db);

module.exports.handler = async function () {
  const databases = await client.db('admin').command({ listDatabases: 1 });
  databases.forEach(db => {
    console.log(db.name);
    
  });
  return {
    statusCode: 200,
    databases: databases
  };
};