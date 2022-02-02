import { IonIcon } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { AuthContext } from "../../App";

interface FavouriteProfileProps {
	profileId: any,
	className?: string
}
 
const FavouriteProfileButton: React.FC<FavouriteProfileProps> = ( FavouriteProfileProps ) => {

	const { profileId, className } = FavouriteProfileProps;

	// console.log(profileId);
	const client = useQueryClient();

	const { state: authState, dispatch } = React.useContext(AuthContext);

	// console.log(authState.user.favouriteProfiles);


	const [isFavourite, setIsFavourite] = useState(false);

	useEffect(() => {
		authState?.user?.favouriteProfiles?.includes(profileId) ? setIsFavourite(true) : setIsFavourite(false); 
	}, [authState?.user?.favouriteProfiles])

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

		dispatch && dispatch({
			type: "setFavouriteProfiles",
			payload: favouriteProfileInfo
		  });

		return favouriteProfileInfo?.statusCode ? false : favouriteProfileInfo;  

	}

	
	return <div className={className + " favourite-button"} onClick={(e) => { e.stopPropagation(); setFavourite()}}>

		<IonIcon className="" icon={ isFavourite ? star : starOutline}></IonIcon>

	</div>	
}
 
export default FavouriteProfileButton;