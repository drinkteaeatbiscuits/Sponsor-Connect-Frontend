import { useMutation, useQueryClient } from 'react-query';

const useEditPost = ( postId: any ) => {

  // console.log(opportunityId);
  
    const client = useQueryClient();
    
    return useMutation(
      "post-" + postId,
      async (data: { 
        id?: any;
        newsTitle: string;
        newsDescription?: string;
        newsLink?: string;
        newsDate?: any;
        published_at?: any;
        
        }) => {

          // console.log(data);
  
        const response = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/news-articles/" + postId, {
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include",
          method: "PUT",
          body: JSON.stringify(data), 
        });
  
        return await response.json();
  
      },
      {
        onSuccess: (data) => {

          client.setQueryData([ "post-" + data.id ], data);
            
          client.invalidateQueries("post");
          client.invalidateQueries("posts");
          
        }
      }
    )
  }

  export default useEditPost;