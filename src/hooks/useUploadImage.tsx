import { useMutation, useQueryClient } from 'react-query';

import axios from 'axios';

const useUploadImage = ( profileId:any, setTheImage:Function, setUploadProgress:Function ) => {

    // console.log(profileId);

    const client = useQueryClient();
    
    return useMutation(
      "uploadedImages",

      async (data: any) => {

      var formdata = new FormData();
      formdata.append( "files", data[0].data, data[0].data.path );
      formdata.append( "ref", data[0].theref );
      formdata.append( "refId", data[0].refId );
      formdata.append( "field", data[0].field ); 
    
      setUploadProgress(0);
      // console.log(formdata);

      await axios.post(
        (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/upload", 
        formdata, 
        {
          withCredentials: true,
          onUploadProgress: progressEvent => setUploadProgress(Math.round( (progressEvent.loaded * 100) / progressEvent.total )),
        })
        .then(function (response) {

          
          client.invalidateQueries("uploadedImages");
          setTheImage(response.data[0]);
          
        })
        .catch(function (error) {

          console.log(error);

        });

        

    });

    
  }

  export default useUploadImage;