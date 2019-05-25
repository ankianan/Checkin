import hyperHTML from 'hyperhtml';
import XHyperElement from '../common/XHyperElement.js';
import css from "./css/app-header.css";

const html = (...args)=>hyperHTML.wire()(...args);

customElements.define('app-header', class extends XHyperElement{
	constructor(){
		super({
			person : Object,
			allCheckins : Boolean,
			toggleAllCheckins : Function
		});
	}
	render(){
		return this.html`<div class="app-header__container">
			<h1 style="flex : 1;">
				<a style="text-decoration:none; color: inherit" href="/">Checkin</a>
			</h1>
			${this.props.person?html`<a class="${!this.props.allCheckins?'selected':''}" href="javascript:void(0)" onclick="${this.props.toggleAllCheckins}">Nearby</a>
			<a class="${this.props.allCheckins?'selected':''}" href="javascript:void(0)" onclick="${this.props.toggleAllCheckins}">All</a>
			<span style="margin : 1rem;">${this.props.person.name()}</span>
			<img class="avatar"  src="${this.props.person.avatarUrl()}" />`:''}
		</div>`
	}
});

