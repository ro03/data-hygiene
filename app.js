const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
// These are read from the environment variables you will set in Render
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // The 'process.env.PORT' is important for deploying to web hosting services
  socketMode: false, // Make sure Socket Mode is disabled for Render
  appToken: '' // Not needed for HTTP deployment
});

// This function will be triggered when a user uses the /ask slash command
app.command('/ask', async ({ command, ack, say }) => {
  // Acknowledge the command request
  await ack();

  const userQuestion = command.text;
  
  await say(`You asked: '${userQuestion}'. I'm a Node.js app running on Render! 🚀`);
});

// This function will be triggered when a user uses the /groups slash command
app.command('/groups', async ({ ack, say }) => {
  await ack();
  await say('This is where the user group creation logic will go!');
});

// This is the code that starts the web server
(async () => {
  const port = process.env.PORT || 3000;
  // Start your app
  await app.start(port);

  console.log(`⚡️ Bolt app is running on port ${port}!`);
})();