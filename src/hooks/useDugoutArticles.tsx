import { useQuery, useQueryClient } from 'react-query';



const useDugoutArticles = ( enabled ) => {

  
    const client = useQueryClient();
    
    return useQuery(
      "articles",
      async () => {
        
        const profilesResponse = await fetch("https://sponsor-connect.com/wp-json/wp/v2/dugout?_embed", {});

        const articles = await profilesResponse.json();
  
        
          client.setQueryData(["articles"], articles);
     

		    // console.log(profiles);
  
        return articles;
  
      },
      enabled
    )
  }

  
  export default useDugoutArticles;