import { useMutation, useQueryClient } from 'react-query';

const useEditProfileField = ( profileId: any ) => {
  
    const client = useQueryClient();
    
    return useMutation(
      ["profile", profileId],
      async ( data ) => {

      console.log(data);
  
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

          // console.log(data);
          client.setQueryData(["profile", profileId], theresponse);
          // client.invalidateQueries("profile-" + profileId);
          // client.invalidateQueries("my-profile");
          client.invalidateQueries(["profile"]);
          
        }
      }
    )
  }

  export default useEditProfileField;