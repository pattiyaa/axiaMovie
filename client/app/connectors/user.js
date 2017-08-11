var StringFormat = require('../helper/string-format.js');
var ApiUrl = "http://localhost:3000/api/";
var	usersPath = "Users/{0}?access_token={1}";
var	usersLogInPath = "Users/login";
var	usersLogOutPath = "Users/logout?access_token={0}";

export function LogOut(accessToken,changeAccessToken){	
	fetch(ApiUrl + StringFormat(usersLogOutPath,accessToken), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then( 
	   () => {
	       changeAccessToken("",{user: {name:""}} );
	   }
	)
	.catch((error) => {
		console.log(error);
	});

}
