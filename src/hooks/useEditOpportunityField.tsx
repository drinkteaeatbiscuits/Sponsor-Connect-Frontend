import { useMutation, useQueryClient } from 'react-query';

import { AuthContext } from "../App";
import React, { useEffect, useState } from 'react';

const useEditOpportunityField = ( opportunityId: any ) => {
  
    const client = useQueryClient();

    const { dispatch } = React.useContext(AuthContext);
    
    return useMutation(
      "opportunity-" + opportunityId,
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

          fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/update-profile-completion", {
              method: "POST",
              credentials: "include",
            }).then((response) => {

              return response.json();
            
            }).then((data) => {

              // console.log(data.profileComplete);

              dispatch && dispatch({
                type: "updateProfileComplete",
                payload: data.profileComplete
              });

            });
            
          client.invalidateQueries("opportunity-" + opportunityId);
          client.invalidateQueries("opportunities");
          
        }
      }
    )
  }

  export default useEditOpportunityField;