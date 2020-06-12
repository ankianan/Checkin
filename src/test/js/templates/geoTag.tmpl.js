import hyperHTML from 'hyperhtml';

export const render = workArea=>({allCheckins = true, isSignedIn = true} = {}) =>
	hyperHTML.bind(workArea)`<geo-tag isSignedIn="${isSignedIn}" 
			   setMessages="${()=>{}}" 
			   allCheckins="${allCheckins}">
		</geo-tag>`;