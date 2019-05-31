import * as blockstack from 'blockstack';
import hyperHTML from 'hyperhtml';
import './app-header/AppHeader.js';
import './geo-tag/GeoTag.js';
import './geo-tag-list/GeoTagList.js';

import css from "./css/styles.css";
import XHyperElement from './common/XHyperElement.js';
import page from 'page';
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

customElements.define('blockstack-profile', class extends XHyperElement{
	constructor(){
		super();
		this.state = {
			"isUserSignedIn" : false,
			"person" : null,
			loading : true,
			messages : [],
			showAllCheckins: false
		};
		this.setMessages = this.setMessages.bind(this);
		this.showAllCheckins = this.showAllCheckins.bind(this);
		this.showNearbyCheckins = this.showNearbyCheckins.bind(this);
		this.setupRoutes();
	}
	connectedCallback(){
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
	setupRoutes(){
		page.base('/checkin');
		page('/nearby', this.showNearbyCheckins);
		page('/all', this.showAllCheckins);
		page();
	}
	setMessages(messages){
		this.setState({
			messages
		});
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
	showAllCheckins(){
		this.setState({
			showAllCheckins : true
		})
	}
	showNearbyCheckins(){
		this.setState({
			showAllCheckins : false
		})
	}
	render(){
		this.html`
			${globalStyle}
			<div style="padding: 0 1rem;">
				<app-header style="margin-bottom : 2rem;" person=${this.state.person} allCheckins="${this.state.showAllCheckins}" signout="${this.onSignout}"></app-header>
				<geo-tag style="margin-bottom: 3rem" isSignedIn="${!!this.state.person}" setMessages="${this.setMessages}" allCheckins="${this.state.showAllCheckins}"></geo-tag>
				${this.state.isUserSignedIn?html`<geo-tag-list loading="${this.state.loading}" messages="${this.state.messages}"></geo-tag-list>`:''}
				<div style="text-align:center;">
				${this.state.loading
					?html`<button style="${buttonStyle}">Loading...</button>`
					:html`<div>
							${!this.state.isUserSignedIn
								?html`<button class="signin" style="${buttonStyle}" onclick="${this.onSignin}">Signin</button>`:''}
						</div>`}
				</div>
				
				
			</div>`;
	}
});

hyperHTML.bind(document.body)`<blockstack-profile>`;

