import hyperHTML from './node_modules/hyperhtml/esm.js';
const html = (...args)=>hyperHTML.wire()(...args);

customElements.define('blockstack-signin', class Signin extends HTMLElement{
	constructor(){
		super();
		this.state = {
			"isUserSignedIn" : false
		};

		this.setState(this.state);

		if (blockstack.isUserSignedIn()) {
			this.setProfile(blockstack.loadUserData().profile);
		} else if (blockstack.isSignInPending()) {
			blockstack.handlePendingSignIn().then((userData)=>{
				this.setProfile(userData.profile)
			})
		}	
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
    	blockstack.signUserOut(window.location.href)
	}
	setProfile(profile){
		this.setState({
			isUserSignedIn : true,
			person : new blockstack.Person(profile)
		});	
	}
	render(bind){
		bind`<div style="text-align: center; padding-top: 1rem;">${this.state.isUserSignedIn
				?html`<h1>${this.state.person.name()}</h1>
					<img style="width:6rem; height: 6rem; border-radius: 50%;" src="${this.state.person.avatarUrl()}" />
					<div><button onclick="${this.onSignout}">Signout</button></div>`
				:html`<button onclick="${this.onSignin}">Signin</button>`}
			</div>`;
	}
});

hyperHTML.bind(document.body)`<blockstack-signin>`;

