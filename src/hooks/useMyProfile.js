import { useQuery, useQueryClient } from 'react-query';


const useMyProfile = (profileId: any = false) => {
	const client = useQueryClient();

	return useQuery(
	
	"my-profile",
	  
	  async() => {
		  
		console.log("in query");

		const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/profiles/me', {
		  credentials: "include",
		});
		
		const profile = await response.json();
  
		// pre load the cache
		// posts.forEach((p: any) => {

		//   client.setQueryData(["profile-" + p.id], p);
		  
		// });

		profileId && client.setQueryData(["my-profile"], profile);
  
		return profile;
	  }
	)
  }

  export default useMyProfile;