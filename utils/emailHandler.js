


const nodemailer = require('nodemailer');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const EmailAuth = require('../models/emailAuth');
const crypto = require('crypto');

async function sendEmail(emailAuth, toEmail, subject, text) {
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
            text
        };

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return reject(new Error('Failed to send email: ' + error.message));
                }
                resolve({ success: true, info });
            });
        });
    } catch (error) {
        console.error('Error sending email:', error.message);
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



module.exports = { sendEmail, findEmail, verifyEmail };
