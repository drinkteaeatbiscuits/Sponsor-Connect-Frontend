import qs from 'qs';
import { useQuery, useQueryClient } from 'react-query';

const useProfiles = (allProfiles?) => {
    const client = useQueryClient();

    let showAllProfiles = '/active-profiles';  
    if(allProfiles){
      showAllProfiles = '/profiles?_limit=-1';
    }

    return useQuery(
      [ !allProfiles ? "profile" : "allProfiles" ],
      async () => {

        const profilesResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + showAllProfiles, {
            credentials: 'include'
        });

        const profiles = await profilesResponse.json();
  
        profiles.forEach((p:any) => {
          client.setQueryData([ !allProfiles ? "profile" : "allProfiles", p.id], p);
        });
  
        
        return profiles;
  
      }
    )
  }

  
  export default useProfiles;