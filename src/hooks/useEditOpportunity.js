import { useMutation, useQueryClient } from 'react-query';

const useEditOpportunity = ( opportunityId: any ) => {

  // console.log(opportunityId);
  
    const client = useQueryClient();
    
    return useMutation(
      "opportunity-" + opportunityId,
      async (data: { 
          id?: any;
          profile: string;
          title?: string;
          description?: string;
          fullDescription?: string;
          images?: object;
          price?: string;
          slug?: string;
          published_at?: any;
          opportunityDescription?: any;
          expiryDate?: Object;
          opportunityStatus?: string;
        
        }) => {

          // console.log(data);
  
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

          client.setQueryData([ "opportunity-" + data.id ], data);
            
          client.invalidateQueries("opportunity");
          client.invalidateQueries("opportunities");
          
        }
      }
    )
  }

  export default useEditOpportunity;