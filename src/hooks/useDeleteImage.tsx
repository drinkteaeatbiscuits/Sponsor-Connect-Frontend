import { useMutation, useQueryClient } from 'react-query';

import axios from 'axios';

const useDeleteImage = (id) => {

    const client = useQueryClient();
    
    return useMutation(
      ["profile", id],
      async (data: any) => {
    
      axios.delete(
        (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/upload/files/" + data ,  
        {
          withCredentials: true,
        })
        .then(function (response) {

          // console.log(response);
          
          // response.json();

          // console.log('deleted image');

            fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/update-profile-completion", {
							method: "POST",
							credentials: "include",
						}).then(() => {
              client.invalidateQueries(["profile"]);
              client.invalidateQueries(["profile", id]);
            });

            

        })
        .catch(function (error) {
          console.log(error);
        });

    });
    
  }

  export default useDeleteImage;