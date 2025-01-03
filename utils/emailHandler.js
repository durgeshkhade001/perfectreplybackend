const nodemailer = require('nodemailer');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const EmailAuth = require('../models/emailAuth');
const EmailChat = require('../models/emailChat');
const crypto = require('crypto');
const { title } = require('process');



const convertEmailToJson = (email) => {

    const messageId = email.messageId;
    const inReplyTo = email.inReplyTo;
    const emailFrom = email.from.text;
    const emailText = email.text;
    const datetime = email.date;

    const regex1 = /^On [a-zA-Z]{3}, \d{1,2} [a-zA-Z]{3} \d{4} at \d{1,2}:\d{2}/;
    const lines = emailText.split("\n");

    actualMessage = "";
    prevMessageThread = "";

    for (let i = 0; i < lines.length; i++) {
        if (regex1.test(lines[i])) {
            prevMessageThread = lines.slice(i).join("\n");
            break;
        }
        actualMessage += lines[i] + "\n";
    }

    actualMessage = actualMessage.trim();
    prevMessageThread = prevMessageThread.trim();

    return { 
        message: actualMessage, 
        datetime, 
        previousMessageThread: prevMessageThread, 
        from: emailFrom,
        messageId,
        inReplyTo,
        type: 'ContactReply'
    };
};




async function sendEmail(emailAuth, toEmail, subject, text, replyToEmailChatId) {
    let lastEmail = null;
    let emailChat = null;
    if(replyToEmailChatId) {
        emailChat = await EmailChat.findById(replyToEmailChatId);
        if(!emailChat) return { error: 'Email chat not found' };

        toEmail = emailChat.customerEmail;
        toEmail = toEmail.match(/<(.+)>/)[1];

        for(let i = emailChat.thread.length - 1; i >= 0; i--) {
            if(emailChat.thread[i].type === 'ContactReply') {
                lastEmail = emailChat.thread[i];
                break;
            }
        }
    }
    try {
        const transporter = nodemailer.createTransport({
            service: emailAuth.service,
            auth: {
                user: emailAuth.email,
                pass: emailAuth.password
            }
        });

        const mailOptions = {
            from: emailAuth.email,
            to: toEmail,
            subject,
            text,
        };

        if(replyToEmailChatId && lastEmail) {
            mailOptions.headers = {
                'In-Reply-To': lastEmail.messageId,
                'References': lastEmail.messageId
            };
            mailOptions.subject = `Re: ${emailChat.title}`;
        }

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return reject(new Error('Failed to send email: ' + error.message));
                }
                if(replyToEmailChatId && lastEmail) {
                    const sentMail = {
                        messageId: info.messageId,
                        datetime: new Date(),
                        message: text,
                        from: emailAuth.email,
                        type: 'AgentReply',
                        inReplyTo: lastEmail.messageId
                    };
                    emailChat.thread.push(sentMail);
                    emailChat.markModified('thread');
                    emailChat.save();
                }
                resolve({ success: true, info });
            });
        });
    } catch (error) {
        console.error('Error sending email:', error.message);
        return { error: error.message };
    }
}


async function switchEmailIsListening(emailAuth, status) {
    try {
        emailAuth.isListening = status;
        await emailAuth.save();
        return { success: true, message: 'Email isListening status updated' };
    } catch (error) {
        return { error: error.message };
    }
}




async function findEmail(emailAuth, searchCriteria) {
    return new Promise((resolve, reject) => {
        const imap = new Imap({
            user: emailAuth.email,
            password: emailAuth.password,
            host: emailAuth.imaphost,
            port: emailAuth.imapport,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }
        });

        imap.once('ready', () => {
            imap.openBox('INBOX', true, (error, box) => {
                if (error) {
                    imap.end();
                    // console.error('Failed to open INBOX:', error.message);
                    return reject(new Error('Failed to open INBOX: ' + error.message));
                }

                imap.search(searchCriteria, (error, results) => {
                    if (error) {
                        imap.end();
                        // console.error('Failed to search emails:', error.message);
                        return reject(new Error('Failed to search emails: ' + error.message));
                    }

                    if (results.length === 0) {
                        imap.end();
                        // console.log('No emails found');
                        return reject(new Error('No emails found'));
                    }

                    const f = imap.fetch(results, { bodies: '' });
                    f.on('message', (msg) => {
                        msg.on('body', (stream) => {
                            simpleParser(stream, async (error, mail) => {
                                if (error) {
                                    imap.end();
                                    // console.error('Failed to parse email:', error.message);
                                    return reject(new Error('Failed to parse email: ' + error.message));
                                }

                                if (mail.text.includes(searchCriteria[2][1])) {
                                    imap.end();
                                    // console.log('Email found');
                                    return resolve(mail);
                                }
                            });
                        });
                    });

                    f.once('end', () => {
                        imap.end();
                    });
                });
            });
        });

        imap.once('error', (error) => {
            imap.end();
            // console.error('IMAP error:', error.message);
            reject(new Error('IMAP error: ' + error.message));
        });

        imap.once('end', () => {
            // console.log('Connection ended');
        });

        imap.connect();
    });
}



function listenToEmailInfinite(emailAuth) {

    lastEmailUID = null;

    const imap = new Imap({
        user: emailAuth.email,
        password: emailAuth.password,
        host: emailAuth.imaphost,
        port: emailAuth.imapport,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    });

    function openInbox(cb) {
        imap.openBox('INBOX', false, cb);
    }

    function getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    function processMessage(msg) {
        let email = '';
        msg.on('body', (stream) => {
            stream.on('data', (chunk) => {
                email += chunk.toString('utf8');
            });
        });

        msg.once('end', () => {
            simpleParser(email, async (err, parsed) => {
                if (err) {
                    console.error('Failed to parse email:', err);
                    return;
                }
                // console.log("=".repeat(30) + lastEmailUID);
                // console.log('New email received:');
                // console.log('From:', parsed.from.text);
                // console.log('Subject:', parsed.subject);
                // console.log('Text:', parsed.text);
                // console.log('='.repeat(30) + '\n\n');
                // console.log(parsed);

                const emailChatNewMessage = convertEmailToJson(parsed);
                const title = parsed.subject.split('Re: ')[1] || parsed.subject;
                const emailChat = await EmailChat.findOne({ customerEmail: parsed.from.text, title });
                if (!emailChat) {
                    const newEmailChat = new EmailChat({
                        customerEmail: parsed.from.text,
                        messageId: parsed.messageId,
                        title,
                        thread: [emailChatNewMessage]
                    });
                    await newEmailChat.save();
                } else {
                    const messageExists = emailChat.thread.some(message => message.messageId === emailChatNewMessage.messageId);
                    if (!messageExists) {
                        emailChat.thread.push(emailChatNewMessage);
                        emailChat.markModified('thread');
                        await emailChat.save();
                    }
                }
            });
        });
    }

    function checkNewEmails() {
        const today = getTodayDate();
        
        const searchCriteria = lastEmailUID
            ? [['UID', `${lastEmailUID + 1}:*`]]
            : ['UNSEEN', ['SINCE', today]];

        imap.search(searchCriteria, (err, results) => {
            if (err) {
                console.error('Search error:', err);
                return;
            }
            if (results.length > 0) {
                const newEmailUIDs = lastEmailUID
                    ? results.filter(uid => uid > lastEmailUID)
                    : results;

                if (newEmailUIDs.length > 0) {
                    lastEmailUID = Math.max(...newEmailUIDs);
                    const fetch = imap.fetch(newEmailUIDs, { bodies: '' });
                    fetch.on('message', processMessage);
                    fetch.once('error', (err) => {
                        console.error('Fetch error:', err);
                    });
                    fetch.once('end', () => {
                        // console.log('Finished fetching new messages');
                    });
                } else {
                    // console.log('No new emails');
                }
            } else {
                // console.log('No new emails');
            }
        });
    }

    imap.once('ready', async () => {
        
        try { await switchEmailIsListening(emailAuth, true);
        } catch (error) { console.error('Failed to update emailAuth isListening:', error.message); }

        openInbox(async (err) => {
            if (err) {
                console.error('Failed to open inbox:', err);

                try { await switchEmailIsListening(emailAuth, false);
                } catch (error) { console.error('Failed to update emailAuth isListening:', error.message); }

                return;
            }
            // console.log('Connected to inbox, listening for new emails...');
            checkNewEmails();
            setInterval(checkNewEmails, 9000);

        });
    });

    imap.once('error', async (err) => {

        try { await switchEmailIsListening(emailAuth, false);
        } catch (error) { console.error('Failed to update emailAuth isListening:', error.message); }

        console.error('IMAP error:', err);
    });

    imap.once('end',  async () => {

        try { await switchEmailIsListening(emailAuth, false);
        } catch (error) { console.error('Failed to update emailAuth isListening:', error.message); }
        
        console.log('Connection ended');
    });

    imap.connect();
}


async function verifyEmail(emailAuth) {
    try {
        const token = crypto.randomBytes(5).toString('hex');
        const subject = 'PerfectReply Email Verification';
        const text = `Your verification token is: ${token}`;

        const result = await sendEmail(emailAuth, emailAuth.email, subject, text);
        if (result.error) throw new Error(result.error);

        const searchCriteria = ['UNSEEN', ['SINCE', new Date()], ['TEXT', token]];
        const email = await findEmail(emailAuth, searchCriteria);

        if (email) {
            listenToEmailInfinite(emailAuth);
            emailAuth.status = 'verified';
            await emailAuth.save();
            return { success: true, message: 'Email verified' };
        } else {
            return { error: 'Email verification failed' };
        }
    } catch (error) {
        return { error: error.message };
    }
}



module.exports = { sendEmail, findEmail, verifyEmail, listenToEmailInfinite };
