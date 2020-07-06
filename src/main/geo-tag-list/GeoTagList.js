import hyperHTML from 'hyperhtml';
import './css/geo-tag-list.css';
import XHyperElement from '../common/XHyperElement.js';
import '../lazy-image/LazyImage';

const html = (...args)=>hyperHTML.wire()(...args);

const defaultProps = {
	messages : [],
	loading: false
};

customElements.define('geo-tag-list', class extends XHyperElement{
	constructor(){
		super({
			messages : Array,
			loading : Boolean
		});
	}
	render(){
		return this.html`<div class="geoTagList">
			<h4 class="geoTagList__count">
				${this.props.messages.length==0
					?this.props.loading?'Loading...': 'No checkins done'
					:`${('0'+this.props.messages.length).slice(-2)} checkins found`
				}
			</h4>
			${this.props.messages.map((tag)=>{
				return html`<div class="geoTagList__item">
								<h4>${tag.messages[0]}</h4>
								${tag.attachments && tag.attachments[0]?html`<lazy-image filename="${tag.attachments[0]}"></lazy-image>`:''}
							</div>`;
			})}
		</div>`;
	}
});