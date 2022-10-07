import { useMutation } from 'react-query';

const useEditUser = () => {

    return useMutation(
      ["currentUser"],
      async ( data: any ) => {

      const response = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/admin-settings", {
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include",
          method: "PUT",
          body: JSON.stringify(data), 
    	});
  
        return await response.json();
  
		}
    )
  }

  export default useEditUser;