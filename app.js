const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require("dotenv");


const fs = require('fs');

const https = require('https');
// const privateKey  = fs.readFileSync('public/www_barberdog_co_il.key', 'utf8');
// const certificate = fs.readFileSync('public/www_barberdog_co_il.pem', 'utf8');
// const credentials = {key: privateKey, cert: certificate};



const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use('/public/robots.txt', function (req, res, next) {
    res.type('text/plain')
    res.send("User-agent: *\nDisallow: /");
});


app.get("/", function(req, res){
	res.render("./index");
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

app.get("/Recommendations", function(req, res){
	res.render("Recommendations");
});

app.get("/product", function(req, res){
	res.render("product");
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
	// async function main() {
	// 	// Generate test SMTP service account from ethereal.email
	// 	// Only needed if you don't have a real mail account for testing
	// 	let testAccount = await nodemailer.createTestAccount();

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		// port: 587,
   		// secure: false,
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

// }
});

	
// app.listen(3000, function(){
// 	console.log("server listen on port 3000");
// });

https.createServer({
	key: fs.readFileSync('public/www_barberdog_co_il.key'),
	cert: fs.readFileSync('public/www_barberdog_co_il.pem')
}, app)
.listen(3000, function(){
	console.log("Server has started");
})

// app.listen(process.env.PORT, process.env.IP, function(){
// 	console.log("Server has started");
// });