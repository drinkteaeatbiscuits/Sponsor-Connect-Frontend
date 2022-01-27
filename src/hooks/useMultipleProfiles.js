import { useQuery, useQueryClient } from 'react-query';

const useMultipleProfiles = (profileIds) => {
    const client = useQueryClient();

    let filterString = "";

    if(profileIds){

      for (let i = 0, len = profileIds.length; i < len; i++) {
  
        if(i > 0){filterString += "&"}
  
        filterString += "id_in=" + profileIds[i].profileId;
  
        }
    }
    
    
    
    return useQuery(
      "contactedProfiles",
      async () => {

        const profilesResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/profiles?" + filterString, {
            credentials: 'include'
        });

        const profiles = await profilesResponse.json();
        client.setQueryData(["contactedProfiles", profiles.data]);
    
  
        return profiles;
  
      }
    )
  }
  
  export default useMultipleProfiles;