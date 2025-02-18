// agent.js

const ping = require('ping');
const axios = require('axios');
const schedule = require('node-schedule');

// Configuration: Update these values as needed.
const targetHost = 'www.remoting.work'; // Example target (Google's DNS)
const apiUrl = 'https://your-cloud-api-url.com/metrics'; // Update with your API endpoint URL
const worksiteId = 'africa-001'; // Unique identifier for your worksite

// Function to perform a ping test and send metrics to the Cloud API.
async function performTest() {
  try {
    // Run the ping test
    const res = await ping.promise.probe(targetHost, { timeout: 10 });
    // Build the metrics payload
    const metrics = {
      worksiteId: worksiteId,
      target: targetHost,
      timestamp: new Date().toISOString(),
      avgLatency: res.avg,   // Average latency in ms
      minLatency: res.min,
      maxLatency: res.max,
      packetLoss: res.packetLoss,
    };
    // Send the metrics via POST request to your Cloud API
    const response = await axios.post(apiUrl, metrics);
  } catch (error) {
    console.error('Error during network test or sending data:', error.message);
  }
}

// Schedule the test to run every 5 minutes (adjust as needed)
schedule.scheduleJob('*/5 * * * *', performTest);

// Optionally, run a test immediately on startup
performTest();
