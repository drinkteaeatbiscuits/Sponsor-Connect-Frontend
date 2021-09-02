import { useQuery, useQueryClient } from 'react-query';

const useOpportunity = ( id:any ) => {

    const client = useQueryClient();

	
    
    return useQuery(
      "opportunity",
      async () => {

		if(id){

			const opportunityResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/opportunities/" + id, {
				credentials: 'include'
			});
	
			// console.log(opportunityResponse);
	
			const opportunity = await opportunityResponse.json();
			
			client.setQueryData(["opportunity", opportunity.id], opportunity);
	
		   
	  
			return opportunity;
		}
        
  
      }
    )
  }

  
  export default useOpportunity;