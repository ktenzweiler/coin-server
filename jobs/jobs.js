// jobs.js
const Agenda = require('agenda');

const db = require('../dataAccess/mongoClientWrapper');
const checkAlarmJob = require('./checkAlarmsJob');

const mongoConnectionString = `${process.env.MONGODB_CONNECTION_STRING}/${process.env.MONGODB_DATABASE}`;

let agenda = null;

exports.start = () => {
  // configure agenda
  agenda = new Agenda({
    db: {
      address: mongoConnectionString
    },
    processEvery: 'one minute'
  });

  agenda.on('ready', () => {
    // Delete the jobs collection on startup
    deleteJobsCollection(() => {

      // Setup our job with agenda
      checkAlarmJob.register(agenda);
      // Job will run every minute
      checkAlarmJob.setSchedule('one minute');

      // Start agenda
      agenda.start(() => {
        console.log('Started jobs');
      });

    });
  });

  // error event listener
  agenda.on('error', (err) => {
    console.log('Error with Agenda!', err);
  });
};

// Gracefully stop errors
exports.stop = (done) => {
  agenda.stop(() => {
    console.log('successfully shut down jobs');
    done();
  });
};

// Delete the MongoDB jobs collection
function deleteJobsCollection(done) {
  db.agendaJobs().drop(done);
}
