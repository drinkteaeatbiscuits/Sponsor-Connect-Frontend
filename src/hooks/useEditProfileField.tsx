import { useMutation, useQueryClient } from 'react-query';

import React, { useEffect, useState } from 'react';

import { AuthContext } from "../App";

const useEditProfileField = ( profileId: any ) => {
  
    const client = useQueryClient();

    const { dispatch } = React.useContext(AuthContext);
    
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


          fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/update-profile-completion", {
            method: "POST",
            credentials: "include",
          }).then((response) => {

            return response.json();
          
          }).then((data) => {

            // console.log(data.profileComplete);

            dispatch && dispatch({
              type: "updateProfileComplete",
              payload: { 
                profileComplete: data.profileComplete, 
                profileCompletionList: data.profileCompletionList 
              }
            });

          });
          
        }
      }
    )
  }

  export default useEditProfileField;