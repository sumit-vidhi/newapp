var bcrypt = require('../../node_modules/bcrypt-nodejs');
var CryptoJS = require('../../node_modules/crypto-js');
var connection = require('../../models/dbconnection').dbquery;
var email = require('../../config/email');
var validt=require('../../models/validation');
var multer  =   require('multer');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage }).array('userPhoto',12);

function addslashes(str) {
    str = str.replace(/'/g, "\\'");
    return str;
}
module.exports = {
    home: function(req, res, next){    	
		if (req.session.admin_id) {
	       res.redirect('/admin/dashboard');
	    }
		res.render('index.ejs',{ message: '',errors: {},username:''});
    },

    forgot: function(req, res, next){    	
		if (req.session.admin_id) {
	       res.redirect('/admin/dashboard');
	    }
		res.render('forgot.ejs',{ message: '',errors: {},username:''});
    },

    sendlink: function(req, res, next) {
        
                var post = req.body;        
                if(post) {
                    var validatemodel = new validt(post);
                    var validata=validatemodel.check();
                    if(validata.length > 0){
                        var err=validata;
                         res.render('forgot.ejs',{ message: '',errors:err}); 
                    }else{
                    
                        var username = post.username;
                        var admin=    new connection("admin");	
                        admin.findall("*",{where: "username = '"+username+"'"},function(err,rows){
                            if (rows.length==0) { 
                              res.render('forgot.ejs',{ message: 'A valid username is required',errors: {},username: username});                  
                            }
                            else {
                            //  link= "";
                            //  mailBody="Hello <h2>"+rows[0].name+"</h2> <br>Pleasce click the below link and update your password"
                            //  +"<br>" +link;
                            //     var mailOptions = {
                            //         from: email.user, // sender address
                            //         to: username, // list of receivers
                            //         subject: "Forgot password request", // Subject line                               
                            //         html:mailBody // html body
                            //     };
                            //     email.transport.sendMail(mailOptions, function(error, info){
                            //         if(error){
                            //             return console.log(error);
                            //         }
                            //        // console.log('Message sent: ' + info.response);
                            //     });
                           
                                res.render('forgot.ejs',{ message: 'Password link send to your registered email address',errors: {},username: username});
                             
                            }
                        });
                }
              }
                else {
                    res.redirect('/');
                }
            },
	authenticate: function(req, res, next) {

    	var post = req.body;        
    	if(post) {
			var validatemodel = new validt(post);
			var validata=validatemodel.check();
        	if(validata.length > 0){
				var err=validata;
				 res.render('index.ejs',{ message: '',errors:err}); 
			}else{
			
			    var username = post.username;		 
		    	var password = post.password; 
               	var admin=    new connection("admin");	
            	admin.findall("*",{where: "username = '"+username+"'"},function(err,rows){
					if (rows.length==0) { 
		    		  res.render('index.ejs',{ message: 'A valid username is required',errors: {},username: username});                  
                    }
                    else {                        
                    	if (password != rows[0].password) {
                    		res.render('index.ejs',{ message: 'Oops! Wrong password.',errors: {},username: username});         
                    	}
                    	else {
                    		req.session.admin_id=rows[0].id;
                    		req.session.admin_username=rows[0].first_name+" "+rows[0].last_name;
                    		res.redirect('/admin/dashboard');
                    	}
                    }
				});
		}
      }
    	else {
    		res.redirect('/');
    	}
    },
	 dashboard: function(req, res, next){    	
		var session=req.session;
		//console.log(movie.find());
        res.render('dashboard.ejs',{message:'',session:session});
    },
	 logout: function(req, res, next){    	
		req.session.destroy();
		res.redirect('');
    },
     users: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
        res.render('users.ejs',{ success: message,errors: error,session:session});
    },
	 zipcode: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
        res.render('zipcode.ejs',{ success: req.flash('info') ,errors: error,session:session});
    },

	 meals: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
        res.render('meals.ejs',{ success: req.flash('info'),errors: error,session:session});
    },
    
	 blogs: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
        res.render('blogs.ejs',{ success: req.flash('info'),errors: error,session:session});
    },
    pages: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
        res.render('pages.ejs',{ success: req.flash('info'),errors: error,session:session});
    },


	 addzipcode: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
		
           res.render('add-zipcode.ejs',{ message: message,errors: error,session:session});
		
    },
    addmeal: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
		
           res.render('add-meals.ejs',{ message: message,errors: error,session:session});
		
    },

    addblog: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
		
           res.render('add-blog.ejs',{ message: message,errors: error,session:session});
		
    },

    addpage: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
		
           res.render('add-page.ejs',{ message: message,errors: error,session:session});
		
    },

     editzipcode: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
		var id=req.params.id;
		console.log(id);
		var zipcode=    new connection("zipcode");
         zipcode.findall("*",{where: "id = '"+id+"'"},function(err,rows){
         	console.log(rows);
              if(err){
                res.render('edit-zipcode.ejs',{ message: 'Oops Somethig is wrong',errors: {},session:session});  
              }else{
              	  res.render('edit-zipcode.ejs',{ message: message,data:rows[0],errors: error,session:session});
              }
        })
      
		
    },

    updatezipcode:function(req,res,next){
          
          post=req.body;
          if(post.id){
          	var id=post.id;
          	var fromzipcode=post.zipcodefrom;
          	var session=req.session;
            var zipcode=    new connection("zipcode");
             zipcode.findall("*",{where: "zipnumber = '"+fromzipcode+"'and id !='"+id+"'"},function(err,rows){
             	console.log(rows);
                  
					if (rows.length!=0) { 
					  var zipnumber=rows[0].zipnumber;
                      dataedit={"zipnumber":zipnumber,"id":id};
		    		  res.render('edit-zipcode.ejs',{ message: 'Zipcode is already added',data:dataedit,errors: {},session:session});                  
                    }
                    else {                        	
                        var q = {"zipnumber":fromzipcode}	;
                        zipcode.update(q,id,function(err,rows){
							if(err){
								 res.render('add-zipcode.ejs',{ message: 'Oops Somethig is wrong',errors: {},session:session});  
							}else{
                                req.flash('info', 'Zipcode Updated  successfully.')
							    res.redirect('/admin/zipcode');
						    }
						})	
                    }
					});


          }
    },
    
    update_blog:function(req,res,next){
        
        post=req.body;
        console.log(post);
        if(post.id){
            var id=post.id;
            var title=post.title;
            var description=post.description;
            var session=req.session;
            var blog=    new connection("blog");
            var q={title:''+title+'',description:''+description+''};
            blog.findall("*",{where: "title = '"+title+"'and id !='"+id+"'"},function(err,rows){
               console.log(rows);
                
                  if (rows.length!=0) { 
                  
                    dataedit={"title":title,"description":description,"id":id};
                    res.render('edit-blog.ejs',{ message: 'Blog is already added',data:dataedit,errors: {},session:session});                  
                  }
                  else {                        	
                   
                      blog.update(q,id,function(err,rows){
                          if(err){
                               res.render('add-blog.ejs',{ message: 'Oops Somethig is wrong',errors: {},session:session});  
                          }else{
                              req.flash('info', 'Blog Updated  successfully.')
                              res.redirect('/admin/blogs');
                          }
                      })	
                  }
                  });


        }
  },

  update_page:function(req,res,next){
    
    post=req.body;
    console.log(post);
    if(post.id){
        var id=post.id;
        var title=post.title;
        var description=post.description;
        var session=req.session;
        var page=    new connection("pages");
        var q={title:''+title+'',description:''+description+''};
        page.findall("*",{where: "title = '"+title+"'and id !='"+id+"'"},function(err,rows){
           console.log(rows);
            
              if (rows.length!=0) { 
              
                dataedit={"title":title,"description":description,"id":id};
                res.render('edit-blog.ejs',{ message: 'Page is already added',data:dataedit,errors: {},session:session});                  
              }
              else {                        	
               
                page.update(q,id,function(err,rows){
                      if(err){
                           res.render('add-blog.ejs',{ message: 'Oops Somethig is wrong',errors: {},session:session});  
                      }else{
                          req.flash('info', 'Page Updated  successfully.')
                          res.redirect('/admin/pages');
                      }
                  })	
              }
              });


    }
},
  
	
	 update: function(req, res, next){   
        
			post=req.body;
			if(post){
				//console.log(post);
			var zipcode=    new connection("zipcode");
			var fromzipcode=post.zipcodefrom;
			var tozipcode=post.zipcodeto;
			console.log(typeof tozipcode);
			 var session=req.session;
			if(tozipcode==""){
				zipcode.findall("*",{where: "zipnumber = '"+fromzipcode+"'"},function(err,rows){
					if (rows.length!=0) { 
		    		  res.render('add-zipcode.ejs',{ message: 'Zipcode is already added',errors: {},session:session});                  
                    }
                    else {                        
                       // var q = "zipnumber="+fromzipcode;
                          var q = {zipnumber:fromzipcode};
                        zipcode.save(q,function(err,rows){
							if(err){
								 res.render('add-zipcode.ejs',{ message: 'Oops Somethig is wrong',errors: {},session:session});  
							}else{
                                req.flash('info', 'New Zipcode Created successfully.')
							    //req.session.success="New Zipcode Created successfully.";
                                res.redirect('/admin/zipcode');
						    }
						})
                    }
					});
			}else{
				
				for(var i=fromzipcode;i<=tozipcode;i++){
                    wrap(function(i){
                    	   zipcode.findall("*",{where: "zipnumber = '"+i+"'"},function(err,rows){
						       if(rows.length==0){
						           // var qr2= "zipnumber="+i;
						            var qr2 = {zipnumber:i};
						            zipcode.save(qr2,function(err,rows){
						             });
						        }
						          });
                    },i)
				}
                 req.flash('info', 'New Zipcode Created successfully.')
			        req.session.success="New Zipcode Created successfully.";
                    res.redirect('/admin/zipcode');
			}
		}else{
			res.redirect('/');
		}
		
    },


    savemeal: function(req, res, next){

      	upload(req,res, function(err) {
          	 if(err) {
              return res.end("Error uploading file.");
	        }
	        else{
	        	var _savemealimages=function(id){
                      var mealsimage=new connection("meal_images");
		                var files = req.files;
						var arrayLength = files.length;
						for (var i = 0; i < arrayLength; i++) {
								console.log(files[i].filename);
						    var q={meal_id:id,image:''+files[i].filename+''};
						     mealsimage.save(q,function(err,rows){
		                  
		                })
                        }
                req.flash('info', 'New Meal Created successfully.')
                res.redirect("admin/meals");
	        	}
	        	var id;
                post=req.body;
                var session=req.session;
                var mealname=post.mealname;
                var mealprice=post.mealprice;
                var mealdescription=post.mealdescription;
                var mealingredients=post.mealingredients;
                var mealnutrition=post.mealnutrition;
                var id=post.id;
                var meal=new connection("meals");
                var q={meal_name:''+mealname+'',price:mealprice,description:''+mealdescription+'',ingredients:''+mealingredients+'',nutrition:''+mealnutrition+''};
                meal.findall("*",{where: "meal_name = '"+mealname+"'"},function(err,mealrows){
                    if(mealrows.length==0){
                    if(req.files && req.files.length){
                        meal.save(q,function(err,rows){
                        id=rows.insertId;
                        _savemealimages(id);
                        
                        })
                    }else{
                        meal.save(q,function(err,rows){
                        id=res.insertId;
                        req.flash('info', 'New Meal Created successfully.')
                            res.redirect("admin/meals");
                        })

                    }
                    }else{
                        error=[{"msg":"Meal is already added."}];
                        message="";
                        res.render('add-meals.ejs',{ message: message,data:q,errors: error,session:session});
                    }
                })
                

	        }
          	 
		})
		
    },

    saveblog: function(req, res, next){
        
                        post=req.body;
                        var session=req.session;
                        var title=post.title;
                        var description=post.description;
                        
                        var blog=new connection("blog");
                        var q={title:''+title+'',description:''+description+''};
                        blog.findall("*",{where: "title = '"+title+"'"},function(err,rows){
                            if(rows.length==0){
                          
                                blog.save(q,function(err,rows){
                               // id=res.insertId;
                                req.flash('info', 'New Blog Created successfully.')
                                    res.redirect("admin/blogs");
                                })
          
                            }else{
                                error=[{"msg":"Blog is already added."}];
                                message="";
                                res.render('add-blog.ejs',{ message: message,data:q,errors: error,session:session});
                            }
                        })
                     
              
            },

            savepage: function(req, res, next){
                
                                post=req.body;
                                var session=req.session;
                                var title=post.title;
                                var description=post.description;
                                
                                var page=new connection("pages");
                                var q={title:''+title+'',description:''+description+''};
                                page.findall("*",{where: "title = '"+title+"'"},function(err,rows){
                                    if(rows.length==0){
                                  
                                        page.save(q,function(err,rows){
                                       // id=res.insertId;
                                        req.flash('info', 'New Page Created Successfully.')
                                            res.redirect("admin/pages");
                                        })
                  
                                    }else{
                                        error=[{"msg":"Page is already added."}];
                                        message="";
                                        res.render('add-page.ejs',{ message: message,data:q,errors: error,session:session});
                                    }
                                })
                             
                      
                    },

  zipcodedelete:function(req,res){
        var id=req.params.id;
        var zipcode=new connection("zipcode");
        zipcode.delete({where: "id = '"+id+"'"},function(err,rows){
            req.flash('info', 'Zipcode Deleted successfully.')
           res.redirect("admin/zipcode");
        })
  },
  mealdelete:function(req,res){
        var id=req.params.id;
        var meal=new connection("meals");
        var mealimage=new connection("meal_images");
        meal.delete({where: "id = '"+id+"'"},function(err,rows){
            mealimage.delete({where: "meal_id = '"+id+"'"},function(err,rows){
                req.flash('info', 'Meal Deleted successfully.')
               res.redirect("admin/meals");
            })
       })
  },
delete_zipcode_ajax:function(req,res){
   id=req.body.data_ids;
   idarray=id.split(",");
   var zipcode=new connection("zipcode");
   if(idarray.length){
    //console.log(idarray[0]);
    for(var i=0;i<=idarray.length;i++){
       zipcode.delete({where: "id = "+idarray[i]},function(err,rows){
          
        })
    }
   res.send("done");
    }
   },

    editmeal: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
        var id=req.params.id;
        console.log(id);
        var meal=    new connection("meals");
         meal.findall("*",{where: "id = '"+id+"'"},function(err,rows){
          console.log(rows);
              if(err){
                res.render('edit-meals.ejs',{ message: 'Oops Somethig is wrong',errors: {},session:session});  
              }else{
                  res.render('edit-meals.ejs',{ message: message,data:rows[0],errors: error,session:session});
              }
        })
      
    
    },

    editblog: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
        var id=req.params.id;
        console.log(id);
        var blog=    new connection("blog");
        blog.findall("*",{where: "id = '"+id+"'"},function(err,rows){
          console.log(rows);
              if(err){
                res.render('edit-blog.ejs',{ message: 'Oops Somethig is wrong',errors: {},session:session});  
              }else{
                  res.render('edit-blog.ejs',{ message: message,data:rows[0],errors: error,session:session});
              }
        })
      
    
    },

    editpage: function(req, res, next){   
        var message='';
        var session=req.session;
        var error='';
        var id=req.params.id;
        console.log(id);
        var page=    new connection("pages");
        page.findall("*",{where: "id = '"+id+"'"},function(err,rows){
          console.log(rows);
              if(err){
                res.render('edit-page.ejs',{ message: 'Oops Somethig is wrong',errors: {},session:session});  
              }else{
                  res.render('edit-page.ejs',{ message: message,data:rows[0],errors: error,session:session});
              }
        })
      
    
    },

    updatemeal:function(req,res,next){
          
          upload(req,res, function(err) {
             if(err) {
              return res.end("Error uploading file.");
          }
          else{
            var _savemealimages=function(id){
            var mealsimage=new connection("meal_images");
            var files = req.files;
            var arrayLength = files.length;
            mealsimage.delete({where: "meal_id = "+id},function(err,rows){
          
             }) 
            for (var i = 0; i < arrayLength; i++) {
                console.log(files[i].filename);
                var q={meal_id:id,image:''+files[i].filename+''};
                 mealsimage.save(q,function(err,rows){
                      
                    })  
            }
                res.redirect("admin/meals");
            }
                post=req.body;

                var mealname=post.mealname;
                var mealprice=post.mealprice;
                var mealdescription=post.mealdescription;
                var mealingredients=post.mealingredients;
                var mealnutrition=post.mealnutrition;
                var id=post.id;
                var meal=new connection("meals");
                var q={meal_name:''+mealname+'',price:mealprice,description:''+mealdescription+'',ingredients:''+mealingredients+'',nutrition:''+mealnutrition+''};
               if(req.files && req.files.length){
                meal.update(q,id,function(err,rows){
                  
                   _savemealimages(id);
                 
                })
               }else{

                meal.update(q,id,function(err,rows){ 

                    req.flash('info', 'Meal Updated successfully.')
                    res.redirect("admin/meals");
                })

               }
                
   
          }
             
    })
        
    },

    mealview:function(req,res){
        id=req.params.id;
        var session=req.session;

       
         var meal=    new connection("meals");
         var mealImages=    new connection("meal_images");
         meal.findall("*",{where: "id = '"+id+"'"},function(err,rows){
            mealImages.findall("*",{where: "meal_id = '"+id+"'"},function(err,rowsdata){
               // console.log(rowsdata.length);
              if(err){
                res.render('mealdetail.ejs',{ message: 'Oops Somethig is wrong',errors: {},session:session});  
              }else{
                res.render('mealdetail.ejs',{ message: '',data:rows[0],imagedata:rowsdata,errors: {},session:session}); 
              }
        })
    })
    }


}
function wrap(callback,i){
	callback(i);
}



