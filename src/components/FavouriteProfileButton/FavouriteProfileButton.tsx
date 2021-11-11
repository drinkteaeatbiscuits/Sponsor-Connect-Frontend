import { IonIcon } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { AuthContext } from "../../App";

interface FavouriteProfileProps {
	profileId: any
}
 
const FavouriteProfileButton: React.FC<FavouriteProfileProps> = ( FavouriteProfileProps ) => {

	const { profileId } = FavouriteProfileProps;

	// console.log(profileId);

	const { state: authState } = React.useContext(AuthContext);

	// console.log(authState.user.favouriteProfiles);


	const [isFavourite, setIsFavourite] = useState(false);

	useEffect(() => {
		authState?.user?.favouriteProfiles?.includes(profileId) ? setIsFavourite(true) : setIsFavourite(false); 
	}, [authState.user.favouriteProfiles])

	const setFavourite = async () => {

		const favouriteProfileResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/favourite-profile", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({
				profileId: profileId
			})
		});
		
		const favouriteProfileInfo = await favouriteProfileResp.json();

		// console.log(favouriteProfileInfo);

		favouriteProfileInfo?.favouriteProfiles?.length > 0 && favouriteProfileInfo.favouriteProfiles.includes(profileId) ? setIsFavourite(true) : setIsFavourite(false);

		return favouriteProfileInfo?.statusCode ? false : favouriteProfileInfo;  

	}

	
	return <div className="favourite-button" onClick={(e) => { e.stopPropagation(); setFavourite()}}>

		<IonIcon className="" icon={ isFavourite ? star : starOutline}></IonIcon>

	</div>	
}
 
export default FavouriteProfileButton;