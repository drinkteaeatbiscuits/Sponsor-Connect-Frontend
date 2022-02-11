import { useInfiniteQuery, QueryClient, QueryClientProvider, useQuery, useQueryClient } from 'react-query';



const useDugoutArticles = ( enabled, page ) => {

  
    const client = useQueryClient(); 
    
    return useInfiniteQuery(
      "articles",
      async ({ pageParam = 0 }) => {
        
        const profilesResponse = await fetch('https://sponsor-connect.com/wp-json/wp/v2/dugout?_embed&page=' + (pageParam + 1), {});

        const articles = await profilesResponse.json();
  
        
          client.setQueryData(["articles"], articles);
     

		    console.log(articles);
  
        return articles;
  
      },
      {
        getPreviousPageParam: firstPage => firstPage.previousId ?? false,
        getNextPageParam: lastPage => lastPage.nextId ?? false,
      }
      
    )
  }

  
  export default useDugoutArticles;