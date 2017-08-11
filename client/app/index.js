import React from "react";
import { render } from "react-dom";
import { Header} from "./components/Header";
import { Home} from "./components/Home";
import { SignIn} from "./components/SignIn";


class App extends React.Component{
	constructor(){
		super();
		this.state = {
			accessToken:"",
			user:{}
		};
	}
	onChangeAccessToken(accessToken,user){
	    
		this.setState({
			accessToken: accessToken,
			user:user
		},function(){
			this.setState({
				accessToken: accessToken,
				user:user
			});
		});

	}
	render(){		
		return (
			<div className="container"> 
				<div className="row"> 
				   <div className="col-12">
						<Header  user={this.state.user} accessToken ={this.state.accessToken} changeAccessToken={this.onChangeAccessToken.bind(this)}/>
				   </div>
				</div>
				<div className="row"> 
				    <div className="col-12">
						<SignIn  user={this.state.user} accessToken ={this.state.accessToken} changeAccessToken={this.onChangeAccessToken.bind(this)}/>
						<Home user={this.state.user} accessToken ={this.state.accessToken}/>
					</div>
				</div>
			</div>

		);
	}
}
render(<App/>,window.document.getElementById('app'));