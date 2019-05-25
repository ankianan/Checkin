import * as blockstack from 'blockstack';
import geolib from 'geolib';
import XHyperElement from '../common/XHyperElement.js';
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


customElements.define('geo-tag', class extends XHyperElement{
	constructor(){
		super({
			isSignedIn : Boolean,
			setMessages : Function,
			allCheckins : Boolean
		});
		this.state = {
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
		};
		this.fences = [];
	}
	async loadGeoTags(){
		let positionPromise = await this.getPosition();
		Promise.all([this.getFences(), positionPromise]).then((values)=>{
			this.fences = values[0];
			const position = values[1];
			this.setState({
				loading : false
			})
			this.showTagsForPosition(position);
		});
	}
	componentDidUpdate(previousProps, previousState){
		if(previousProps.isSignedIn != this.props.isSignedIn){
			if(this.props.isSignedIn == true){
				this.loadGeoTags();
			}
		}
		if(previousProps.allCheckins != this.props.allCheckins){
			if(this.props.allCheckins == true){
				this.showTagsForAllPositions();
			}else{
				this.showTagsForLastPositions();
			}
		}
		if(this.state.tagged && this.state.tagged.messages != previousState.tagged.messages){
			this.props.setMessages(this.state.tagged.messages);
		}
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
		if(this.props.isSignedIn){
			let position = await this.getPosition()
			let clone_newFence = JSON.parse(JSON.stringify(this.state.newFence));
			this.fences.push(clone_newFence);

			
			await blockstack.putFile(storage.fileName, JSON.stringify(this.fences), storage.options).then(() => {
				event.target.reset();
				this.showTagsForPosition(position);
			})	
		}else{
			document.body.classList.add('notifySignin');
			setTimeout(()=>{
				document.body.classList.remove('notifySignin');
			},1000)
		}
	}
	async getFences(){
		let fences = await blockstack.getFile(storage.fileName, storage.options) 
		return fences?JSON.parse(fences) : this.fences;
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
	showTagsForAllPositions(){
		let messages = [];

		//Iterate all fences
		this.fences.forEach((fence)=>{
			//Display messages of fence, in which user is standing
			Array.prototype.push.apply(messages, fence.tags.messages)	
		});

		this.setState({
			tagged : {
				messages
			}
		});
	}
	showTagsForPosition(position){
		let messages = [];

		//Iterate all fences
		this.fences.forEach((fence)=>{
			//Check if position in this fence
			if(this.isPositionInFence(position, fence)){
				//Display messages of fence, in which user is standing
				Array.prototype.push.apply(messages, fence.tags.messages)
			}	
		});

		this.setState({
			tagged : {
				messages
			}
		});
	}
	showTagsForLastPositions(){
		const {lat, long} = this.state.newFence;
		this.showTagsForPosition({lat, long});
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
				<form style="${formStyle}" action="javascript:void(0)" name="newFence" onsubmit="${this.createFence.bind(this)}" novalidate="${!this.props.isSignedIn}">
						<input type="text" style="${inputTextStyle}" name="message" placeholder="Write a message" value="${this.state.newFence.tags.messages[0]}" onchange="${this.onMessageInputChange.bind(this)}" required />
						<input type="submit" style="${inputSubmitStyle}" value="Post" />
				</form>
				
			</div>`;
	}
});