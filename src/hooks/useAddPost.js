import { useMutation, useQueryClient } from 'react-query';

const useAddPost = () => {
  
    const client = useQueryClient();
    
    return useMutation(
      "news-feed",
      async (data: { 
          newsTitle: string;
          newsDescription?: string;
          newsLink?: string;
          newsDate?: any;
          published_at?: any;
        
        }) => {
  
      const response = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/news-articles", {
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
        onSuccess: (data) => {
            // console.log(client);
        

          client.invalidateQueries("news-feed");
          
          return data;

        }
      }
    )
  }

  export default useAddPost;