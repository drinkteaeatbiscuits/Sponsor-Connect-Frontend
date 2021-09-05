import { useMutation, useQueryClient } from 'react-query';

const useAddOpportunity = () => {
  
    const client = useQueryClient();
    
    return useMutation(
      "opportunities",
      async (data: { 
          profile: string;
          title?: string;
          description?: string;
          fullDescription?: string;
          images?: object;
          price?: string;
        
        }) => {
  
      const opportunityResponse = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/opportunities", {
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include",
          method: "POST",
          body: JSON.stringify(data), 
    });
  
        return await opportunityResponse.json();
  
      },
      {
        onSuccess: (data) => {
            // console.log(client);
          client.invalidateQueries("opportunities");
        }
      }
    )
  }

  export default useAddOpportunity;