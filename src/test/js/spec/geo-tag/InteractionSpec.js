import * as TestUtil from "../../util/TestUtil";
import * as fences_stub from "../../stubs/create_fence_stub";
import * as fences from "../../data/fencesAtPosition";
import * as blockstack from 'blockstack';
import {storageDetails} from '../../../../main/storage/fences/Constants';
import {render} from '../../templates/geoTag.tmpl.js';
import sinon from 'sinon';
import {getWorkArea} from "../../util/TestUtil";

var assert = require('assert');
describe('Geo Tag Spec', function() {
    let node = null,
        state = null,
        putFileSpy = sinon.spy(),
        workArea = null;

    beforeEach(()=>{
        workArea = TestUtil.getWorkArea();
        render(workArea)({isSignedIn: false});
        node = workArea.firstElementChild;
        state = node.state;

        sinon.replace(navigator.geolocation,'getCurrentPosition', async (callback)=>callback({
            coords: {
                latitude: 0,
                longitude: 0
            }
        }));
        
        putFileSpy = sinon.spy();
        sinon.replace(blockstack, 'putFile', async ()=>putFileSpy());

    });

    afterEach(()=>{
        sinon.restore();
        TestUtil.unload();
    });

    it('should have initial state as expected', ()=> {
        assert.deepEqual(state, fences_stub.untaggedFence);
    });

    it('Should show nearby checking id props.allCheckins is false', ()=> {
        const showTagsForLastPositionsSpy = sinon.spy(node, 'showTagsForLastPositions');
        assert.equal(showTagsForLastPositionsSpy.called, false);

        render(workArea)({allCheckins: false});

        assert.equal(showTagsForLastPositionsSpy.called, true);
    })

    it('should allow creating tagged fences', async ()=> {
        render(workArea)({isSignedIn: true});
        node.setState(fences_stub.textTaggedFence);
        document.forms.newFence.elements.createFence.click();
        await new Promise(resolve=>setTimeout(resolve,1000));
        assert.equal(true, putFileSpy.called);
    });

    it('should not allow creating tagged fences if not logged in', async ()=> {
        render(workArea)({isSignedIn: false});
        node.setState(fences_stub.textTaggedFence);
        document.forms.newFence.elements.createFence.click();
        await new Promise(resolve=>setTimeout(resolve,1000));
        assert.equal(false, putFileSpy.called);
    });
});


