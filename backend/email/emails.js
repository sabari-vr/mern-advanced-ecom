import nodemailer from "nodemailer";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  ORDER_SUCCESS_EMAIL_TEMPLATE,
  ORDER_CANCELED_EMAIL_TEMPLATE,
  ORDER_STATUS_CHANGED_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: VERIFICATION_EMAIL_TEMPLATE(verificationToken),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome",
      html: WELCOME_EMAIL_TEMPLATE(name),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Forgot Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE(resetURL),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};

export const sendResetSuccessEmail = async (email, resetURL) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE(resetURL),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};

export const sendOrderSuccessEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Placed Successfully",
      html: ORDER_SUCCESS_EMAIL_TEMPLATE(),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};

export const sendOrderCancelEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Canceled Successfully",
      html: ORDER_CANCELED_EMAIL_TEMPLATE(),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};

export const sendOrderStatusChangeEmail = async (email, status) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order ${status} Successfully`,
      html: ORDER_STATUS_CHANGED_EMAIL_TEMPLATE(status),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};

export const sendCartHasProductEmail = async (email, resetURL) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🛒 Your cart is waiting for you!!! 🛒",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE(resetURL),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};
