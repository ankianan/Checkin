const defaultProps = {}
import hyperHTML from 'hyperhtml';

export default class XHyperElement extends HTMLElement{
	constructor(propTypes){
		super();
		this.props = {};
		this.state = {};
		this.html = hyperHTML.bind(this);	

		for(let key in propTypes){
			Object.defineProperty(this, key, {
			    set: function(value) {
			    	let previousProps = Object.assign({}, this.props);
			    	const isNotInitialRender = key in this.props;
			        this.props = Object.assign({}, this.props, {[key]:value});
			        if(isNotInitialRender){
			        	this.render();
			        	this.notifyUpdate(previousProps, this.state);	
			        }
			    }
			});
		}
	}
	setState(newState){
		let previousState = Object.assign({}, this.state);
		this.state = Object.assign({}, this.state, newState);
		this.render();	
		this.notifyUpdate(this.props, previousState);
	}
	notifyUpdate(previousProps, previousState){
 		this.componentDidUpdate(previousProps, previousState);
	}
	componentDidUpdate(previousProps, previousState){}
	connectedCallback(){
		this.render();
	}
}