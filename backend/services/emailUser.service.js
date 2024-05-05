import { env } from "../config/index.js";
import nodemailer from "nodemailer";

/**
 * Cette classe permet d'envoyer des emails via Nodemailer
 */
export class EmailAPI {
  /* Propriété privée {Object} : _transporter contient l'auth des mails */
  static _transporter = nodemailer.createTransport({
    service: env.emailService,
    auth: {
      user: env.emailSender,
      pass: env.emailSenderPass,
    },
  });

  /**
   * Cette méthode envoit le mail avec l'html correspondant
   * @param {String} html - Message du mail
   */
  static async _sendEmail(receiverEmail, html, subject) {
    const emailSender = env.emailSender;

    const mailOptions = {
      from: emailSender,
      to: receiverEmail,
      subject: subject,
      html: html,
    };

    // Envoyer le mail
    await EmailAPI._transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email envoyé: " + info.response);
      }
    });
  }

  /**
   * Cette méthode créer un mail de demande de confirmation à l'utilisateur qui vient de demander à s'inscrire sur le site
   * @param {String} receiverUsername - Destinataire du mail
   * @param {String} receiverEmail - email de destination
   * @param {String} token - Token associé à la confirmation du compte
   */
  static async sendRegisterValidation(receiverUsername, receiverEmail, token) {
    const html = `Bienvenue à la Cinémathèque <strong>${receiverUsername}</strong>,<br/><br/>Pour finaliser l'inscription, merci de <a href="http://localhost:5173/validate-email/${token}">valider votre compte</a> .`;

    EmailAPI._sendEmail(receiverEmail, html, env.registerUserEmailSubject);
  }

  /**
   * Cette méthode créer un mail de création de nouveau mot de passe
   * @param {String} receiverUsername
   * @param {String} receiverEmail
   * @param {String} token
   */
  static async sendPasswordRecoverLink(receiverUsername, receiverEmail, token) {
    const html = `${receiverUsername}, tu as oublié ton mot de passe ?<br/><br/>Tu peux en enregistrer un nouveau ici : <a href="http://localhost:5173/recover-password/${token}">demander un nouveau mot de passe</a> .<br/><br/>Le token est valide pendant 2H.`;

    EmailAPI._sendEmail(receiverEmail, html, env.PasswordRecoveryEmailSubject);
  }

  static async deletedAccountMail(receiverUsername, receiverEmail) {
    const html = `${receiverUsername},<br/><br/>Votre compte a bien été supprimé. Nous espérons que vous reviendrez sur la Cinémathèque.`;
    EmailAPI._sendEmail(receiverEmail, html, env.deletedAccountEmailSubject);
  }
}
