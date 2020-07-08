const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const fs = require('fs');
var sslRedirect = require('heroku-ssl-redirect');

const credentials  = {
	key: fs.readFileSync('sslcert/www_barberdog_co_il.key', 'utf8'),
	cert: fs.readFileSync('sslcert/www_barberdog_co_il.crt', 'utf8')
  };


const app = express(sslRedirect());

dotenv.config();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", function(req, res){
	res.render("index");
});

app.get('/sitemap.xml', function(req, res) {
	res.sendFile('sitemap.xml');
});

app.get("/gallery", function(req, res){
	res.render("gallery");
});


app.get("/contact", function(req, res){
	res.render("contact");
});

app.get("/catalog", function(req, res){
	res.render("catalog");
});


app.get("/contact_send", function(req, res){
	res.render("contact_send");
});

app.get("/contact_error", function(req, res){
	res.render("contact_error");
});

app.post("/contact_send", function(req, res){
	const output = `
		<P>new contact request</p>
		<h3>details</h3>
		<ul>
			<li>Email: ${req.body.email}</li>
			<li>Name: ${req.body.name}</li>
			<li>Phone: ${req.body.phone}</li>
		</ul>
	`;

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		  user: process.env.EMAIL_ADDRESS,
		  pass: process.env.EMAIL_PASSWORD 
		}
	});
	
	  // send mail with defined transport object
	let mailOptions = {
		from: process.env.EMAIL_ADRESS, // sender address
		to: 'orbarberdog@gmail.com', // list of receivers oruzal85@gmail.com orbarberdog@gmail.com
		subject: "you have a new contact", // Subject line
		text: "Hello", // plain text body
		html: output // html body
	};
	
	transporter.sendMail(mailOptions, function(err, data) {
		if(err){
			console.log(err);
			return res.render("contact_error");
		} else{
			console.log('email sent!');
			return res.render("contact_send");
		}
	});
});

// app.listen(3000, function(){
// 	console.log("server listen on port 3000");
// });


app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Server has started");
});