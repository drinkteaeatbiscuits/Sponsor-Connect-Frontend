import { IonIcon } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { AuthContext } from "../../App";

interface props {
	opportunityId: any,
	className?: string,
	style?: object,
}
 
const FavouriteOpportunityButton: React.FC<props> = ( props ) => {

	const { opportunityId, className, style } = props;

	const { state: authState, dispatch } = React.useContext(AuthContext);
	const [isFavourite, setIsFavourite] = useState(false);

	useEffect(() => {
		authState?.user?.favouriteProfiles?.includes(opportunityId) ? setIsFavourite(true) : setIsFavourite(false); 

		authState?.user?.favouriteOpportunities?.length > 0 && authState?.user.favouriteOpportunities.includes(opportunityId) ? setIsFavourite(true) : setIsFavourite(false);
	
	}, [authState?.user?.favouriteOpportunities])

	const setFavourite = async () => {
		// console.log('favourite opportunity');

		const favouriteOpportunityResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/favourite-opportunity", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({
				opportunityId: opportunityId
			})
		});
		
		const favouriteOpportunityInfo = await favouriteOpportunityResp.json();

		favouriteOpportunityInfo?.favouriteOpportunities?.length > 0 && favouriteOpportunityInfo.favouriteOpportunities.includes(opportunityId) ? setIsFavourite(true) : setIsFavourite(false);

		dispatch && dispatch({
			type: "setFavouriteOpportunities",
			payload: favouriteOpportunityInfo
		  });
		  
		return favouriteOpportunityInfo?.statusCode ? false : favouriteOpportunityInfo;  

	}


	return <div className={className + " favourite-button"} style={{...style, fontSize: '24px'}} onClick={(e) => { e.stopPropagation(); setFavourite()}}>

		<IonIcon className="" icon={ isFavourite ? star : starOutline}></IonIcon>

	</div>	
}
 
export default FavouriteOpportunityButton;