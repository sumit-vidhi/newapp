var dbconfig = require('../config/database');
var mysql = require('../node_modules/mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"freashbytransform"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  
});

var dbquery=function(table){
	this.table=table;

}

dbquery.prototype.findall=function(parms,condition,callback){
	db.query("select "+parms+" from "+this.table+" WHERE "+condition['where'],function(err,rows){
		if(callback){
			    callback(err, rows, parms);
			}else{
				return err;
			}
		})
}

dbquery.prototype.save=function(parms,callback){
	db.query("INSERT INTO "+this.table+" SET ?",parms,function(err,rows){
		if(rows){
			    callback(err, rows, parms);
			}else{
				return err;
			}
		})
}

dbquery.prototype.update=function(parms,condition,callback){
	db.query("update  "+this.table+" SET ? WHERE id=?",[parms,condition],function(err,rows){
		if(rows){
			    callback(err, rows, parms);
			}else{
				return err;
			}
		})

}

dbquery.prototype.delete=function(condition,callback){
	db.query("delete  from "+this.table+" WHERE "+condition['where'],function(err,rows){
		if(rows){
			    callback(err, rows);
			}else{
				return err;
			}
		})
}



module.exports={

	dbquery:dbquery,
	conn:db

};

