
let express = require('express');
let app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


const nodemailer = require('nodemailer');
//Create Transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'danny.tamiru@gmail.com',
        pass: '[Gmail Password]'
    }
})

app.post('/', function(request, response) {
    
    message = request.body;

    if (!message.text || message.text === "") {
        response.status(500).send({error: "A message must be included"});
    }
    else if (!message.sender || !message.address) {
        response.status(500).send({error: "Request must 'sender' and 'email' attributes (even if empty)"});
    }
    else {
        sender = message.sender;
        address = message.address;
        if (sender === "") {
            sender = "[Anonymous Stakeholder]";
        }
        if (address !== "") {
            address = ' (' + address + ')';
        }

        let mailOptions = {
            from: 'danny.tamiru@gmail.com',
            to: 'dtamiru@uwaterloo.ca',
            subject: 'Website Message from ' + sender + address,
            text: 'Message Received from BinarySupport.net:\n\n\n' + sender + ' said:\n\n' + message.text,                            
        };

        transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
                console.log("An error occured while attempting to send the email ", err);
            } else {
                console.log('Email Sent');
            }
        });

        response.status(200).send("Email was sent successfully")
    }
});


app.listen(3000, function() {
	console.log("BinarySupport Contact App is now running!")
});


