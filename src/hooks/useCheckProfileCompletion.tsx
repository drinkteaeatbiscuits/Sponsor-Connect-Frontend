import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { AuthContext } from '../App';

const useCheckProfileCompletion = () => {

	const { state: authState, dispatch } = React.useContext(AuthContext);

	  return useMutation(
		"updateProfileComplete",
		async () => {
  
		const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/update-profile-completion", {
			credentials: "include",
			method: "POST", 
		});
	
		  return await response.json();
	
		},
		{
		  onSuccess: (data) => {
			dispatch && dispatch({
			type: "updateProfileComplete",
			payload: { 
				profileComplete: data.profileComplete, 
				profileCompletionList: data.profileCompletionList 
			}
			});
		  }
		}
	  )
   
  }

  export default useCheckProfileCompletion;