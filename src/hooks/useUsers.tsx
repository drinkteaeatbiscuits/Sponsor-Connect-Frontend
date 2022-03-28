import { useQuery, useQueryClient } from 'react-query';

const useUsers = () => {
    const client = useQueryClient();

    return useQuery(
      ["users"],
      async () => {

        const usersResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/users', {
            credentials: 'include'
        });

        const users = await usersResponse.json();
  
        users.forEach((p:any) => {
          client.setQueryData(["user", p.id], p);
        });
  
        return users;
  
      }
    )
  }

  export default useUsers;