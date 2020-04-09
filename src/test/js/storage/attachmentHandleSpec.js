import {square} from '../../../main/storage/attachmentHandler';

var assert = require('assert');
describe('Attachment Handler', function() {
    it('should return -1 when the value is not present', function() {
        assert.equal(square(2), 4);
    });
});