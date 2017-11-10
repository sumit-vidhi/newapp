var connection = require('../../models/dbconnection').conn;
var dateFormat = require('../../node_modules/dateformat');

var isset = function(str){
	if (typeof str != 'undefined') {
		return true;
	}
	return false;
}

var trim = function(str){	
	return str.trim();
}

var substr_replace = function(str, replace, start, length){	
	if (start < 0) { // start position in str
		start = start + str.length;
	}
	length = length !== undefined ? length : str.length;
	if (length < 0) {
		length = length + str.length - start;
	}
	return str.slice(0, start) + replace.substr(0, length) + replace.slice(length) + str.slice(start + length);
}

var addslashes = function(str){	
	return (str + '')
    .replace(/[\\"']/g, '\\$&')
    .replace(/\u0000/g, '\\0');
}


module.exports = {
	zipcode_ajax: function(req, res, next){	
		//adminModel = new connection("zipcode");
		request = req.query;		
		var aColumns = ['id','zipnumber'];
		var sIndexColumn = "id";
		var sTable = "zipcode";

		var sLimit = "";
		if(request['start'] && request['length'] != -1)	{
			sLimit = 'LIMIT ' +request['start']+ ', ' +request['length']
		}

		//Ordering
		var sOrder = "ORDER BY id DESC";
	    if ( isset(request['order'] ) && isset(request['order'][0]['dir']) && trim(request['order'][0]['dir'])!=='')
	    {
	       sOrder = "ORDER BY "+aColumns[request['order'][0]['column']]+" "+ request['order'][0]['dir'];  
	    }


	    /*
	     * Filtering
	     * NOTE this does not match the built-in DataTables filtering which does it
	     * word by word on any field. It's possible to do here, but concerned about efficiency
	     * on very large tables, and MySQL's regex functionality is very limited
	    */

	    var sWhere = "";
		if ( isset(request['search']['value']) && request['search']['value'] != "" ) {
			flArray = aColumns;
			sWhere = "WHERE (";
			for ( var i=0 ; i<flArray.length ; i++ ){
				sWhere += flArray[i]+" LIKE '%"+addslashes( request['search']['value'] )+"%' OR ";
			}
			sWhere =substr_replace(sWhere, "", -3 );
			sWhere += ')';
		}

		/* Individual column filtering */
	    for ( i=0 ; i<aColumns.length ; i++ )
	    {
	        if ( isset(request['columns']) && request['columns'][i]['searchable'] == "true" && request['columns'][i]['search']['value'] != '' )
	        {
	            if ( sWhere == "" )
	            {
	                sWhere = "WHERE ";
	            }
	            else
	            {
	                sWhere += " AND ";
	            }
	            sWhere += aColumns[i]+" LIKE '%"+addslashes(request['columns'][i]['search']['value'])+"%' ";
	        }
	    }

	    /*
	     * SQL queries
	     * Get data to display
	     */
	    var sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+" "+sLimit +"";
		var rResult = {};
		var rResultFilterTotal = {};
		var aResultFilterTotal = {};
		var iFilteredTotal = {};
		var iTotal = {};
		var rResultTotal = {};
		var aResultTotal = {};
		//console.log(sQuery);
	    connection.query(sQuery, function(err, rows) {		
			if(err) {
				res.send(err);
			}
			else {
				rResult = rows;
				sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+"";
				connection.query(sQuery, function(err, rows) {	
					if(err) {
						res.send(err);
					}
					else {
						iFilteredTotal=rows.length;

						sQuery = "SELECT COUNT("+sIndexColumn+") as total  FROM " +sTable+"";
						connection.query(sQuery, function(err, rows) {
							if(err) {
								res.send(err);
							}
							else {
								iTotal = rows[0]['total'];
								//Output
						        var output = {};
						        var temp = [];
						        output.sEcho = parseInt(request['sEcho']);
						        output.iTotalRecords = iTotal;
						        output.draw= parseInt(request['draw']);
						        output.iTotalDisplayRecords = iFilteredTotal;
						        output.aaData = [];

						        var aRow = rResult;
						        var row = [];
						        var editUrl='';
						        for(var i in aRow)
						        {
									for(Field in aRow[i])
									{
										if(Field == "id") {
											 nestedData = "<input type='checkbox'  class='deleteRow' value='"+aRow[i]['id']+"'  /> #"+i ;
											temp.push(nestedData);
										}
										
							            else {
							            	if(!aRow[i].hasOwnProperty(Field)) continue; 
											temp.push(aRow[i][Field]);
							            }
										
									}
									editUrl='<a href="editzipcode/'+aRow[i]['id']+'" title="Update"><i class="btn btn-primary btn-xs fa fa-pencil"></i></a>&nbsp;';	
									editUrl +='<a href="zipcodedelete/'+aRow[i]['id']+'" title="Delete"  onclick="javascript: return confirmDelete();"><i class="btn btn-danger btn-xs fa fa-trash-o"></i></a>';
									temp.push(editUrl);
						        	output.aaData.push(temp);
						         	temp = [];
						        }
						        res.send(output);							       				        
							}
						});
					}
				});
			}		
		}); 
    },

    meals_ajax:function(req,res,next){

    	request = req.query;		
		var aColumns = ['meal_name','price','description','created_on','id'];
		var sIndexColumn = "id";
		var sTable = "meals";

		var sLimit = "";
		if(request['start'] && request['length'] != -1)	{
			sLimit = 'LIMIT ' +request['start']+ ', ' +request['length']
		}

		//Ordering
		var sOrder = "ORDER BY id DESC";
	    if ( isset(request['order'] ) && isset(request['order'][0]['dir']) && trim(request['order'][0]['dir'])!=='')
	    {
	       sOrder = "ORDER BY "+aColumns[request['order'][0]['column']]+" "+ request['order'][0]['dir'];  
	    }


	    /*
	     * Filtering
	     * NOTE this does not match the built-in DataTables filtering which does it
	     * word by word on any field. It's possible to do here, but concerned about efficiency
	     * on very large tables, and MySQL's regex functionality is very limited
	    */

	    var sWhere = "";
		if ( isset(request['search']['value']) && request['search']['value'] != "" ) {
			flArray = aColumns;
			sWhere = "WHERE (";
			for ( var i=0 ; i<flArray.length ; i++ ){
				sWhere += flArray[i]+" LIKE '%"+addslashes( request['search']['value'] )+"%' OR ";
			}
			sWhere =substr_replace(sWhere, "", -3 );
			sWhere += ')';
		}

		/* Individual column filtering */
	    for ( i=0 ; i<aColumns.length ; i++ )
	    {
	        if ( isset(request['columns']) && request['columns'][i]['searchable'] == "true" && request['columns'][i]['search']['value'] != '' )
	        {
	            if ( sWhere == "" )
	            {
	                sWhere = "WHERE ";
	            }
	            else
	            {
	                sWhere += " AND ";
	            }
	            sWhere += aColumns[i]+" LIKE '%"+addslashes(request['columns'][i]['search']['value'])+"%' ";
	        }
	    }

	    /*
	     * SQL queries
	     * Get data to display
	     */
	    var sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+" "+sLimit +"";
		var rResult = {};
		var rResultFilterTotal = {};
		var aResultFilterTotal = {};
		var iFilteredTotal = {};
		var iTotal = {};
		var rResultTotal = {};
		var aResultTotal = {};
		//console.log(sQuery);
	    connection.query(sQuery, function(err, rows) {		
			if(err) {
				res.send(err);
			}
			else {
				rResult = rows;
				sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+"";
				connection.query(sQuery, function(err, rows) {	
					if(err) {
						res.send(err);
					}
					else {
						iFilteredTotal=rows.length;

						sQuery = "SELECT COUNT("+sIndexColumn+") as total  FROM " +sTable+"";
						connection.query(sQuery, function(err, rows) {
							if(err) {
								res.send(err);
							}
							else {
								iTotal = rows[0]['total'];
								//Output
						        var output = {};
						        var temp = [];
						        output.sEcho = parseInt(request['sEcho']);
						        output.iTotalRecords = iTotal;
						        output.iTotalDisplayRecords = iFilteredTotal;
						        output.aaData = [];

						        var aRow = rResult;
						        var row = [];
						        var editUrl='';
						        for(var i in aRow)
						        {
									for(Field in aRow[i])
									{
										if(Field == "id") {
											continue;
										}
										else if(Field == "created_on") {
							               var created =dateFormat(aRow[i]['created_on'], "mmmm dS, yyyy, h:MM:ss TT");
							               temp.push(created);
							            }
							            else if(Field == "price") {
							               var price ="$"+aRow[i]['price'];
							               temp.push(price);
							            }
							            else {
							            	if(!aRow[i].hasOwnProperty(Field)) continue; 
											temp.push(aRow[i][Field]);
							            }
										
									}
									editUrl='<a href="editmeal/'+aRow[i]['id']+'" title="Update"><i class="btn btn-primary btn-xs fa fa-pencil"></i></a>&nbsp;';	
									editUrl +='<a href="mealdelete/'+aRow[i]['id']+'" title="Delete"  onclick="javascript: return confirmDelete();"><i class="btn btn-danger btn-xs fa fa-trash-o"></i></a>&nbsp;';
									editUrl +='<a href="mealview/'+aRow[i]['id']+'" class="viewajax"  onclick="javascript: return view();" title=""><i class="fa fa-eye" aria-hidden="true"></i></a>';
									temp.push(editUrl);
						        	output.aaData.push(temp);
						         	temp = [];
						        }
						        res.send(output);							       				        
							}
						});
					}
				});
			}		
		}); 

	},
	
	blogs_ajax:function(req,res,next){
		
				request = req.query;		
				var aColumns = ['title','description','created_on','id'];
				var sIndexColumn = "id";
				var sTable = "blog";
		
				var sLimit = "";
				if(request['start'] && request['length'] != -1)	{
					sLimit = 'LIMIT ' +request['start']+ ', ' +request['length']
				}
		
				//Ordering
				var sOrder = "ORDER BY id DESC";
				if ( isset(request['order'] ) && isset(request['order'][0]['dir']) && trim(request['order'][0]['dir'])!=='')
				{
				   sOrder = "ORDER BY "+aColumns[request['order'][0]['column']]+" "+ request['order'][0]['dir'];  
				}
		
		
				/*
				 * Filtering
				 * NOTE this does not match the built-in DataTables filtering which does it
				 * word by word on any field. It's possible to do here, but concerned about efficiency
				 * on very large tables, and MySQL's regex functionality is very limited
				*/
		
				var sWhere = "";
				if ( isset(request['search']['value']) && request['search']['value'] != "" ) {
					flArray = aColumns;
					sWhere = "WHERE (";
					for ( var i=0 ; i<flArray.length ; i++ ){
						sWhere += flArray[i]+" LIKE '%"+addslashes( request['search']['value'] )+"%' OR ";
					}
					sWhere =substr_replace(sWhere, "", -3 );
					sWhere += ')';
				}
		
				/* Individual column filtering */
				for ( i=0 ; i<aColumns.length ; i++ )
				{
					if ( isset(request['columns']) && request['columns'][i]['searchable'] == "true" && request['columns'][i]['search']['value'] != '' )
					{
						if ( sWhere == "" )
						{
							sWhere = "WHERE ";
						}
						else
						{
							sWhere += " AND ";
						}
						sWhere += aColumns[i]+" LIKE '%"+addslashes(request['columns'][i]['search']['value'])+"%' ";
					}
				}
		
				/*
				 * SQL queries
				 * Get data to display
				 */
				var sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+" "+sLimit +"";
				var rResult = {};
				var rResultFilterTotal = {};
				var aResultFilterTotal = {};
				var iFilteredTotal = {};
				var iTotal = {};
				var rResultTotal = {};
				var aResultTotal = {};
				//console.log(sQuery);
				connection.query(sQuery, function(err, rows) {		
					if(err) {
						res.send(err);
					}
					else {
						rResult = rows;
						sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+"";
						connection.query(sQuery, function(err, rows) {	
							if(err) {
								res.send(err);
							}
							else {
								iFilteredTotal=rows.length;
		
								sQuery = "SELECT COUNT("+sIndexColumn+") as total  FROM " +sTable+"";
								connection.query(sQuery, function(err, rows) {
									if(err) {
										res.send(err);
									}
									else {
										iTotal = rows[0]['total'];
										//Output
										var output = {};
										var temp = [];
										output.sEcho = parseInt(request['sEcho']);
										output.iTotalRecords = iTotal;
										output.iTotalDisplayRecords = iFilteredTotal;
										output.aaData = [];
		
										var aRow = rResult;
										var row = [];
										var editUrl='';
										for(var i in aRow)
										{
											for(Field in aRow[i])
											{
												if(Field == "id") {
													continue;
												}
												else if(Field == "created_on") {
												   var created =dateFormat(aRow[i]['created_on'], "mmmm dS, yyyy, h:MM:ss TT");
												   temp.push(created);
												}
												else if(Field == "price") {
												   var price ="$"+aRow[i]['price'];
												   temp.push(price);
												}
												else {
													if(!aRow[i].hasOwnProperty(Field)) continue; 
													temp.push(aRow[i][Field]);
												}
												
											}
											editUrl='<a href="editblog/'+aRow[i]['id']+'" title="Update"><i class="btn btn-primary btn-xs fa fa-pencil"></i></a>&nbsp;';	
											editUrl +='<a href="blogdelete/'+aRow[i]['id']+'" title="Delete"  onclick="javascript: return confirmDelete();"><i class="btn btn-danger btn-xs fa fa-trash-o"></i></a>&nbsp;';
											//editUrl +='<a href="blogview/'+aRow[i]['id']+'" class="viewajax"  onclick="javascript: return view();" title=""><i class="fa fa-eye" aria-hidden="true"></i></a>';
											temp.push(editUrl);
											output.aaData.push(temp);
											 temp = [];
										}
										res.send(output);							       				        
									}
								});
							}
						});
					}		
				}); 
		
			},

			pages_ajax:function(req,res,next){
				
						request = req.query;		
						var aColumns = ['title','description','created_on','id'];
						var sIndexColumn = "id";
						var sTable = "pages";
				
						var sLimit = "";
						if(request['start'] && request['length'] != -1)	{
							sLimit = 'LIMIT ' +request['start']+ ', ' +request['length']
						}
				
						//Ordering
						var sOrder = "ORDER BY id DESC";
						if ( isset(request['order'] ) && isset(request['order'][0]['dir']) && trim(request['order'][0]['dir'])!=='')
						{
						   sOrder = "ORDER BY "+aColumns[request['order'][0]['column']]+" "+ request['order'][0]['dir'];  
						}
				
				
						/*
						 * Filtering
						 * NOTE this does not match the built-in DataTables filtering which does it
						 * word by word on any field. It's possible to do here, but concerned about efficiency
						 * on very large tables, and MySQL's regex functionality is very limited
						*/
				
						var sWhere = "";
						if ( isset(request['search']['value']) && request['search']['value'] != "" ) {
							flArray = aColumns;
							sWhere = "WHERE (";
							for ( var i=0 ; i<flArray.length ; i++ ){
								sWhere += flArray[i]+" LIKE '%"+addslashes( request['search']['value'] )+"%' OR ";
							}
							sWhere =substr_replace(sWhere, "", -3 );
							sWhere += ')';
						}
				
						/* Individual column filtering */
						for ( i=0 ; i<aColumns.length ; i++ )
						{
							if ( isset(request['columns']) && request['columns'][i]['searchable'] == "true" && request['columns'][i]['search']['value'] != '' )
							{
								if ( sWhere == "" )
								{
									sWhere = "WHERE ";
								}
								else
								{
									sWhere += " AND ";
								}
								sWhere += aColumns[i]+" LIKE '%"+addslashes(request['columns'][i]['search']['value'])+"%' ";
							}
						}
				
						/*
						 * SQL queries
						 * Get data to display
						 */
						var sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+" "+sLimit +"";
						var rResult = {};
						var rResultFilterTotal = {};
						var aResultFilterTotal = {};
						var iFilteredTotal = {};
						var iTotal = {};
						var rResultTotal = {};
						var aResultTotal = {};
						//console.log(sQuery);
						connection.query(sQuery, function(err, rows) {		
							if(err) {
								res.send(err);
							}
							else {
								rResult = rows;
								sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+"";
								connection.query(sQuery, function(err, rows) {	
									if(err) {
										res.send(err);
									}
									else {
										iFilteredTotal=rows.length;
				
										sQuery = "SELECT COUNT("+sIndexColumn+") as total  FROM " +sTable+"";
										connection.query(sQuery, function(err, rows) {
											if(err) {
												res.send(err);
											}
											else {
												iTotal = rows[0]['total'];
												//Output
												var output = {};
												var temp = [];
												output.sEcho = parseInt(request['sEcho']);
												output.iTotalRecords = iTotal;
												output.iTotalDisplayRecords = iFilteredTotal;
												output.aaData = [];
				
												var aRow = rResult;
												var row = [];
												var editUrl='';
												for(var i in aRow)
												{
													for(Field in aRow[i])
													{
														if(Field == "id") {
															continue;
														}
														else if(Field == "created_on") {
														   var created =dateFormat(aRow[i]['created_on'], "mmmm dS, yyyy, h:MM:ss TT");
														   temp.push(created);
														}
														else if(Field == "price") {
														   var price ="$"+aRow[i]['price'];
														   temp.push(price);
														}
														else {
															if(!aRow[i].hasOwnProperty(Field)) continue; 
															temp.push(aRow[i][Field]);
														}
														
													}
													editUrl='<a href="editpage/'+aRow[i]['id']+'" title="Update"><i class="btn btn-primary btn-xs fa fa-pencil"></i></a>&nbsp;';	
													editUrl +='<a href="pagedelete/'+aRow[i]['id']+'" title="Delete"  onclick="javascript: return confirmDelete();"><i class="btn btn-danger btn-xs fa fa-trash-o"></i></a>&nbsp;';
													//editUrl +='<a href="blogview/'+aRow[i]['id']+'" class="viewajax"  onclick="javascript: return view();" title=""><i class="fa fa-eye" aria-hidden="true"></i></a>';
													temp.push(editUrl);
													output.aaData.push(temp);
													 temp = [];
												}
												res.send(output);							       				        
											}
										});
									}
								});
							}		
						}); 
				
					}
    
   
}