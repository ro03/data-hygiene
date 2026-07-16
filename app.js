const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,[cite: 2]
  signingSecret: process.env.SLACK_SIGNING_SECRET,[cite: 2]
  socketMode: false[cite: 2]
});

// 1. Trigger the form when a user uses the existing /ask slash command
app.command('/ask', async ({ command, ack, client }) => {
  await ack();

  await client.views.open({
    trigger_id: command.trigger_id,
    view: {
      type: "modal",
      callback_id: "message_form_submission",
      title: {
        type: "plain_text",
        text: "Create New Survey"
      },
      submit: {
        type: "plain_text",
        text: "Send Survey"
      },
      close: {
        type: "plain_text",
        text: "Close"
      },
      blocks: [
        {
          type: "input",
          block_id: "survey_title_block",
          label: {
            type: "plain_text",
            text: "Survey Title"
          },
          element: {
            type: "plain_text_input",
            action_id: "survey_title_input",
            placeholder: {
              type: "plain_text",
              text: "e.g., Q3 Engineering Feedback"
            }
          }
        },
        // NEW: Image Upload Block placed directly BEFORE the Introductory Message
        {
          type: "input",
          block_id: "image_upload_block",
          optional: true,
          label: {
            type: "plain_text",
            text: "Attach an Image (Optional)"
          },
          element: {
            type: "file_input",
            action_id: "image_file_input",
            filetypes: ["png", "jpg", "jpeg", "gif"],
            max_files: 1
          }
        },
        // EXISTING: Introductory Message Block
        {
          type: "input",
          block_id: "intro_message_block",
          optional: true,
          label: {
            type: "plain_text",
            text: "Introductory Message (use [firstName]) (optional)"
          },
          element: {
            type: "plain_text_input",
            action_id: "intro_message_input",
            multiline: true,
            placeholder: {
              type: "plain_text",
              text: "Write something"
            }
          }
        }
      ]
    }
  });
});

// 2. Handle the form submission when the user clicks "Send Survey"
app.view('message_form_submission', async ({ ack, body, view, client }) => {
  await ack();

  const values = view.state.values;
  
  // Extract form inputs
  const title = values.survey_title_block.survey_title_input.value;
  let introText = values.intro_message_block.intro_message_input.value || "";
  const uploadedFiles = values.image_upload_block.image_file_input.files;
  
  let fileId = null;
  if (uploadedFiles && uploadedFiles.length > 0) {
    fileId = uploadedFiles[0].id;
  }

  console.log("Submitted Title:", title);
  console.log("Submitted Intro Text:", introText);
  console.log("Uploaded Slack File ID:", fileId);

  // TODO: Add your logic here to send the message and shared image to users!
});

// This function will be triggered when a user uses the /groups slash command
app.command('/groups', async ({ ack, say }) => {[cite: 2]
  await ack();[cite: 2]
  await say('This is where the user group creation logic will go!');[cite: 2]
});[cite: 2]

// This is the code that starts the web server
(async () => {[cite: 2]
  const port = process.env.PORT || 3000;[cite: 2]
  await app.start(port);[cite: 2]
  console.log(`⚡️ Bolt app is running on port ${port}!`);[cite: 2]
})();[cite: 2]
