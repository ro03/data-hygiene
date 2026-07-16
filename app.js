const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false
});

// 1. Open the form when someone types a command (e.g., /send-update)
app.command('/send-update', async ({ command, ack, client }) => {
  await ack();

  await client.views.open({
    trigger_id: command.trigger_id,
    view: {
      type: "modal",
      callback_id: "message_form_submission",
      title: {
        type: "plain_text",
        text: "Send Message"
      },
      submit: {
        type: "plain_text",
        text: "Send"
      },
      close: {
        type: "plain_text",
        text: "Cancel"
      },
      blocks: [
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
        {
          type: "input",
          block_id: "intro_message_block",
          optional: true,
          label: {
            type: "plain_text",
            text: "Introductory Message (use [firstName])(optional)"
          },
          element: {
            type: "plain_text_input",
            action_id: "intro_message_input",
            multiline: true
          }
        }
      ]
    }
  });
});

// 2. Handle the form submission to get the uploaded file and message text
app.view('message_form_submission', async ({ ack, body, view, client }) => {
  await ack();

  // Extract values from the submitted form state
  const values = view.state.values;
  
  // Get the introductory message text
  let introText = values.intro_message_block.intro_message_input.value || "";
  
  // Get the uploaded file array (if the user uploaded one)
  const uploadedFiles = values.image_upload_block.image_file_input.files;
  let fileId = null;
  
  if (uploadedFiles && uploadedFiles.length > 0) {
    fileId = uploadedFiles[0].id; // Slack stores the file and gives you its internal ID
  }

  // Replace [firstName] with the recipient's actual first name (Example logic)
  const recipientName = "Alex"; // You would dynamically fetch this via client.users.info
  introText = introText.replace(/\[firstName\]/g, recipientName);

  console.log("Message to send:", introText);
  console.log("Uploaded Slack File ID:", fileId);

  // TODO: Use client.chat.postMessage or client.files.share to send the message & image to your target users!
});

(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Bolt app is running on port ${port}!`);
})();
