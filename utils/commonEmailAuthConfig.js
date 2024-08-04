const e = require("express");

function getServiceConfig(serviceName) {
  switch (serviceName) {
    case "gmail":
      return {
        service: "gmail",
        imaphost: "imap.gmail.com",
        imapport: 993,
      };
    case "outlook":
      return {
        service: "outlook",
        imaphost: "outlook.office365.com",
        imapport: 993,
      };
    case "yahoo":
      return {
        service: "yahoo",
        imaphost: "imap.mail.yahoo.com",
        imapport: 993,
      };
    default:
      return {
        error: "Invalid known service name",
      };
  }
}

module.exports = {
  getServiceConfig,
};
