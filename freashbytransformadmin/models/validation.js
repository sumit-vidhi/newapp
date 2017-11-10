function valid(data){
	this.data=data;
	this.err=[];
}
valid.prototype.check=function(){
	if(this.data.username==""){
		this.err.push("username is required");
	}
	if(this.data.password==""){
		this.err.push("password is required");
	}
	return this.err;
}
module.exports=valid;