import { useQuery, useQueryClient } from 'react-query';

const useOpportunities = ( profileId ) => {

  // console.log(profileId);

    const client = useQueryClient();
    
    return useQuery(
      "opportunities-" + profileId,
      async () => {
        
        const opportunitiesResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/opportunities?profile=" + profileId, {
            credentials: 'include'
        });

        const opportunities = await opportunitiesResponse.json();
  
        opportunities.forEach((p:any) => {
          client.setQueryData(["opportunity-" + p.id], p);
        });

        client.setQueryData(["opportunities-" + profileId], opportunities);

        // client.invalidateQueries("opportunity");
        // client.invalidateQueries("opportunities");
  
        return opportunities;
  
      }
    )
  }

  
  export default useOpportunities;