import { useMutation, useQueryClient } from 'react-query';

const useCancelMySubscription = () => {

	const client = useQueryClient();
	  
	  return useMutation(
		"mySubscription",
		async () => {
  
		const subscriptionResponse = await fetch(process.env.REACT_APP_API_URL + "'/subscriptions/cancel-subscription", {
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			method: "POST", 
		});
	
		  return await subscriptionResponse.json();
	
		},
		{
		  onSuccess: () => {
			client.invalidateQueries("mySubscription");
		  }
		}
	  )
   
  }

  export default useCancelMySubscription;