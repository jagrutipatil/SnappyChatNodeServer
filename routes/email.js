var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'cmpe277snappychat@gmail.com', // Your email id
        pass: '21DaysToGo' // Your password
    }
});

exports.sendEmail = function (email, text , callback) {
	var mailOptions = {
		    from: 'cmpe277snappychat@gmail.com', 
		    to: email, 
		    subject: 'Timeline Update of your friend', 
		    text: text 
		};
	
	transporter.sendMail(mailOptions, function(error, info) {
	    if (error) {
	        console.log(error);
	        callback(null, "error");
	    } else{
	        console.log('Message sent: ' + info.response);
	        callback(null, "Message Sent");
	    }
	});
};