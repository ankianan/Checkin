import hyperHTML from '../hyperhtml/esm.js';
const html = (...args)=>hyperHTML.wire()(...args);

const storage = {
	fileName : "/fences.json",
	options : {
	  encrypt: false,
	  decrypt: false
	}
};

customElements.define('geo-tag', class extends HTMLElement{
	constructor(){
		super();
		this.state = {};
		
		this.setInitialState();

		this.fences = [];

		Promise.all([this.getFences(), this.getPosition()]).then((values)=>{
			this.fences = values[0];
			const position = values[1];
			this.setState({
				loading : false
			})
			this.showTagsForPosition(position);
		});
	}
	setInitialState(){
		this.setState({
			"newFence" : {
				"lat" : 28.633525006458328,
				"long" : 77.33238908462228,
				"radius" : 10000,
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
		this.render(hyperHTML.bind(this))
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
	async createFence(){
		this.fences.push(JSON.parse(JSON.stringify(this.state.newFence)));
		let position = await this.getPosition()
		this.showTagsForPosition(position);
		/*blockstack.putFile(storage.fileName, JSON.stringify(this.fences), storage.options).then(() => {
			// /hello.txt exists now, and has the contents "hello world!".
		})*/
	}
	async getFences(){
		return this.fences;
		/*return JSON.parse(await blockstack.getFile(storage.fileName, storage.options));*/
	}
	async getPosition(){
		return new Promise((resolve, reject)=>{
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(function(position) {
					resolve({
						"lat" : position.coords.latitude, 
						"long" : position.coords.longitude
					});
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
	render(bind){
		bind`<div>
				<form action="javascript:void(0)" name="newFence" onsubmit="${this.createFence.bind(this)}">
					<fieldset class="row">
						<legend>Tag</legend>
						<label>Lat : <input typ="text" name="lat" value=${this.state.newFence.lat} /></label>
						<br>
						<label>Long : <input typ="text" name="long" value="${this.state.newFence.long}" /></label>
						<br>
						<label>Radius : <input name="radius" type="range"  min="0" max="10000" value="${this.state.newFence.radius}" ></label>
						<label>Message : <input type="text" name="message" value="${this.state.newFence.tags.messages[0]}" onchange="${this.onMessageInputChange.bind(this)}" /></label>
					</fieldset>
					<input type="submit" value="tag" />
				</form>
				<ul>${this.state.tagged.messages.map((message)=>{
					return html`<li>${message}</li>`
				})}</ul>
			</div>`;
	}
});