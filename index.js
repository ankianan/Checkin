import hyperHTML from './hyperhtml/esm.js';
const html = (...args)=>hyperHTML.wire()(...args);

const storage = {
	fileName : "/status.txt",
	options : {
	  encrypt: false,
	  decrypt: false
	}
};

customElements.define('blockstack-profile', class extends HTMLElement{
	constructor(){
		super();
		this.state = {};
		
		this.setInitialState();

		try{
			if (blockstack.isUserSignedIn()) {
				this.setProfile(blockstack.loadUserData().profile);
			} else if (blockstack.isSignInPending()) {
				blockstack.handlePendingSignIn().then((userData)=>{
					this.setProfile(userData.profile)
				})
			}else{
				this.setState({
					loading : false
				})
			}
		}catch(e){
			this.setState({
				loading : false
			})	
		}
	}
	setInitialState(){
		this.setState({
			"isUserSignedIn" : false,
			"person" : null,
			"status" : "",
			loading : true
		});
	}
	setState(newState){
		Object.assign(this.state, newState);
		this.render(hyperHTML.bind(this))
	}
	onSignin(event){
		event.preventDefault()
    	blockstack.redirectToSignIn();
	}
	onSignout(event){
		event.preventDefault()
    	blockstack.signUserOut(document.location.origin)
	}
	async setProfile(profile){
		const status = await blockstack.getFile(storage.fileName, storage.options);
		this.setState({
			isUserSignedIn : true,
			person : new blockstack.Person(profile),
			status,
			loading : false 
		});	
	}
	onStatusSubmit(event){
		this.setState({
			status : event.target.elements.status.value
		});
		blockstack.putFile(storage.fileName, this.state.status, storage.options).then(() => {
			// /hello.txt exists now, and has the contents "hello world!".
		})
	}
	render(bind){
		bind`<div style="padding: 0 1rem;width:250px;">
			${this.state.loading
				?html`<span>Loading...</span>`
				:html`<div>
						${this.state.isUserSignedIn
							?html`<div class="row">
									<h1>${this.state.person.name()}</h1>
								</div>
								<img class="row" style="widht: 100%; height:10rem; min-height:10rem; border-radius: 5px; background-color: red" src="${this.state.person.avatarUrl()}" />
								<form action="javascript:void(0)" onsubmit=${this.onStatusSubmit.bind(this)}>
									<fieldset class="row">
									    <legend>Status</legend>
										<textarea style="width: 100%; border: none; outline: none" name="status" value=${this.state.status} />
									</fieldset>
									<div class="row">
										<button type="submit">Post</button>
										<button type="button" onclick="${this.onSignout}">Signout</button>
									</div>
								</form>

								`
							:html`<button onclick="${this.onSignin}">Signin</button>`}
					</div>`}
				</div>`;
	}
});

hyperHTML.bind(document.body)`<blockstack-profile>`;

