import { useMutation, useQueryClient } from 'react-query';

const useEditOpportunity = ( opportunityId: any ) => {

  // console.log(opportunityId);
  
    const client = useQueryClient();
    
    return useMutation(
      "opportunity",
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
        
        }) => {

          console.log(data);
  
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
            
          client.invalidateQueries("opportunity");
          client.invalidateQueries("opportunities");
          
        }
      }
    )
  }

  export default useEditOpportunity;