import { useMutation, useQueryClient } from 'react-query';

const useEditOpportunityField = ( opportunityId: any ) => {
  
    const client = useQueryClient();
    
    return useMutation(
      "opportunity",
      async ( data ) => {
  
      const opportunityResponse = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/opportunities/" + opportunityId, {
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include",
          method: "PUT",
          body: JSON.stringify(data), 
    	});
  
        return await opportunityResponse.json();
  
      },
      {
        onSuccess: (data) => {
            
          client.invalidateQueries("opportunity " + opportunityId);
          client.invalidateQueries("opportunities");
          
        }
      }
    )
  }

  export default useEditOpportunityField;