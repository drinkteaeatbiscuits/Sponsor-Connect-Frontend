import { useQuery, useQueryClient } from 'react-query';


const useProfile = ( profileId?: any, slug?: any ) => {

	const client = useQueryClient();

	let query = /profiles/ + profileId;

	if(slug){
		query = '/profiles?slug=' + slug;
	}

	
	return useQuery(
	  ["profile", profileId ? parseInt(profileId) : slug],
	  async() => {
		
		

			const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + query, {
			credentials: "include",
			});
			
			const post = await response.json();
	

			// client.setQueryData(["profiles", post.id], post);
			if(slug){
				return post[0];
			}else{
				return post;
			}
			
		
	  }	  
	)
  }

  export default useProfile;