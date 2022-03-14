import { useMutation, useQueryClient } from 'react-query';

const useEditProfileField = ( profileId: any ) => {
  
    const client = useQueryClient();
    
    return useMutation(
      ["profile", profileId],
      async ( data ) => {

  
      const response = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/profiles/me", {
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include",
          method: "PUT",
          body: JSON.stringify(data), 
    	});
  
        return await response.json();
  
      },
      {
        onSuccess: (theresponse) => {

          client.setQueryData(["profile", profileId], theresponse);
          client.invalidateQueries(["profile"]);
          
        }
      }
    )
  }

  export default useEditProfileField;