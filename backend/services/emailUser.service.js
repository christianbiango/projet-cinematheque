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
   * Cette méthode envoit un mail de demande de confirmation à l'utilisateur qui vient de demander à s'inscrire sur le site
   * @param {String} receiverUsername - Destinataire du mail
   * @param {String} receiverEmail - email de destination
   * @param {String} token - Token associé à la confirmation du compte
   */
  static async sendRegisterValidation(receiverUsername, receiverEmail, token) {
    const emailSender = env.emailSender;
    console.log(token);

    const mailOptions = {
      from: emailSender,
      to: receiverEmail,
      subject: env.registerUserEmailSubject,
      html: `Bienvenue <strong>${receiverUsername}</strong><br/><br/>Pour finaliser l'inscription, merci de <a href="http://localhost:5173/validate-email/${token._hex}">valider votre compte</a> .`,
    };

    // Envoyer le mail
    console.log(EmailAPI._transporter);
    await EmailAPI._transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email envoyé: " + info.response);
      }
    });
  }
}
