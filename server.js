// server.js
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/routes');
const mongoClientWrapper = require('./dataAccess/mongoClientWrapper');
const jobs = require('./jobs/jobs');
const app = express();

// Use body-parser as middlewar so that we have JSON data available
app.use(bodyParser.json({type: 'application/json'}));

// Start listening on port 3000 to begin receiving Requests
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');

  // Initialize our MongoDB client
  mongoClientWrapper.initialize(() => {
    // Setup routes
    routes.configure(app);
    jobs.start();
  });

  // Process terminal signal event listeners
  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);

});

// Gracefully shutDown
function shutDown() {
  console.log('\nShutting Down!');

  // Stop all running jobs
  jobs.stop(() => {
    // safely clean up mongodb connection
    mongoClientWrapper.dispose(() => {
      process.exit(0);
    });

  });
  
}
