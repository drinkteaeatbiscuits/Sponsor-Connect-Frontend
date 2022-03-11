import { useQuery, useQueryClient, useMutation } from 'react-query';

import React, { useEffect, useState } from 'react';

const useMySubscription = (refetchInterval) => {

	const client = useQueryClient();

	return useQuery(
	  "mySubscription",

	  async () => {
		// console.log("in query");
		const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/subscriptions/my-subscription', {
		  credentials: "include",
		});
		
		const posts = await response.json();
  
		client.setQueryData(["mySubscription"], posts);
  
		return posts;
	  },
	  {
		  refetchInterval: refetchInterval
	  }
	  
	  
	)
  }

  export default useMySubscription;