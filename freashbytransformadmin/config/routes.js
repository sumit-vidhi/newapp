var CryptoJS = require('../node_modules/crypto-js');
var admin=require('../controllers/admin/admin');
var datatable=require('../controllers/admin/datatable');
var db = require('../models/dbconnection').conn;
module.exports = function(app) {
  app .use(function(req, res, next){
    if (req.session.admin_user_id) {
      res.locals.session = req.session;  
    } else {
      res.locals.session ='';
    }
      next();
  });
  app.use(function(req, res, next) {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	    next();
	});
   app.get('/',admin.home);
   app.get('/forgotpassword',admin.forgot);
   app.post('/forgotpassword',admin.sendlink);
   app.post('/',admin.authenticate);
   app.get('/admin/logout',admin.logout);
   app.get('/admin/dashboard',logincheck,admin.dashboard);
   app.get('/admin/users',logincheck,admin.users);
   app.get('/admin/zipcode_ajax',logincheck,datatable.zipcode_ajax);  
   app.get('/admin/zipcode',logincheck,admin.zipcode);
   app.get('/admin/addzipcode',logincheck,admin.addzipcode);
   app.get('/admin/editzipcode/:id',logincheck,admin.editzipcode);
   app.post('/admin/addzipcode',logincheck,admin.update);
   app.post('/admin/updatezipcode',logincheck,admin.updatezipcode);
   app.get('/admin/meals',logincheck,admin.meals);
   app.get('/admin/addmeal',logincheck,admin.addmeal);
   app.post('/admin/addmeal',logincheck,admin.savemeal);
   app.get('/admin/meals_ajax',logincheck,datatable.meals_ajax);
   app.get('/admin/zipcodedelete/:id',logincheck,admin.zipcodedelete);
   app.get('/admin/mealdelete/:id',logincheck,admin.mealdelete);
   app.post('/admin/delete_zipcode_ajax',logincheck,admin.delete_zipcode_ajax);
   app.get('/admin/editmeal/:id',logincheck,admin.editmeal);
   app.post('/admin/update_meal',logincheck,admin.updatemeal);
   app.get('/admin/mealview/:id',logincheck,admin.mealview);
   app.get('/admin/addblog',logincheck,admin.addblog);
   app.get('/admin/blogs',logincheck,admin.blogs);
   app.get('/admin/blogs_ajax',logincheck,datatable.blogs_ajax);
   app.post('/admin/addblog',logincheck,admin.saveblog);
   app.get('/admin/editblog/:id',logincheck,admin.editblog);
   app.post('/admin/update_blog',logincheck,admin.update_blog);
   app.get('/admin/pages',logincheck,admin.pages);
   app.get('/admin/pages_ajax',logincheck,datatable.pages_ajax);
   app.get('/admin/addpage',logincheck,admin.addpage);
   app.post('/admin/addpage',logincheck,admin.savepage);
   app.get('/admin/editpage/:id',logincheck,admin.editpage);
   app.post('/admin/update_page',logincheck,admin.update_page);
   app.get("/showdata/:id/:search",function(req,res,next){
    console.log(req.params)
      id=(req.params.id)?req.params.id:1;
      page=(id==1)?0:(id>1)?id-1:0;
      start=2;
      end=2*page;
      console.log(start);
      console.log(end);
      if(req.params.search!="all"){
        qr='SELECT q.* FROM (SELECT meals.* , meal_images.image AS image FROM meals LEFT JOIN meal_images ON meals.id = meal_images.meal_id where meals.meal_name  like  \'%'+req.params.search+'%\') q  GROUP BY q.id ';
        db.query(qr,function(err,total,fields){ 
       qr='SELECT q.* FROM (SELECT meals.* , meal_images.image AS image FROM meals LEFT JOIN meal_images ON meals.id = meal_images.meal_id where meals.meal_name  like  \'%'+req.params.search+'%\') q  GROUP BY q.id limit '+start+' OFFSET '+end+' ';
         db.query(qr,function(err,result,fields){ //foe view the data
           // console.log("select query");
           // console.log(result);
           res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
           console.log(err);
           res.json({"res":result,"total":total.length});
       });
     });
      }else{
        qr='SELECT q.* FROM (SELECT meals.* , meal_images.image AS image FROM meals LEFT JOIN meal_images ON meals.id = meal_images.meal_id ) q  GROUP BY q.id ';
        db.query(qr,function(err,total,fields){ 
       qr='SELECT q.* FROM (SELECT meals.* , meal_images.image AS image FROM meals LEFT JOIN meal_images ON meals.id = meal_images.meal_id ) q  GROUP BY q.id limit '+start+' OFFSET '+end+' ';
         db.query(qr,function(err,result,fields){ //foe view the data
           // console.log("select query");
           // console.log(result);
           res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
           console.log(err);
           res.json({"res":result,"total":total.length});
       });
     });
      }
   
  });

  app.get("/meal/:id",function(req,res,next){
   
     
       qr='SELECT q.* FROM (SELECT meals.* , meal_images.image AS image FROM meals LEFT JOIN meal_images ON meals.id = meal_images.meal_id  where meals.id='+req.params.id+') q';
         db.query(qr,function(err,result,fields){ //foe view the data
           // console.log("select query");
           // console.log(result);
           res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
           console.log(err);
           res.json(result);
       });
   
    
   
  });


 // bodyParser = require('body-parser').json();
  app.post("/getdata",function(req,res,next){
  var email=req.body.username;
  var pass=req.body.password;
  //console.log(req.body);
    qr="SELECT * FROM admin where username='"+email+"' and password='"+pass+"'";
      db.query(qr,function(err,result,fields){ //foe view the data
        // console.log("select query");
        // console.log(result);
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
      if(result[0]){
        //var success={"success":1,"msg":"login mismatch","result":result};
      //  result.push(success);
        //console.log(success);
        res.json(result[0]);
      }else{
        return next(new Error('No users found.'))
      }
        
    });
   // console.log(qr.query);
  });
};

function logincheck(req, res, next) { 	
	var userId =req.session.admin_id;
	console.log(userId);
	 if (typeof userId=='undefined') {
       res.redirect('/');
    }
    else {
	   
			next();
		}
   	
}