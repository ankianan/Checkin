import hyperHTML from 'hyperhtml';
import XHyperElement from '../common/XHyperElement.js';
import css from "./css/app-header.css";

const html = (...args)=>hyperHTML.wire()(...args);

customElements.define('app-header', class extends XHyperElement{
	constructor(){
		super({
			person : Object,
			allCheckins : Boolean,
			'signout' : Function
		});
	}
	render(){
		return this.html`<div class="app-header__container">
			<h1 style="flex : 1;">
				<a style="text-decoration:none; color: inherit" href="/">Checkin</a>
			</h1>
			<div class="${this.props.person ? 'app-header__mySection' : 'hide'}">
				<a class="${!this.props.allCheckins ? 'selected' : ''}" href="./nearby">Nearby</a>
				<a class="${this.props.allCheckins ? 'selected' : ''}" href="./all">All</a>
				
				<div class="profile">
					<span style="margin : 1rem;">${this.props.person.name()}</span>
					<img class="profile__image"  src="${this.props.person.avatarUrl()}" />
					<div class="profile__list">
						<div class="profile__list--item">
							<a href="/" rel="external" onclick="${this.props['signout']}">Logout</a>
						</div>
					</div>
				</div>
			</div>
			
		</div>`
	}
});

