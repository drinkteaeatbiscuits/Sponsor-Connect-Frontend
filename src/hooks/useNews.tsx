import { useQuery, useQueryClient } from 'react-query';


const useNews = () => {


    const client = useQueryClient(); 
    
    return useQuery(
      ["news"],
      async () => {
        
        const response = await fetch('https://sponsor-connect.com/wp-json/wp/v2/posts?_embed', {})
          
  
        if(response){
     
        }
        
       
        const newsArticles = await response.json();
        
        client.setQueryData(["news"], newsArticles);
 
		    // console.log(articles);
  
        return newsArticles;
  
      }
      
    )
  }

  
  export default useNews;