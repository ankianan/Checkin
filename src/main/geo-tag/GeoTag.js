import * as blockstack from 'blockstack';
import * as geolib from 'geolib';
import XHyperElement from '../common/XHyperElement.js';
import hyperHTML from 'hyperhtml';
import page from 'page';
import {storageDetails} from "../storage/fences/Constants";

import * as attachmentHandler from '../storage/attachmentHandler';

const tagIconStyle = {
    padding: "1rem 1rem 0 1rem",
    width: "128px",
    height: "128px",
    margin: "0 auto",
    marginBottom: "1rem"
}

const tagIconImageStyle = {
    width: "100%"
}

const formStyle = {
    display: "flex",
    margin: "0 auto 1rem",
    width: "50%"
}


const inputTextStyle = {
    flex: "1",
    padding: "1rem",
    outline: "none",
    border: "none"
}

const inputSubmitStyle = {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "1rem",
    textDecoration: "none",
    cursor: "pointer",
    width: "5rem",
    outline: "none"
}


customElements.define('geo-tag', class extends XHyperElement {
    constructor() {
        super({
            isSignedIn: Boolean,
            setMessages: Function,
            allCheckins: Boolean
        });
        this.state = {
            "newFence": {
                "lat": 0,
                "long": 0,
                "radius": 1000,
                "tags": {
                    "messages": [],
                    "attachments": []
                }
            },
            "tagged": {
                "messages": []
            },
            "loading": true
        };
        this.fences = [];
    }

    async connectedCallback() {
        this.render();
        const positionPromise = this.getPosition();
        if (this.props.isSignedIn) {
            this.loadGeoTags(positionPromise);
        }
    }

    loadGeoTags(positionPromise) {
        Promise.all([this.getFences(), positionPromise]).then((values) => {
            if(values[0]){
                this.fences = JSON.parse(values[0]);
            }

            this.setState({
                loading: false
            });
            this.showTags();
        });
    }

    componentDidUpdate(previousProps, previousState) {
        if (previousProps.allCheckins != this.props.allCheckins) {
            this.showTags();
        }
        if (this.state.tagged && this.state.tagged.messages != previousState.tagged.messages) {
            this.props.setMessages(this.state.tagged.messages);
        }
    }

    onMessageInputChange() {
        return (event) => {
            this.setState({
                newFence: Object.assign(this.state.newFence, {
                    tags: Object.assign(this.state.newFence.tags, {
                        messages: [event.target.value]
                    })
                })
            });
        }
    }

    onAttachmentChange() {
        return async (event) => {
            const publicURL = await attachmentHandler.upload(event);
            this.setState({
                newFence: Object.assign(this.state.newFence, {
                    tags: Object.assign(this.state.newFence.tags, {
                        attachments: [publicURL]
                    })
                })
            });
        }
    }

    async createFence(event) {
        if (this.props.isSignedIn) {
            let position = await this.getPosition()
            let clone_newFence = JSON.parse(JSON.stringify(this.state.newFence));
            this.fences.push(clone_newFence);

            await blockstack.putFile(storageDetails.fileName, JSON.stringify(this.fences), storageDetails.options,).then(() => {
                event.target.reset();
                this.showTagsForPosition(position);
                page('/nearby');
            })
        } else {
            document.body.classList.add('notifySignin');
            setTimeout(() => {
                document.body.classList.remove('notifySignin');
            }, 1000)
        }
    }

    async getFences() {
        let fences = await blockstack.getFile(storageDetails.fileName, storageDetails.options)
        return fences;
    }

    async getPosition() {
        const position = await new Promise(resolve => navigator.geolocation.getCurrentPosition(resolve));
        let _position = {
            "lat": position.coords.latitude,
            "long": position.coords.longitude
        };
        this.setState({
            newFence: Object.assign(this.state.newFence, _position)
        });

        return _position;

    }

    /**
     * [showTags Should all or nearby checkins based on this.props.allCheckins]
     * @return {[type]} [description]
     */
    showTags() {
        if (this.props.allCheckins) {
            this.showTagsForAllPositions();
        } else {
            this.showTagsForLastPositions();
        }
    }

    showTagsForAllPositions() {
        let messages = [];

        //Iterate all fences
        this.fences.forEach((fence) => {
            //Display messages of fence, in which user is standing
            messages.push(fence.tags)
        });

        this.setState({
            tagged: {
                messages
            }
        });
    }

    showTagsForPosition(position) {
        let messages = [];

        //Iterate all fences
        this.fences.forEach((fence) => {
            //Check if position in this fence
            if (this.isPositionInFence(position, fence)) {
                //Display messages of fence, in which user is standing
                messages.push(fence.tags)
            }
        });

        this.setState({
            tagged: {
                messages
            }
        });
    }

    showTagsForLastPositions() {
        const {lat, long} = this.state.newFence;
        this.showTagsForPosition({lat, long});
    }

    isPositionInFence(postion, fence) {
        const distance = geolib.getDistance(
            {latitude: postion.lat, longitude: postion.long},
            {latitude: fence.lat, longitude: fence.long}
        );

        if (distance < fence.radius) {
            return true;
        }
        return false;
    }

    render() {
        return this.html`<div>
				<div style=${tagIconStyle}>
					<img src="https://image.flaticon.com/icons/png/128/252/252025.png" style="${tagIconImageStyle}" /> 
				</div>
				<div style="margin-bottom:1rem;text-align:center">
					latitude : ${this.state.newFence.lat}, longitude : ${this.state.newFence.long}</div>
				<form style="${formStyle}" action="javascript:void(0)" name="newFence" onsubmit="${this.createFence.bind(this)}" novalidate="${!this.props.isSignedIn}">
						<div style="background:white;">
							<input type="text" style="${inputTextStyle}" name="message" placeholder="Write a message" value="${this.state.newFence.tags.messages[0]}" onchange="${this.onMessageInputChange()}" required />
							<input type="file" onchange="${this.onAttachmentChange()}" accept="image/png, image/jpeg">
						</div>
						
						<input name="createFence" type="submit" style="${inputSubmitStyle}" value="Post" />
				</form>
				
			</div>`;
    }
});