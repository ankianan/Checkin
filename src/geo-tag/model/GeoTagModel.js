import { Model } from 'radiks';

export default class GeoTag extends Model {
  /*static className = 'GeoTag';
  static schema = {
		"lat" : Number,
		"long" : Number,
		"radius" : Number,
		"tag-message" : String
	}*/
};

GeoTag.className = 'GeoTag';
GeoTag.schema = {
	"lat" : Number,
	"long" : Number,
	"radius" : Number,
	"tag-message" : String,
	"tag-message-decrypt" : {
      type: String,
      decrypted: true
    }
};