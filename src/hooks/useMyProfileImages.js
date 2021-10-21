import { useQuery, useQueryClient } from 'react-query';


const useMyProfileImages = () => {
	const client = useQueryClient();
	
	return useQuery(
	  "profileImages",
	  async() => {
		console.log("in query");

		const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/profiles/me', {
		  credentials: "include",
		});
		
		const posts = await response.json();
  
		

		client.setQueryData("profileImages", posts[0].images);

		
  
		return posts[0].images;
	  }
	)
  }

  export default useMyProfileImages;