import React from "react";
import { LogOut } from '../connectors/user'
var StringFormat = require('../helper/string-format.js');


export const Header = (props) => {
		let logoutBtn="";

		if(props.accessToken != ""){
			logoutBtn = (<button type="submit" onClick={() => LogOut(props.accessToken,props.changeAccessToken)} className="btn btn-primary">Log out</button>);
		}
		return(	
			<nav className="navbar navbar-toggleable-md navbar-light bg-faded">
			  <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			    <span className="navbar-toggler-icon"></span>
			  </button>
			  <a className="navbar-brand" href="#">MOVIE STORE</a>
			
			  <div className="collapse navbar-collapse" id="navbarNav">
			    <ul className="navbar-nav">
			      <li className="nav-item active">
			        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
			      </li>			 
			      <li className="nav-item">
			       {logoutBtn}
			      </li>
			    </ul>
			 
			  </div>
			</nav>
		);
};