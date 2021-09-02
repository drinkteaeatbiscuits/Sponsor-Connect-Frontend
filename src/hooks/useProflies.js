import { useQuery, useQueryClient } from 'react-query';

const useProfiles = () => {
    const client = useQueryClient();
    
    return useQuery(
      "profiles",
      async () => {
        
      

        const profilesResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/profiles", {
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