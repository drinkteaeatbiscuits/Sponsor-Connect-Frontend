import { useMutation, useQueryClient } from 'react-query';

import axios from 'axios';


const useDeleteOpportunityImage = ( opportunityId: any ) => {

    const client = useQueryClient();
    
    return useMutation(
      "opportunity",
      async (data: any) => {
    
      axios.delete(
        (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/upload/files/" + data ,  
        {
          withCredentials: true,
        })
        .then(function (response) {

          // console.log(response);
          client.invalidateQueries([ "opportunity " + opportunityId ]);
          // response.json();
        })
        .catch(function (error) {
          console.log(error);
        });

    });
    
  }

  export default useDeleteOpportunityImage;