import { useQuery, useQueryClient } from 'react-query';

const useMultipleOpportunities = (opportunityIds, queryName) => {
    const client = useQueryClient();

    let filterString = "";

    if( opportunityIds ){

      for (let i = 0, len = opportunityIds.length; i < len; i++) {
  
        if(i > 0){filterString += "&"}

          filterString += "id_in=" + opportunityIds[i];
  
        }
    }
    
    return useQuery(
      queryName,
      async () => {

        const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/opportunities?" + filterString, {
            credentials: 'include'
        });

        const opportunities = await response.json();
        client.setQueryData([queryName, opportunities.data]);
    
  
        return opportunities;
  
      }
    )
  }
  
  export default useMultipleOpportunities;