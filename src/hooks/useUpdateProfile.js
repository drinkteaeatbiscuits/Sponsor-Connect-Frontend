import { useMutation, useQueryClient } from 'react-query';

const useUpdateProfile = () => {

	const client = useQueryClient();
	  
	  return useMutation(
		"myProfile",
		async (data: { 
		  profileName: string; 
		  sport: string;
		  location: string; 
		  priceRange: string; 
		  website: string;
		  socialMedia: any;
		  shortDescription: string;
		  accolades: any;
		}) => {
  
		const profilesResponse = await fetch(process.env.REACT_APP_API_URL + "/profiles/me", {
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
			}), 
		});
	
		  return await profilesResponse.json();
	
		},
		{
		  onSuccess: () => {
			client.invalidateQueries("myProfile");
		  }
		}
	  )
   
  }

  export default useUpdateProfile;