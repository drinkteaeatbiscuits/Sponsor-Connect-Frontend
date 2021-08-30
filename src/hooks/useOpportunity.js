import { useQuery, useQueryClient } from 'react-query';

const useOpportunity = ( id:any ) => {

    const client = useQueryClient();

	
    
    return useQuery(
      "opportunity",
      async () => {
        // const response = await fetch(process.env.REACT_APP_API_URL + "/profiles");

		if(id){

			const opportunityResponse = await fetch(process.env.REACT_APP_API_URL + "/opportunities/" + id, {
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