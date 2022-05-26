
import { useMutation, useQueryClient } from 'react-query';

import React, { useEffect, useState } from 'react';

const useEditMarketingPreferences = () => {
    
    return useMutation(
      ["marketingPreferences"],
      async ( data ) => {

      const response = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/marketing-preferences", {
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include",
          method: "POST",
          body: JSON.stringify(data), 
    	});
  
        return await response.json();
  
      },
      {
        onSuccess: (theresponse) => {
        
            return theresponse;
          
        }
      }
    )
  }

  export default useEditMarketingPreferences;