import React from "react";
var StringFormat = require('../helper/string-format.js');
var ApiUrl = "http://localhost:3000/api/";
var usersPath = "Users/{0}?access_token={1}";
var usersLogInPath = "Users/login";
var roleMappingPath="RoleMappings/findOne?filter={\"where\":{\"principalType\":\"User\",\"principalId\":\"{0}\"}}";
var roleMappingGetRolePath="RoleMappings/{0}/role";
export class SignIn extends React.Component{
	constructor(props){
		super();
		this.state = {
			user: props.user,
			accessToken: props.accessToken,
			userEmail:"admin@axia.com",
			userPassword:"Passw0rd",
			welcomeMsg:""
		};
		
	}

	logIn(){
		
		fetch(ApiUrl + usersLogInPath, {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
		    "email": this.state.userEmail,
		    "password": this.state.userPassword
		  })
		}).then(response => response.json())
	      .then(responseJsonUser =>{

			// Get rating title
			fetch( ApiUrl+StringFormat(roleMappingPath,responseJsonUser.userId))
			.then(response => response.json())
			.then(responseJsonRoleMapping =>{
				fetch( ApiUrl+StringFormat(roleMappingGetRolePath,responseJsonRoleMapping.id))
				.then(response => response.json())
				.then(responseJsonRole =>{
					
					
					var user =responseJsonUser;
					user.role = responseJsonRole;
					
					
					this.setState({
				 		accessToken: responseJsonUser.id,
				 		user: user,
				 		
					});
					// Assign access token

					if(responseJsonUser.userId != undefined)
					{
						this.getUserInfo(responseJsonUser.userId,responseJsonUser.id);
			      		this.onChagneAcessToken();
			      	}else{
			      	   this.setState({
				 		accessToken: "The username or password you have entered is invalid.",
				 		
					  });
			      	}
				})
				.catch((error) => {
					console.log(error);
				})

			})
			.catch((error) => {
				console.log(error);
			})
			  	
	      })
	      .catch((error) => {
	        console.log(error);
	      });
	   
    	
	}

	getUserInfo(userId,accessToken){
		var path= StringFormat(usersPath,userId,accessToken);

		fetch(ApiUrl + path)
		  .then( response => response.json())
	      .then(responseJson =>{
	        var welcomeMsg = <p>Hi {responseJson.username} (Role:{this.state.user.role.name})</p>;
	        this.setState({
		 		user: {name: responseJson.username},
		 		welcomeMsg: welcomeMsg

			});
			
	      })
	      .catch((error) => {
	        console.log(error);
	      });
	   
	}
	onChagneAcessToken(){
		this.props.changeAccessToken(this.state.accessToken,this.state.user);
	}
	onEmailChange(event){
		
		this.setState({
		 		userEmail:  event.target.value

		});
	}
	onPasswordChange(event){
		
		this.setState({
		 		userPassword:  event.target.value

		});
	}
	componentWillReceiveProps(nextProps){
    	// update local state from Props
    	this.setState({
		    accessToken: nextProps.accessToken,
		 	user: nextProps.user,
		 			
		});
    	
    }
	render(){
		 var signInBlock="";
		 let welcomeMsg = "";
		 if((this.state.welcomeMsg == "")|| (this.state.accessToken=="") )
		 {
			 signInBlock = (
				<div>
				  <p className="text-danger">{this.state.accessToken}</p>
				  <div className="form-group">
				    <label >Email address</label>
				    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" 
				           value={this.state.userEmail} 
				           onChange={(event) => this.onEmailChange(event)}/>
				    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
				  </div>
				  <div className="form-group">
				    <label >Password</label>
				    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" 
				           value={this.state.userPassword} 
				           onChange={(event) => this.onPasswordChange(event)}/>
				  </div>
				   <button type="submit" onClick={() => {this.logIn(); }} className="btn btn-primary">Submit</button>
				   
				</div>
			 );
			 
		 }else{
		 	welcomeMsg=this.state.welcomeMsg;
		 }
		return(
			<div>
			    {welcomeMsg}
				{signInBlock}
			    
			</div>
		);
	}
}
