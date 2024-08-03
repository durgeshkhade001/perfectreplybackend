const generatePlainTextTranscript = (chat) => {
  return (
    "Here is the transcript of the chat:\n\n" +
    chat.thread
      .filter((message) =>
        ["AgentReply", "ContactReply"].includes(message.type)
      )
      .map((message) => {
        const sender = message.type === "AgentReply" ? "Support" : "You";
        return `${message.createdAt} - ${sender}: ${message.message}`;
      })
      .join("\n")
  );
};

const generateHTMLTranscript = (chat) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const messageRows = chat.thread
    .filter((message) => ["AgentReply", "ContactReply"].includes(message.type))
    .map((message) => {
      const sender = message.type === "AgentReply" ? "Support" : "You";
      const formattedDate = formatDate(message.createdAt);
      return `
          <div class="message ${
            message.type === "AgentReply" ? "support" : "user"
          }">
            <div class="message-header">
              <span class="sender">${sender}</span>
              <span class="time">${formattedDate}</span>
            </div>
            <div class="message-content">${message.message}</div>
          </div>
        `;
    })
    .join("");

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chat Transcript</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 30px;
          }
          h1 {
            color: #2c3e50;
            text-align: center;
          }
          .chat-id {
            color: #2c3e50;
            text-align: center;
            font-size: 1.1em;
            margin-bottom: 30px;
          }
          .message {
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 8px;
          }
          .message.support {
            background-color: #E6F3FF;
            border-left: 4px solid #0077FF;
          }
          .message.user {
            background-color: #f0f0f0;
            border-left: 4px solid #666;
          }
          .message-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 0.9em;
          }
          .sender {
            font-weight: bold;
          }
          .time {
            color: #666;
            margin-left: auto;
          }
          .message-content {
            white-space: pre-wrap;
          }

            .branding {
                text-align: center;
                margin-top: 20px;
            }

            .branding img {
                height: 24px;
            }
          @media (max-width: 600px) {
            body {
              padding: 10px;
            }
            .container {
              padding: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Chat Transcript</h1>
          <div class="chat-id">Chat ID: ${chat._id}</div>
          <div class="chat-content">
            ${messageRows}
          </div>
        </div>
        <div class="branding" >
            <a href="https://salesperfect.io/products/perfectreply" target="_blank">
                <img src="https://i.ibb.co/8rwHxWq/Powered-By-Perfect-Reply-Dark.png" >
            </a>
        </div>
      </body>
      </html>
    `;
};

module.exports = {
  generatePlainTextTranscript,
  generateHTMLTranscript,
};
