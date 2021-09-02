import { useMutation, useQueryClient } from 'react-query';

const useAddImagePost = () => {
  
    const client = useQueryClient();
    
    return useMutation(
      "imagePosts",
      async (data: { dtebText: string; }) => {
        

  
      const imagePostResp = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/tests", {
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
  

          
        }
      }
    )
  }

  export default useAddImagePost;