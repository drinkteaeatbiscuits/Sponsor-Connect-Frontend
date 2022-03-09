import { useQuery, useQueryClient } from 'react-query';


const usePrices = (currency) => {

	const client = useQueryClient();
	return useQuery(
	  "prices",
	  async() => {
		console.log("in query");
		const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/subscriptions/prices', {
		  	method: "POST",
			credentials: "include",
			body: JSON.stringify({currency: currency})
		});
		
		const subscriptionPrices = await response.json();

		client.setQueryData(["prices"], subscriptionPrices);
  
		return subscriptionPrices;
	  }
	)
  }

  export default usePrices;