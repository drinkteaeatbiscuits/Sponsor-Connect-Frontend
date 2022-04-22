import { useQuery, useQueryClient } from 'react-query';

const useAdminSettings = () => {

    return useQuery(
      ["adminSettings"],
      async () => {

        const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/admin-settings', {
            credentials: 'include'
        });

        const adminSettings = await response.json();
    
  
        return adminSettings;
  
      }
    )
  }

  
  export default useAdminSettings;