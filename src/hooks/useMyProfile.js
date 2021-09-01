import { useQuery, useQueryClient } from 'react-query';


const useMyProfile = () => {
	const client = useQueryClient();
	return useQuery(
	  "profiles",
	  async() => {
		console.log("in query");
		const response = await fetch(process.env.REACT_APP_API_URL + '/profiles/me', {
		  credentials: "include",
		});
		
		const posts = await response.json();
  
		// pre load the cache
		posts.forEach((p: any) => {
		  client.setQueryData(["profiles", p.id], p);
		});
  
		return posts;
	  }
	)
  }

  export default useMyProfile;