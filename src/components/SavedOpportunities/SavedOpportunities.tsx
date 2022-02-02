import { IonIcon } from "@ionic/react";
import { ellipsisVertical, personCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";
import useMultipleOpportunities from "../../hooks/useMultipleOpportunities";
import useMultipleProfiles from "../../hooks/useMultipleProfiles";
import FavouriteProfileButton from "../FavouriteProfileButton/FavouriteProfileButton";


import './SavedOpportunities.scss';

interface props {
	
}
 
const SavedOpportunities: React.FC<props> = () => {
	
	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);
	
    // console.log(authState);

	const favouriteOpportunities = authState?.user?.favouriteOpportunities;

	const [favouriteOpportunitiesData, setfavouriteOpportunities] = useState();

    // console.log(favouriteOpportunities);

	const {isLoading, data: opportunityData, isSuccess, error} = useMultipleOpportunities( favouriteOpportunities, "favourite-opportunities" );

	// isSuccess && console.log(opportunityData);

	useEffect(() => {
		
	}, []);

	
	return <div className="opportunities-saved-list opportunities" style={{padding: "0 16px 0 12px", overflow: "scroll"}}>	
	

		{ favouriteOpportunities.length > 0 && favouriteOpportunities.slice(0).reverse().map((favouriteOpportunity, index) => {

                	let favouriteOpportunityId = favouriteOpportunity;

					const favouriteOpportunityData = isSuccess && opportunityData.find(x => x.id === favouriteOpportunityId);
				
					return (<div className="opportunity" key={favouriteOpportunityData.id + " " + index} onClick={ ()=> history.push("/opportunity/" + favouriteOpportunityData.id) } >
							
							<div className=" opportunity-details">

								{favouriteOpportunityData.price && <p className="price">£{favouriteOpportunityData.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>}
								
								{favouriteOpportunityData.title && <p className="title">{favouriteOpportunityData.title}</p> }

								{favouriteOpportunityData.description && <p className="description">
									{favouriteOpportunityData.description} 
								</p> }

							</div>
	
							{ favouriteOpportunityData.images && <div className="opportunity-image-thumb">
								<picture>
									<source type="image/webp" media="(max-width: 576px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" +  favouriteOpportunityData.images?.hash + ".webp" } />
									<source type="image/jpeg" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" +  favouriteOpportunityData.images?.hash + favouriteOpportunityData.images?.ext } />
									<img className="opportunity-image" src={  process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" + favouriteOpportunityData.images?.hash + favouriteOpportunityData.images?.ext } alt={favouriteOpportunityData.title} /> 
								</picture> 
							</div> }
						
						</div>)
							
	
				})}	 
		
			 
			 
			 </div>
			 
			 }

 
export default SavedOpportunities;


