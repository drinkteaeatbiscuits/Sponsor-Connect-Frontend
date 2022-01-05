import { useQuery, useQueryClient } from 'react-query';

const useNewsFeed = () => {
    const client = useQueryClient();
    
    return useQuery(
      "news-feed",
      async () => {

        const newsResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/news-articles", {
            credentials: 'include'
        });


        const newsArticles = await newsResponse.json();
  
        // newsArticles.forEach((p:any) => {
        //   client.setQueryData(["news-feed", p.id], p);
        // });

        client.setQueryData(["news-feed"], newsArticles);
		    // console.log(profiles);
  
        return newsArticles;
  
      }
    )
  }

  
  export default useNewsFeed;