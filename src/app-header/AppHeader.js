import hyperHTML from 'hyperhtml';
const html = (...args)=>hyperHTML.wire()(...args);
const containerStyle={
	display : "flex",
	alignItems: "center",
	borderBottom : "solid 1px #a2a2a2"
}

const avatarStyles={
	width: "2rem", 
	height: "2rem", 
	minHeight: "2rem", 
	borderRadius: "50%"
}


customElements.define('app-header', class extends HTMLElement{
	constructor(){
		super();
	}
	get html() { 
		return this._html || (this._html = hyperHTML.bind(this)); 
	}
	set person(value){
		this._person = value;
		this.render();
	}
	get person(){
		return this._person;
	}
	connected(){
		this.render();
	}
	render(){
		return this.html`<div style="${containerStyle}">
			<h1 style="flex : 1;">
				<a style="text-decoration:none; color: inherit" href="/">Checkin</a>
			</h1>
			${this.person
				? html`<span style="margin : 1rem;">${this.person.name()}</span>
						<img style="${avatarStyles}" src="${this.person.avatarUrl()}" />`
				: ''}
		</div>`
	}
});

