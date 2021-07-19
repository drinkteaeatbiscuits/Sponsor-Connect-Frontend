import { useMutation, useQueryClient } from 'react-query';

const useAddImagePost = () => {
  
    const client = useQueryClient();
    
    return useMutation(
      "imagePosts",
      async (data: { dtebText: string; }) => {
        
        // console.log(data.dtebText);
  
      const URL = "https://app.api.dteb.io";
  
      const imagePostResp = await fetch(URL + "/tests", {
          headers: {
              "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({ dtebText: data.dtebText }), 
    });
  
        return await imagePostResp.json();
  
      },
      {
        onSuccess: (data) => {
          client.invalidateQueries("imagePosts");
  
          // console.log(client);
          // console.log(data.id);
          
        }
      }
    )
  }

  export default useAddImagePost;