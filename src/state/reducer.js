import { combineReducers } from 'redux';
import * as actions from "./actions.js";

export const locations = (state = [], action) => {
	switch (action.type) {
		case actions.LOAD_TAGS: 
			return action.tags.map((tag) => {
				return {
					"lat" : tag.lat,
					"long" : tag.long
				};
			});
		default:
		  return state;
	}
}

export const tags = (state = {}, action) => {
	switch (action.type) {
		case actions.LOAD_TAGS:
			return action.tags.map((tag) => {
				const {lat, long, ...exceptLocation} = tag;
				return exceptLocation;
			});
		default:
		  return state;
	}
}

export default combineReducers({
  locations,
  tags
})