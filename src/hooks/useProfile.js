import { useQuery, useQueryClient } from 'react-query';


const useProfile = ( profileId ) => {
	const client = useQueryClient();
	return useQuery(
	  "profile",
	  async() => {
		console.log("in query");
		const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/profiles/' + profileId, {
		  credentials: "include",
		});
		
		const post = await response.json();
  

		client.setQueryData(["profile", post.id], post);

		// pre load the cache
		// posts.forEach((p: any) => {
		//    
		// });
  
		return post;
	  }
	)
  }

  export default useProfile;