import { useQuery, useQueryClient } from 'react-query';

const useProfiles = () => {
    const client = useQueryClient();
    
    return useQuery(
      ["profile"],
      async () => {

        const profilesResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/profiles", {
            credentials: 'include'
        });

        const profiles = await profilesResponse.json();
  
        profiles.forEach((p:any) => {
          client.setQueryData(["profile", p.id], p);
        });
  
        return profiles;
  
      }
    )
  }

  
  export default useProfiles;