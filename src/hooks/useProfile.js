import { useQuery, useQueryClient } from 'react-query';


const useProfile = ( profileId: any ) => {

	const client = useQueryClient();
	
	return useQuery(
	  ["profile", parseInt(profileId)],
	  async() => {
		
		if(profileId){
		const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/profiles/' + profileId, {
		  credentials: "include",
		});
		
		const post = await response.json();
  

		// client.setQueryData(["profiles", post.id], post);

		return post;
	}
	  }	  
	)
  }

  export default useProfile;