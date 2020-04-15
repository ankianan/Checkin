import * as TestUtil from "../../util/TestUtil";
import * as fences_stub from "../../stubs/fences_stub";
import hyperHTML from "hyperhtml";
import * as blockstack from 'blockstack';
import sinon from 'sinon';
import {storageDetails} from '../../../../main/storage/fences/Constants';


var assert = require('assert');
describe('Geo Tag Spec', function() {
    let node = null,
        state = null;

    beforeEach(()=>{
        const workArea = TestUtil.getWorkArea();

        hyperHTML.bind(workArea)`<geo-tag 
						 isSignedIn="${true}" 
						 setMessages="${()=>{}}" 
						 allCheckins="${true}">
				</geo-tag>`;

        node = workArea.firstElementChild;
        state = node.state;
    });

    afterEach(()=>{
        TestUtil.unload();
    });

    it('should have initial state as expected', ()=> {
        assert.deepEqual(state, fences_stub.untaggedFence);
    });

    it('should allow creating tagged fences', async ()=> {
        node.setState(fences_stub.taggedFenceOnlyText);

        const putFileSpy = sinon.spy(blockstack, "putFile");

        document.forms.newFence.elements.createFence.click();
        await new Promise(resolve => setTimeout(resolve,1000));
        assert.equal(true, putFileSpy.called);

    });
});