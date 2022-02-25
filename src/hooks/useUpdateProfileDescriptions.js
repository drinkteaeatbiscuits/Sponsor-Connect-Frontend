import { useMutation, useQueryClient } from 'react-query';

const useUpdateProfileDescriptions = (id) => {

	const client = useQueryClient();
	  
	  return useMutation(
		["profile", id],
		async (data: { 
		  
		  informationAboutYou: any;
		  competitionInformation: any;
		  supportersInformation: any;
		  anyOtherInfo: any;
		  
		}) => {

			// console.log( data.textEditor);
  
		const profilesResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/profiles/me", {
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			method: "PUT",
			body: JSON.stringify({ 
			  informationAboutYou: data.informationAboutYou,
			  competitionInformation: data.competitionInformation,
			  supportersInformation: data.supportersInformation,
			  anyOtherInfo: data.anyOtherInfo,
			}), 
		});
	
		  return await profilesResponse.json();
	
		},
		{
		  onSuccess: () => {
			// console.log('profile updated');
			client.invalidateQueries(["profiles"]);
			client.invalidateQueries(["profile", id]);
		  }
		}
	  )
   
  }

  export default useUpdateProfileDescriptions;