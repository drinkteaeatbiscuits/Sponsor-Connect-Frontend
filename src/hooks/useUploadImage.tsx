import { useMutation, useQueryClient } from 'react-query';

const useUploadImage = (profileId:any, field:any, ref:any ) => {

    // console.log(profileId);

    const client = useQueryClient();
    
    return useMutation(
      "uploadedImages",
      async (data: any) => {


      var formdata = new FormData();
      formdata.append( "files", data, data.path );
      formdata.append( "ref", ref );
      formdata.append( "refId", profileId );
      formdata.append( "field", field );
    
      const imagePostResp = await fetch(process.env.REACT_APP_API_URL + "/upload", {
        credentials: "include",
        method: "POST",
        body: formdata 
        });
  
        return await imagePostResp.json();
  
      },
      {
        onSuccess: (data) => {
          client.invalidateQueries("imagePosts");
  
          // console.log(client);
          // console.log(data);
          
        }
      }
    )
  }

  export default useUploadImage;