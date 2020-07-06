import XHyperElement from "../common/XHyperElement";
import * as attachmentHandler from "../storage/attachmentHandler";
import './css/lazy-image.css';

customElements.define('lazy-image', class extends XHyperElement {
    constructor(){
        super({
            'filename': String
        })

        this.state = ({
            src: ''
        });

        setTimeout(async ()=>{
            const newSrc = await attachmentHandler.getFile(this.props.filename);
            this.setState({
                src: newSrc
            });
        });
    }
    render() {
        return this.html`<img src="${this.state.src}">`;
    }
});