import * as TestUtil from "../../util/TestUtil";
import fences from "../../data/fences";
import {getFences} from "../../data/fencesAtPosition";
import * as blockstack from 'blockstack';
import {render} from '../../templates/geoTag.tmpl.js';
import sinon from 'sinon';

import assert from 'assert';

describe('Geo Tag Spec', function() {
    let workArea = null;

    beforeEach(()=>{
        workArea = TestUtil.getWorkArea();

        sinon.replace(navigator.geolocation,'getCurrentPosition', async (callback)=>callback({
            coords: {
                latitude: 0,
                longitude: 0
            }
        }));



    });

    afterEach(()=>{
        sinon.restore();
        TestUtil.unload();
    });

    it('should be able to load all fences', async ()=>{
        sinon.replace(blockstack, 'getFile', async ()=>JSON.stringify(getFences()));
        render(workArea)();
        let node = workArea.firstElementChild;
        await  TestUtil.eventually(()=>{
            assert.equal(node.state.tagged.messages.length, 2);
        });
    });

    it('should be able to load nearby fences', async ()=>{
        sinon.replace(blockstack, 'getFile', async ()=>JSON.stringify(fences));
        render(workArea)({
            allCheckins: false
        });
        let node = workArea.firstElementChild;
        await  TestUtil.eventually(()=>{
            assert.equal(node.state.tagged.messages.length, 2);
        });
    });


});


