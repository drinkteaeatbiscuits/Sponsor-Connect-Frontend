import { useQuery, useQueryClient } from 'react-query';


const usePayments = () => {
	const client = useQueryClient();
	return useQuery(
	  "userPayments",
	  async() => {

		console.log("in query");
		
		const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/previous-payments', {
		  credentials: "include",
		  method: "POST",
		});
		
		const userPayments = await response.json();

		client.setQueryData(["userPayments"], userPayments);
  
		return userPayments;
	  }
	)
  }

  export default usePayments;