import { useInfiniteQuery, QueryClient, QueryClientProvider, useQuery, useQueryClient } from 'react-query';



const useDugoutArticles = ( page, setTotalPages, setTotalPosts ) => {

  
    const client = useQueryClient(); 
    
    return useQuery(
      ["articles", page],
      async ({ pageParam = page }) => {
        
        const response = await fetch('https://sponsor-connect.com/wp-json/wp/v2/dugout?_embed&page=' + (pageParam), {})
          
    

        if(response){
          setTotalPages( response.headers.get("X-WP-TotalPages") );
          setTotalPosts( response.headers.get("X-WP-Total") );
        }
        
       

        const articles = await response.json();
        
        client.setQueryData(["articles", page], articles);
     
 
		    // console.log(articles);
  
        return articles;
  
      }
      
    )
  }

  
  export default useDugoutArticles;