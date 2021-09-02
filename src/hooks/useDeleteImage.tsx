import { useMutation, useQueryClient } from 'react-query';

import axios from 'axios';

const useDeleteImage = () => {

    const client = useQueryClient();
    
    return useMutation(
      "uploadedImages",
      async (data: any) => {
    
      axios.delete(
        (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/upload/files/" + data ,  
        {
          withCredentials: true,
        })
        .then(function (response) {

          // console.log(response);
          client.invalidateQueries("imagePosts");
          // response.json();
        })
        .catch(function (error) {
          console.log(error);
        });

    });
    
  }

  export default useDeleteImage;