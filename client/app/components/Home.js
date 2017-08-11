import React from "react";

var StringFormat = require('../helper/string-format.js');
var ApiUrl= "http://localhost:3000/api/";
var MoviesPath = "Movies/?access_token={0}";
var RatingsUrl = "Ratings/{0}";
var	MoviePath = "Movies/{0}?access_token={1}";
var	UpdateMoviePath = "Movies/Update?where={\"id\":\"{0}\"}&access_token={1}";
export class Home extends React.Component {

constructor(props){
	super();
	this.state = {
		user: props.user,
		accessToken: props.accessToken,
		records: "",
		addBtnAction:"",
		itemBtnAction:"",
		editMovieTitle:[],
		editMovieYearRelease:[],
		editMovieRating:[],
		addBlock:"",
		
		msg: "Please sign in to manage your data",
		movieItems: []
	};
	
    this.getRatingTitle = this.getRatingTitle.bind(this);
    this.getMovieRecords = this.getMovieRecords.bind(this);
	this.getMovieRecords(props.accessToken);
}
// ============================================================= //
// =========================  VIEW ============================= //
// ============================================================= //
onChangeMovieRecord(accessToken){

	this.setState({
	    records: "",
	 	accessToken: accessToken
	 			
	});
}
getMovieRecords(accessToken){

	var url= ApiUrl+ StringFormat(MoviesPath,accessToken);
	//Get all movies record
	fetch( url)
		.then( response => response.json())
		.then(responseJson =>{
			const items = responseJson.map((item,i) => 
				    // Get rating title
					fetch( ApiUrl+StringFormat(RatingsUrl,item.ratingId))
					.then(response2 => response2.json())
					.then(responseJson2 =>{
						// responseJson.push(item);
						responseJson[i].rating= responseJson2;
						return responseJson[i]
					})
					.catch((error) => {
						console.log(error);
					})
				);
			Promise.all(items).then(responses => {
		            this.setState({ movieItems: responses });
		            var getRecords= responseJson.map((item,i) => 
					<tr key={item.id}>
						<th scope="row">{i+1}</th>
						<td>{item.title}</td>
						<td>{item.yearReleased}</td>
						<td>{item.rating.title}</td>
						<td>{this.getAction(item.id,i,accessToken,item)}
						</td>
					</tr>);
					// Assign Movie Record
			        this.setState({
			 			records: getRecords,
			 			editMovieTitle:  responseJson.map((item,i) =>  item.title),
			 			editMovieYearRelease:  responseJson.map((item,i) =>  item.yearReleased),
			 			editMovieRating: responseJson.map((item,i) =>  item.ratingId),
					});
					
		     });

		})
		.catch((error) => {
			console.log(error);
		});
	

}
getRatingTitle(ratingId){
	//Get Rating title
	var url=ApiUrl+StringFormat(RatingsUrl,ratingId);

	fetch( url)
	.then( response => response.json())
	.then(responseJson =>{
		 this.setState({
	 		itemRating: responseJson.title		
		});
	})
	.catch((error) => {
		console.log(error);
	});
	
}
getAction(itemid,rowid,accessToken,item){
	var action ="";
	var addAction="";
	var msg="";
	var btnAdd = <button  className="btn btn-sm btn-info btn-block " onClick={() => this.onAddMovieClick()}>Add New Movie</button>;
	var btnEdit=<button    className="btn btn-sm btn-warning btn-block" onClick={(event) => this.onEditMovieClick(itemid,rowid,event,item)}>Edit</button>;
	var btnDel= <button    className="btn btn-sm btn-danger btn-block" onClick={() => {confirm('Delete the item?')?this.onDeleteMovie(itemid,accessToken):""}}>Delete</button>;
	
	if((this.state.user.role != undefined)
		 && ((this.state.user.role.name.toUpperCase() == "ADMIN")
		    || (this.state.user.role.name.toUpperCase() == "MANAGER")
		    )){
		action=(<div className="row">
			 		{btnEdit}
				    {btnDel}
				</div>);
	    addAction = btnAdd;
	}
	else if((this.state.user.role != undefined)
		  && (this.state.user.role.name.toUpperCase() == "TEAMLEADER")){
		action=(<div className="row">
			 		{btnEdit}
				</div>);
	    addAction = btnAdd;
	}
	else if((this.state.user.role != undefined)
		  && (this.state.user.role.name.toUpperCase() == "FLOORSTAFF")){
		action="";
		addAction = "";
		msg= "Plase ask your team leader to update any data";
	}
	else{
		action="";
		msg= "Please sign in to manage your data";
		addAction = "";
	}
	
	this.setState({
	 			// itemBtnAction: action,
	 			addBtnAction: addAction,
	 			msg:msg
	});
	return action;
}
// ============================================================= //
// =========================  ADD ============================= //
// ============================================================= //
onAddMovieClick(){
	
	var btnSubmit=<button  className="btn btn-sm btn-primary btn-block" onClick={(event) => this.onAddMovieItem()}>Submit</button>;
	var btnCancel= <button className="btn btn-sm btn-secondary btn-block" onClick={(event) => this.onCancleAddMovieItem()}>Cancel</button>;
    
	var rowid = this.state.records.length;

	var id={};
	var addElement = <tr >
						<th scope="row">{rowid+1}</th>
						<td><input type="text" className="form-control" id="movieEditTitle"  placeholder="Title " 
				            value={this.state.editMovieTitle[rowid]} 
				             onChange={(event) => this.onEditMovieTitleChange(id,rowid,event)}
				           /></td>
						<td><input type="text" className="form-control" id="movieEditYearRelease"  placeholder="Year Released" 
				            value={this.state.editMovieYearRelease[rowid]} 
				             onChange={(event) => this.onEditMovieYearReleaseChange(id,rowid,event)}
				           /></td>
						<td><input type="text" className="form-control" id="movieEditRating"  placeholder="Rating" 
				            value={this.state.editMovieRating[rowid] } 
				             onChange={(event) => this.onEditMovieRatingChange(id,rowid,event)}
				        />
				        <div className="row">
				            <p>Rating score:</p>
				        	<ul className="list-group">
				        		
				        		<li className="list-group-item justify-content-between">
								    G
								    <span className="badge badge-default badge-pill">1</span>
								</li>
								<li className="list-group-item justify-content-between">
								    PG
								    <span className="badge badge-default badge-pill">2</span>
								</li>
								<li className="list-group-item justify-content-between">
								    M
								    <span className="badge badge-default badge-pill">3</span>
								</li>
								<li className="list-group-item justify-content-between">
								    MA
								    <span className="badge badge-default badge-pill">4</span>
								</li>
								<li className="list-group-item justify-content-between">
								    R
								    <span className="badge badge-default badge-pill">5</span>
								</li>

				        	</ul>
				        </div>
				        </td>
						<td>
							{btnSubmit}
							{btnCancel}
						</td>
					</tr>;

	this.setState({
	    
	    addBlock: addElement
	 	
	});

}
onAddMovieItem(){

	var rowid = this.state.records.length-1;
	fetch(ApiUrl + StringFormat(MoviesPath,this.state.accessToken), {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
		    "title": this.state.editMovieTitle[rowid],
		    "yearReleased": this.state.editMovieYearRelease[rowid],
		    "ratingId": this.state.editMovieRating[rowid],
		    "created" : new Date(),
		    "modified" :new Date()
		  })
	}).then( responseJson =>{ 
		this.getMovieRecords(this.state.accessToken);
		this.setState({
		    addBlock: ""
		});
	}).catch((error) => {
		console.log(error);
	});

}
onCancleAddMovieItem(){
	this.setState({
	    
	    addBlock: ""
	 	
	});
}
// ============================================================= //
// =========================  DELETE ============================= //
// ============================================================= //
onDeleteMovie(id,accessToken){	

    
	fetch(ApiUrl + StringFormat(MoviePath,id,accessToken), {
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then( 
		responseJson =>{ this.getMovieRecords(accessToken);
	}).catch((error) => {
		console.log(error);
	});

}
// ============================================================= //
// =========================  EDIT ============================= //
// ============================================================= //
onEditMovieClick(id,rowid,event){
	
	var btnUpdate=<button     className="btn btn-sm btn-primary btn-block" onClick={(event) => this.onUpdateMovieClick(id,rowid,event)}>Update</button>;
	var btnCancel= <button    className="btn btn-sm btn-secondary btn-block" onClick={(event) => this.UpdateMovieItem(id,rowid)}>Cancel</button>;

	var editElement = <tr key={id}>
						<th scope="row">{rowid+1}</th>
						<td><input type="text" className="form-control" id="movieEditTitle"  placeholder="Title " 
				            value={this.state.editMovieTitle[rowid]} 
				             onChange={(event) => this.onEditMovieTitleChange(id,rowid,event)}
				           /></td>
						<td><input type="text" className="form-control" id="movieEditYearRelease"  placeholder="Year Released" 
				            value={this.state.editMovieYearRelease[rowid]} 
				             onChange={(event) => this.onEditMovieYearReleaseChange(id,rowid,event)}
				           /></td>
						<td><input type="text" className="form-control" id="movieEditRating"  placeholder="Rating" 
				            value={this.state.editMovieRating[rowid] } 
				             onChange={(event) => this.onEditMovieRatingChange(id,rowid,event)}
				        />
				        <div className="row">
				            <p>Rating score:</p>
				        	<ul className="list-group">
				        		
				        		<li className="list-group-item justify-content-between">
								    G
								    <span className="badge badge-default badge-pill">1</span>
								</li>
								<li className="list-group-item justify-content-between">
								    PG
								    <span className="badge badge-default badge-pill">2</span>
								</li>
								<li className="list-group-item justify-content-between">
								    M
								    <span className="badge badge-default badge-pill">3</span>
								</li>
								<li className="list-group-item justify-content-between">
								    MA
								    <span className="badge badge-default badge-pill">4</span>
								</li>
								<li className="list-group-item justify-content-between">
								    R
								    <span className="badge badge-default badge-pill">5</span>
								</li>

				        	</ul>
				        </div>
				        </td>
						<td>
							{btnUpdate}
							{btnCancel}
						</td>
					</tr>;

	// event.target.parentElement.parentElement.parentElement = editElement;
	var record;
	record = this.state.records;
	record[rowid]=editElement;
	this.setState({
	    records: record
	 	
	});

}

onEditMovieTitleChange(id,rowid,event){
	var title = this.state.editMovieTitle;
	title[rowid] = event.target.value;
	
	this.setState({
		editMovieTitle:  title

	});
	this.onEditMovieClick(id,rowid,event);
}
onEditMovieYearReleaseChange(id,rowid,event){
	var year = this.state.editMovieYearRelease;
	year[rowid] = event.target.value;
	this.setState({
		 editMovieYearRelease:  year

	});
	this.onEditMovieClick(id,rowid,event);
}
onEditMovieRatingChange(id,rowid,event){
	var rating = this.state.editMovieRating;
	rating[rowid]= event.target.value
	this.setState({
		 editMovieRating:  rating

	});
	this.onEditMovieClick(id,rowid,event);
}

onUpdateMovieClick(id,rowid,event){
	var url= ApiUrl+ StringFormat(UpdateMoviePath,id,this.state.accessToken);
	//Get all movies record
	fetch( url,{
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
		    "title": this.state.editMovieTitle[rowid],
		    "yearReleased": this.state.editMovieYearRelease[rowid],
		    "ratingId": this.state.editMovieRating[rowid],
		    "modified" :new Date()
		  })
		})
		.then( response => response.json())
		.then(responseJson =>{ this.UpdateMovieItem(id,rowid);
		})
		.catch((error) => {
			console.log(error);
		});
}
UpdateMovieItem(id,rowid){	

	fetch(ApiUrl + StringFormat(MoviePath,id,this.state.accessToken))
	.then(response => response.json())
	.then( responseJson =>{ 
		var item = responseJson;
		
		// Get rating title
		fetch( ApiUrl+StringFormat(RatingsUrl,item.ratingId))
		.then(response2 => response2.json())
		.then(responseJson2 =>{
						
				item.rating= responseJson2;
				
				var updatedRecords= <tr key={item.id}>
								<th scope="row">{rowid+1}</th>
								<td>{item.title}</td>
								<td>{item.yearReleased}</td>
								<td>{item.rating.title}</td>
								<td>{this.getAction(item.id,rowid,this.state.accessToken,item)}
								</td>
							</tr>;
			  	var record;
				record = this.state.records;
				record[rowid]=updatedRecords;
				this.setState({
				    records: record
				 	
				});
				
		})
		.catch((error) => {
			console.log(error);
		})

		
	})
	.catch((error) => {
		console.log(error);
	});

}
// ============================================================= //
// =========================  RENDER ============================= //
// ============================================================= //

componentWillReceiveProps(nextProps){
	// update local state from Props
	this.setState({
	    accessToken: nextProps.accessToken,
	 	user: nextProps.user,
	 			
	});
	this.getMovieRecords(nextProps.accessToken);
}
render() {
	var title=<h1>Movie List</h1>;

	return(
		<div>
			{title}
			<p className="text-warning">{this.state.msg}</p>
			<div className="row">
			  {this.state.addBtnAction} 
			</div>
			<table className="table table-hover">
			  <thead>
			    <tr>
			      <th>#</th>
			      <th>Title</th>
			      <th>Year Released</th>
			      <th>Rating</th>
			      <th></th>
			    </tr>
			  </thead>
			  <tbody>
			    {this.state.addBlock}
			    {this.state.records}
			  </tbody>
			</table>
		</div>
	);
}
}
