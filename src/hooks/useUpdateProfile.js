import { useMutation, useQueryClient } from 'react-query';

const useUpdateProfile = () => {

	const client = useQueryClient();
	  
	  return useMutation(
		"profiles",
		async (data: { 
		  profileName: string; 
		  sport: string;
		  location: string; 
		  priceRange: string; 
		  website: string;
		  socialMedia: any;
		  shortDescription: string;
		  accolades: any;
		  description: string;
		  fullDescriptionText: any;
		}) => {

			// console.log( data.textEditor);
  
		const profilesResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/profiles/me", {
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			method: "PUT",
			body: JSON.stringify({ 
			  profileName: data.profileName, 
			  sport: data.sport, 
			  location: data.location, 
			  priceRange: data.priceRange, 
			  website: data.website, 
			  socialMedia: data.socialMedia,
			  shortDescription: data.shortDescription,
			  accolades: data.accolades,
			  description: data.description,
			  fullDescriptionText: data.fullDescriptionText
			}), 
		});
	
		  return await profilesResponse.json();
	
		},
		{
		  onSuccess: () => {
			// console.log('profile updated');
			client.invalidateQueries("profiles");
			client.invalidateQueries("profile");
		  }
		}
	  )
   
  }

  export default useUpdateProfile;