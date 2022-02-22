import { useQuery, useQueryClient } from 'react-query';



const useDugoutArticle = ( enabled, slug ) => {

  // console.log(enabled);

    const client = useQueryClient();
    
    return useQuery(
      ["article", slug],
      async () => {
        
        const profilesResponse = await fetch("https://sponsor-connect.com/wp-json/wp/v2/dugout?slug=" + slug, {});

        const article = await profilesResponse.json();
  
        
          client.setQueryData(["article", article[0].slug ], article);
     

		    // console.log(profiles);
  
        return article;
  
      },
      enabled
    )
  }

  
  export default useDugoutArticle;