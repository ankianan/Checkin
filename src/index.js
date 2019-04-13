import * as blockstack from 'blockstack';
import hyperHTML from 'hyperhtml';
import './geo-tag/GeoTag.js';
import './app-header/AppHeader.js';
const html = (...args)=>hyperHTML.wire()(...args);

const globalStyle = html`
			<style>
				.notifySignin .signin{
					animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
					transform: translate3d(0, 0, 0);
					backface-visibility: hidden;
					perspective: 1000px;
				}
				@keyframes shake {
				  10%, 90% {
				    transform: translate3d(-1px, 0, 0);
				  }
				  
				  20%, 80% {
				    transform: translate3d(2px, 0, 0);
				  }

				  30%, 50%, 70% {
				    transform: translate3d(-4px, 0, 0);
				  }

				  40%, 60% {
				    transform: translate3d(4px, 0, 0);
				  }
				}
			</style>`;

const buttonStyle = {
  backgroundColor: "#4CAF50",
  border: "none",
  color: "white",
  padding: "1rem",
  textDecoration: "none",
  cursor: "pointer",
  width: "10rem",
  outline : "none"
}

const signOutbuttonStyle = {
  backgroundColor: "#e2e2e2",
  border: "none",
  color: "#333",
  padding: "1rem",
  textDecoration: "none",
  cursor: "pointer",
  width: "7rem",
  outline : "none",
  position : "fixed",
  right : "1rem",
  bottom : "1rem"
}


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
		this.setState({
			isUserSignedIn : true,
			person : new blockstack.Person(profile),
			loading : false 
		});	
	}
	render(bind){
		bind`
			${globalStyle}
			<div style="padding: 0 1rem;">
				<app-header style="margin-bottom : 2rem;" person=${this.state.person}></app-header>
				<geo-tag style="margin-bottom: 3rem" isSignedIn="${!!this.state.person}"></geo-tag>
				<div style="text-align:center;">
				${this.state.loading
					?html`<button style="${buttonStyle}">Loading...</button>`
					:html`<div>
							${this.state.isUserSignedIn
								?html`<button style="${signOutbuttonStyle}" onclick="${this.onSignout}">Signout</button>`
								:html`<button class="signin" style="${buttonStyle}" onclick="${this.onSignin}">Signin</button>`}
						</div>`}
				</div>
				
				
			</div>`;
	}
});

hyperHTML.bind(document.body)`<blockstack-profile>`;

