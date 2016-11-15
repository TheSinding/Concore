'use strict';

// Usage:
// node imap.js > account.mobileconfig

var mobileconfig = require('mobileconfig');
var fs = require('fs');
var prompt = require('prompt');
var colors = require('colors');
prompt.message = '';
prompt.delimiter = colors.cyan(':');

var schema = {
  properties: {
    name: {
      pattern: /^[a-zA-Z\s\-]+$/,
      description: colors.cyan('First- and surname'),	
      required: true	
    },
    email_domain: {
      message: colors.cyan('Enter email domain, eg example.com:'),
      required: true
    },
		fullname: {
			message: colors.cyan('Use default email name? If no, then enter desired name, eg example.'),
			required: true,
			default: 'yes'
		},
    password: {
      required: true,
      description: colors.cyan('Enter Password for the Email Account'),
      hidden: true,
			replace: '*'
    },
    imap: {
      required: true,
      description: colors.cyan('Enter IMAP host')
    },
    imap_port:{
      required: true,
      description: colors.cyan('Set the IMAP Port'),
			default: '143'
    },
    imap_ssl:{
      required: true,
      description: colors.cyan('Use IMAP SSL?'),
			default: false
    },
    smtp: {
      required: true,
      description: colors.cyan('Enter SMTP host')
    },
    smtp_port:{
      required: true,
      default: '587',
      description: colors.cyan('Set the SMTP Port')
    },
    smtp_ssl:{
      required: true,
      default: false,
      description: colors.cyan('Use SMTP SSL?')
    },
    key:{
      required: true,
      default: __dirname + '/keys/key.pem',
      description: colors.cyan('Choose encryption key')
    },
    cert:{
      required: true,
      default: __dirname + '/keys/cert.pem',
      description: colors.cyan('Choose encryption certificate')
    }
  }
};
prompt.start();
  //
 // Get two properties from the user: username and email
 //
prompt.get(schema, function (err, result) {
   //
   // Log the results.
   //
	var initials = result.name.replace(/[^A-Z]/g, '').toLowerCase();
	var email = '';
		console.log(colors.cyan('--------------------'));

		if(result.fullname.toLowerCase() == 'yes' ||	result.fullname.toLowerCase() == 'y'){
			console.log(colors.magenta('Using ' + initials + ' as identifier'));
			email = initials + '@' +	result.email_domain;
		} else {
			console.log(colors.magenta('Using ' + result.fullname + ' as identifier'));
			email = result.fullname + '@' + result.email_domain;
		}	
   
		console.log(colors.cyan('Generating file for ') + colors.green(email));
   mobileconfig.getSignedEmailConfig({

    emailAddress: email,

    organization: 'mail.' + initials + '.' + result.email_domail,
    identifier: 'mail.' + initials + '.' + result.email_domail,

    displayName: email + ' Config',
    displayDescription: 'Install this profile to auto configure your Coworking Plus e-mail account',

    accountName: 'IMAP Config',
    accountDescription: email,

    imap: {
        hostname: result.imap,
        port: result.imap_port,
        secure: result.imap_ssl,
        username: email,
        password: result.password
    },

    smtp: {
        hostname: result.smtp,
        port: result.smtp_port,
        secure: result.smtp_ssl,
        username: email,
        password: false // use the same password as for IMAP
    },

    keys: {
        key: fs.readFileSync(result.key),
        cert: fs.readFileSync(result.cert),
        ca: []
    }
}, function(err, data) {
		var filename = email + '.mobileconfig';
    if (err) {
        process.stderr.write(colors.red(err.stack));
        return process.exit(1);
    }
    fs.writeFile(__dirname + '/configs/' + filename, data, function(err) {	
    if(err) {
        return console.log(colors.red(err));
    }
   console.log(colors.green("The file was saved, as /config/" + filename));
  });
});

});
