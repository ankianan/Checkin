import hyperHTML from 'hyperhtml';

export const render = workArea=> {
	return hyperHTML.bind(workArea)
			`<geo-tag isSignedIn="${true}" 
				   setMessages="${()=>{}}" 
				   allCheckins="${true}">
			</geo-tag>`;
}