import * as blockstack from 'blockstack';
import geolib from 'geolib';
import GeoTagModel from "./model/GeoTagModel.js"

import hyperHTML from 'hyperhtml';
const html = (...args)=>hyperHTML.wire()(...args);

const storage = {
	fileName : "/fences.json",
	options : {
	  encrypt: false,
	  decrypt: false
	}
};

const tagIconStyle = {
	padding: "1rem 1rem 0 1rem",
	width : "128px",
	height : "128px",
	margin : "0 auto",
	marginBottom : "1rem"
}

const tagIconImageStyle = {
	width : "100%"
}

const formStyle = {
    display: "flex",
    margin: "0 auto 1rem",
    width: "50%"
}

const tagListStyle={
	margin: "0 auto 1rem",
    width: "50%",
    minHeight : "5rem"
}

const inputTextStyle = {
	flex : "1",
	padding : "1rem",
	width : "35%",
	outline : "none"
}

const inputSubmitStyle = {
  backgroundColor: "#4CAF50",
  border: "none",
  color: "white",
  padding: "1rem",
  textDecoration: "none",
  cursor: "pointer",
  width: "5rem",
  outline : "none"
}

const tagResultCountStyle = {
	fontWeight: "normal",
    borderBottom : "solid 1px #a2a2a2",
    padding: "1rem 0"
}

const tagItemStyle = {
	padding : "1rem",
	backgroundColor : "white",
	marginBottom : "1rem"
}

customElements.define('geo-tag', class extends HTMLElement{
	constructor(){
		super();
		this.state = {};
		
		this.setInitialState();

		this.fences = [];

		
	}
	get html() { 
		return this._html || (this._html = hyperHTML.bind(this)); 
	}
	set isSignedIn(value){
		this._isSignedIn = value;
		let positionPromise = this.getPosition();

		if(value == true){
			Promise.all([this.getFences(), positionPromise]).then((values)=>{
				this.fences = values[0];
				const position = values[1];
				this.setState({
					loading : false
				})
				this.showTagsForPosition(position);
			});
		}
		this.render();
	}
	get isSignedIn(){
		return this._isSignedIn;
	}
	setInitialState(){
		this.setState({
			"newFence" : {
				"lat" : 0,
				"long" : 0,
				"radius" : 1000,
				"tags" : {
					"messages" : []
				}
			},
			"tagged": {
				"messages" : []
			},
			"loading" : true
		});
	}
	setState(newState){
		Object.assign(this.state, newState);
		this.render()
	}
	onMessageInputChange(event){
		this.setState({
			newFence :Object.assign(this.state.newFence,{
				tags : Object.assign(this.state.newFence.tags, {
					messages : [event.target.value]
				})
			})
		});
	}
	async createFence(event){
		if(this.isSignedIn){
			let position = await this.getPosition()
			let clone_newFence = JSON.parse(JSON.stringify(this.state.newFence));
			this.fences.push(clone_newFence);

			const geoTag = new GeoTagModel(this.getServerModel(this.state.newFence));
			await geoTag.save()
			
			event.target.reset();
			this.showTagsForPosition(position);
			/*await blockstack.putFile(storage.fileName, JSON.stringify(this.fences), storage.options).then(() => {
				
			})*/	
		}else{
			document.body.classList.add('notifySignin');
			setTimeout(()=>{
				document.body.classList.remove('notifySignin');
			},1000)
		}
	}
	async getFences(){
		/*let fences = await blockstack.getFile(storage.fileName, storage.options) */
		const geoTags = await GeoTagModel.fetchOwnList();
		/*return fences?JSON.parse(fences) : this.fences;*/
		return geoTags.length?geoTags.map(serverModel=>this.getClientModel(serverModel)): this.fences;
		
	}
	async getPosition(){
		return new Promise((resolve, reject)=>{
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition((position)=> {
					let _position = {
						"lat" : position.coords.latitude, 
						"long" : position.coords.longitude
					};
					this.setState({
						newFence : Object.assign(this.state.newFence, _position)
					});

					resolve(_position);
				});
			} else {
			  /* geolocation IS NOT available */
			  reject();
			}
		})
		
	}
	showTagsForPosition(position){
		this.setState({
			tagged : {
				messages : []
			}
		})
		//Iterate all fences
		this.fences.forEach((fence)=>{
			//Check if position in this fence
			if(this.isPositionInFence(position, fence)){
				//Display messages of fence, in which user is standing
				this.setState({
					tagged : Object.assign(this.state.tagged,{
						messages:this.state.tagged.messages.concat(fence.tags.messages)
					})
				});
			}	
		});
	}
	isPositionInFence(postion, fence){
		const distance = geolib.getDistance(
		    {latitude: postion.lat, longitude: postion.long},
		    {latitude: fence.lat, longitude: fence.long}
		);

		if(distance<fence.radius){
			return true;
		}
		return false;
	}
	render(){
		return this.html`<div>
				<div style=${tagIconStyle}>
					<img src="https://image.flaticon.com/icons/png/128/252/252025.png" style="${tagIconImageStyle}" /> 
				</div>
				<div style="margin-bottom:1rem;text-align:center">
					latitude : ${this.state.newFence.lat}, longitude : ${this.state.newFence.long}</div>
				<form style="${formStyle}" action="javascript:void(0)" name="newFence" onsubmit="${this.createFence.bind(this)}" novalidate="${!this.isSignedIn}">
						<input type="text" style="${inputTextStyle}" name="message" placeholder="Write a message" value="${this.state.newFence.tags.messages[0]}" onchange="${this.onMessageInputChange.bind(this)}" required />
						<input type="submit" style="${inputSubmitStyle}" value="Post" />
				</form>
				${this.isSignedIn
					?html`<div style="${tagListStyle}">
							<h4 style="${tagResultCountStyle}">
								${this.state.tagged.messages.length==0
									?this.state.loading?'Loading...': 'No checkins done'
									:`${('0'+this.state.tagged.messages.length).slice(-2)} checkins found`
								}
							</h4>
							${this.state.tagged.messages.map((message)=>{
								return html`<div style="${tagItemStyle}"><span>${message}</span></div>`;
							})}
						</div>`
					:''
				}
			</div>`;
	}
	getServerModel(clientModel){
		const {lat, long, radius, tags} = clientModel;
		return {
			lat,
			long,
			radius,
			"tag-message" : tags.messages[0],
			"tag-message-decrypt" : tags.messages[0]
		};
	}
	getClientModel(serverModel){
		const {lat, long, radius} = serverModel.attrs;
		return {
			lat,
			long,
			radius,
			"tags" : {
				"messages" : [serverModel.attrs['tag-message']]
			}
		};
	}
});