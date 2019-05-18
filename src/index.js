import { UserSession, AppConfig, Person } from 'blockstack';
import hyperHTML from 'hyperhtml';
import './geo-tag/GeoTag.js';
import './app-header/AppHeader.js';
import { User, configure } from 'radiks';


const userSession = new UserSession({
  appConfig: new AppConfig(['store_write', 'publish_data'])
})

configure({
  apiServer: 'http://localhost:8081',
  userSession
});

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


customElements.define('checkin-app', class extends HTMLElement{
	constructor(){
		super();
		this.state = {};

		this.setInitialState();
		this.handleSignin();
		this.onSignout = this.onSignout.bind(this);
	}
	async setInitialState(){
		this.setState({
			"isUserSignedIn" : false,
			"person" : null,
			loading : true
		});
	}
	async handleSignin(){
		try{
			if (userSession.isUserSignedIn()) {
				this.setProfile(userSession.loadUserData().profile);
			} else if (userSession.isSignInPending()) {
				const userData = await userSession.handlePendingSignIn();
				this.setProfile(userData.profile);
				await User.createWithCurrentUser();

			}else{
				this.setState({
					loading : false
				})
			}
		}catch(e){
			console.error(e);
			this.setState({
				loading : false
			})	
		}
	}
	setState(newState){
		Object.assign(this.state, newState);
		this.render(hyperHTML.bind(this))
	}
	onSignin(event){
		event.preventDefault()
    	userSession.redirectToSignIn();
	}
	onSignout(event){
		event.preventDefault()
    	userSession.signUserOut();
    	document.location.href = "/";
	}
	async setProfile(profile){
		this.setState({
			isUserSignedIn : true,
			person : new Person(profile),
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

hyperHTML.bind(document.body)`<checkin-app>`;

