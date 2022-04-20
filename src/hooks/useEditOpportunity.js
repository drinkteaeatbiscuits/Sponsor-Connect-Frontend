import { useMutation, useQueryClient } from 'react-query';
import { AuthContext } from "../App";
import React, { useEffect, useState } from 'react';

const useEditOpportunity = ( opportunityId: any ) => {

  // console.log(opportunityId);

    const { dispatch } = React.useContext(AuthContext);
  
    const client = useQueryClient();
    
    return useMutation(
      ["opportunity", opportunityId],
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



          client.setQueryData([ "opportunity", data.id ], data);
            
          // client.invalidateQueries("opportunity");
          client.invalidateQueries("opportunities");
          
        }
      }
    )
  }

  export default useEditOpportunity;