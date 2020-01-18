export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIN_PASS,
  },
  default: {
    from: 'Staff GoBarber <noreplay@gobarber.com>',
  },
};
// config de enviao de email mailtrap.io
