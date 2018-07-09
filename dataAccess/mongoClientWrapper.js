// mongoClientWrapper.js
const mongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

let config = dotenv.config().parsed;
let db = null;
let dbConnectionString = config.MONGODB_CONNECTION_STRING;
let dbName = 'coin-sms-alert';
let connectedClient = null;

// Connect to our MongoDB and make the client available
exports.initialize = (done) => {
  if (db) return process.nextTick(done);

  console.log(`Connecting to mongo DB ${dbConnectionString}`);

  mongoClient.connect(dbConnectionString, (err, connectedDb) => {
    if (err) {
      console.log('Couldn\'t connect to mongo database', err);
      return done(err);
    }

    db = connectedDb.db(dbName);
    connectedClient = connectedDb;
    return done();
  });
};

// Close our MongoDB connection for shutdown
exports.dispose = (done) => {
  if (db) {
    console.log(`Closing connection to mongo database: ${dbConnectionString}`);
    db = null;

    connectedClient.close((err, result) => {
      if (err) {
        console.log(`Error closing connection to mongo db: ${dbConnectionString}`);
        return done(err);
      }
      console.log('Database connection closed');
      return done();
    });
  } else {
    return process.nextTick(done);
  }
};

exports.getDb = () => {
  return db;
};

exports.alarms = () => {
  return db.collection('alarms');
};

exports.agendaJobs = () => {
  return db.collection('agendaJobs');
};
