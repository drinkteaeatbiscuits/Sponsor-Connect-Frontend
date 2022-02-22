import { useQuery, useQueryClient } from 'react-query';

const useOpportunity = ( id:any, profileId ) => {

    const client = useQueryClient();

	// console.log(id);

    return useQuery(
      "opportunity-" + id,
      async () => {

		if(id){

			const opportunityResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/opportunities/" + id + "?_publicationState=preview", {
				credentials: 'include'
			});

			const opportunity = await opportunityResponse.json();

			// client.setQueryData([ "opportunity-" + id ], opportunity);

			client.invalidateQueries(["opportunities-" + profileId]);
	  
			return opportunity;
		}
        
  
      }
    )
  }

  
  export default useOpportunity;