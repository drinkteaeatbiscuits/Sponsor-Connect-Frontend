
import { useQuery, useQueryClient } from 'react-query';

const useImagePosts = () => {
    const client = useQueryClient();
    
    return useQuery(
      "imagePosts",
      async () => {
        console.log('in query');
        const response = await fetch("http://app.api.dteb.io/tests");
        const posts = await response.json();
  
        posts.forEach((p:any) => {
          client.setQueryData(["posts", p.id], p);
        });
  
        return posts;
  
      }
    )
  }

  
  export default useImagePosts;