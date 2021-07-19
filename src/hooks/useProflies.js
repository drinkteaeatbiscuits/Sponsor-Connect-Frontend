import { useQuery, useQueryClient } from 'react-query';

const useProfiles = () => {
    const client = useQueryClient();
    
    return useQuery(
      "profiles",
      async () => {
        
        // const response = await fetch(process.env.REACT_APP_API_URL + "/profiles");

        const profilesResponse = await fetch(process.env.REACT_APP_API_URL + "/profiles", {
            credentials: 'include'
        });


        const profiles = await profilesResponse.json();
  
        profiles.forEach((p:any) => {
          client.setQueryData(["profiles", p.id], p);
        });

		    console.log(profiles);
  
        return profiles;
  
      }
    )
  }

  
  export default useProfiles;