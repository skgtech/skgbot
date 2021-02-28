/**
 * @fileoverview Service responsible for sending emails.
 */

const config = require('config');
const nodemailer = require('nodemailer');

const service = (module.exports = {});

/** @type {?Object} Nodemailer transporter object */
service.transporter = null;

/**
 * Initialize the nodemailer service.
 *
 * @return {Promise<void>} A Promise.
 */
service.init = async () => {
  // create reusable transporter object using the default SMTP transport
  service.transporter = nodemailer.createTransport({
    host: config.email.smtp_host,
    port: config.email.smtp_port,
    secure: config.email.smtp_secure,
    auth: {
      user: config.email.auth_user,
      pass: config.email.auth_password,
    },
  });
};

/**
 * Send an email.
 *
 * @param {string} recipient A string of recipient[s].
 * @param {string} subject The subject of the email.
 * @param {string} body The body of the email.
 * @return {Promise<Object>} A Promise with nodemailer's response object.
 */
service.send = async (recipient, subject, body) => {
  // send mail with defined transport object
  const info = await service.transporter.sendMail({
    from: config.onboarding.mail_from, // sender address
    to: recipient, // list of receivers
    subject, // Subject line
    text: body, // plain text body
  });

  return info;
};
