import { useQuery, useQueryClient, useMutation } from 'react-query';

import React, { useEffect, useState } from 'react';

const useMySubscription = (refetchInterval) => {

	// const [refetchIntervalState, setRefetchIntervalState] = useState(refetchInterval);

	// useEffect(() => {
	// 	setRefetchIntervalState(refetchInterval)
	// }, [refetchInterval]);


	// console.log(refetchIntervalState);

	const client = useQueryClient();

	// const addMutation = useMutation(value => fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/subscriptions/my-subscription', {
	// 	credentials: "include",
	//   }), {
	// 	onSuccess: () => client.invalidateQueries("mySubscription"),
	//   });

	return useQuery(
	  "mySubscription",

	  async () => {
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
	  },
	  {
		  refetchInterval: refetchInterval
	  }
	  
	  
	)
  }

  export default useMySubscription;