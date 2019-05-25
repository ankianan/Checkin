const defaultProps = {}
import hyperHTML from 'hyperhtml';

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

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
			        	this._render();
			        	this.notifyUpdate(previousProps, this.state);	
			        }
			    }
			});
		}
		this._render = debounce(this._render.bind(this),10)
	}
	setState(newState){
		let previousState = Object.assign({}, this.state);
		this.state = Object.assign({}, this.state, newState);
		this._render();	
		this.notifyUpdate(this.props, previousState);
	}
	notifyUpdate(previousProps, previousState){
 		this.componentDidUpdate(previousProps, previousState);
	}
	componentDidUpdate(previousProps, previousState){}
	connectedCallback(){
		this._render();
	}
	render(){
		throw new Error("To be defined by component");	
	}
	_render(){
		requestAnimationFrame(()=>{
			this.render();
		})
	}

}