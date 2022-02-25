import { useQuery, useQueryClient } from 'react-query';
import React from 'react';
import { AuthContext } from "../App";


const useMyProfile = (profileId: any = false) => {
	const client = useQueryClient();

	const { state: authState } = React.useContext(AuthContext);

	// console.log(authState?.user?.accountType);

	// if( authState?.user?.accountType === "Business" ) {
	// 	return 
	// }

	return useQuery(
	
	["profile", profileId],
	  
	  async() => {
		  
		// console.log("in query");

		const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/profiles/me', {
		  credentials: "include",
		});
		
		const profile = await response.json();
  
		// pre load the cache
		// posts.forEach((p: any) => {

		//   client.setQueryData(["profile-" + p.id], p);
		  
		// });

		profileId && client.setQueryData(["profile", profileId], profile);
  
		return profile;
	  }
	)
  }

  export default useMyProfile;