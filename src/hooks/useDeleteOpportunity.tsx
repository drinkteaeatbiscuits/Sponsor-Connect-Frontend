import { useMutation, useQueryClient } from 'react-query';

const useDeleteOpportunity = ( opportunityId: any ) => {
  
    const client = useQueryClient();
    
    return useMutation(
      "opportunity",
      async () => {
  
      const opportunityResponse = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/opportunities/" + opportunityId, {
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include",
          method: "DELETE", 
    });
  
        return await opportunityResponse.json();
  
      },
      {
        onSuccess: () => {
            
          client.invalidateQueries("opportunity");
          client.invalidateQueries("opportunities");
        }
      }
    )
  }

  export default useDeleteOpportunity;