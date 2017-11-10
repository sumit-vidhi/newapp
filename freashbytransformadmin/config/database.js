// config/database.js
module.exports = {
    'connection': {
		'host'     : 'localhost',
		'user'     : 'root',
		'password' : '',
		'database' : 'nodejs',
		'dateStrings' :true,
		'port' : '',
    },
    'mailer': {
		'host'     : 'smtp.gmail.com',//SMTP HOST
		'user'     : '',//SMTP USER EMAIL
		'password' : '',//SMTP PASSWORD
		'from' : '',//SMTP FROM USER EMAIL
		'port' : '465',
    }
};

