import { useQuery, useQueryClient } from 'react-query';


const useMySubscription = () => {
	const client = useQueryClient();
	return useQuery(
	  "mySubscription",
	  async() => {
		console.log("in query");
		const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/subscriptions/my-subscription', {
		  credentials: "include",
		});
		
		const posts = await response.json();
  
		// pre load the cache
		posts.forEach((p: any) => {
		  client.setQueryData(["mySubscription", p.id], p);
		});
  
		return posts;
	  }
	)
  }

  export default useMySubscription;