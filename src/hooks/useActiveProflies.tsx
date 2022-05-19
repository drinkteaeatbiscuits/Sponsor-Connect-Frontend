import qs from 'qs';
import { useQuery, useQueryClient } from 'react-query';

const useActiveProfiles = () => {
    const client = useQueryClient();

    return useQuery(
      [ "activeProfile" ],
      async () => {

        const profilesResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/active-profiles', {
            credentials: 'include'
        });

        const profiles = await profilesResponse.json();
  
        profiles.forEach((p:any) => {
          client.setQueryData([ 'activeProfile', p.id], p);
        });
  
        
        return profiles;
  
      }
    )
  }

  
  export default useActiveProfiles;