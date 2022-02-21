import { IonIcon } from "@ionic/react";
import { ellipsisVertical, personCircle, trashOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ArrowFunction } from "typescript";
import { AuthContext } from "../../App";
import { showCurrency } from "../../functions/showCurrency";
import useMultipleOpportunities from "../../hooks/useMultipleOpportunities";
import useMultipleProfiles from "../../hooks/useMultipleProfiles";
import FavouriteProfileButton from "../FavouriteProfileButton/FavouriteProfileButton";


import './SavedOpportunities.scss';

interface props {
	selectEnabled?: boolean;
	selectedOpportunities: Array<number>;
	setSelectedOpportunities: Function;
}
 
const SavedOpportunities: React.FC<props> = (props) => {
	
	const history = useHistory();
	const { state: authState, dispatch } = React.useContext(AuthContext);
	const { selectEnabled, selectedOpportunities, setSelectedOpportunities } = props;
	const favouriteOpportunities = authState?.user?.favouriteOpportunities;


	const {isLoading, data: opportunityData, isSuccess, error} = useMultipleOpportunities( favouriteOpportunities, "favourite-opportunities" );

	// console.log(opportunityData)

	const removeOpportunity = async (opportunityId) => {

		const favouriteOpportunityResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/favourite-opportunity", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({
				opportunityId: opportunityId
			})
		});
		
		const favouriteOpportunityInfo = await favouriteOpportunityResp.json();

		// favouriteOpportunityInfo?.favouriteOpportunities?.length > 0 && favouriteOpportunityInfo.favouriteOpportunities.includes(opportunityData?.id) ? setIsFavourite(true) : setIsFavourite(false);

		dispatch && dispatch({
			type: "setFavouriteOpportunities",
			payload: favouriteOpportunityInfo
		  });
		  
		return favouriteOpportunityInfo?.statusCode ? false : favouriteOpportunityInfo;  

	}
	

	const selectOpportunity = (opportunityId) => {

		// let updatedSelectedOpportunities = selectedOpportunities;
		
		const newArr = [...selectedOpportunities]

		selectedOpportunities?.includes(opportunityId) ? newArr.splice(newArr.indexOf(opportunityId), 1) : newArr.push(opportunityId)
	
		setSelectedOpportunities(newArr);
		
	}

	
	return <div className="opportunities-saved-list opportunities" style={{padding: "0 16px 0 12px", overflow: "scroll"}}>	
	

		{ favouriteOpportunities && favouriteOpportunities.length > 0 && favouriteOpportunities.slice(0).reverse().map((favouriteOpportunity, index) => {

                	let favouriteOpportunityId = favouriteOpportunity;

					const favouriteOpportunityData = isSuccess && opportunityData.find(x => x.id === favouriteOpportunityId);
				

					return (<div className="opportunity-row" style={{display: "flex"}} key={ favouriteOpportunityData?.id + '-' + index + new Date()}>
					<div className="opportunity" style={{flexGrow: '1', transition: '0.2s all ease'}}  onClick={ () => { selectEnabled ? selectOpportunity(favouriteOpportunityData?.id) : history.push("/opportunity/" + favouriteOpportunityData?.id) }} >
							

							<div className="opportunity-details" style={{width: '100%'}}>


								<div className="" style={{display: "flex"}}>

									{console.log(favouriteOpportunityData)}

									
								
									{favouriteOpportunityData?.price ? <p className="price" style={{flexGrow: 1}}>{ showCurrency(favouriteOpportunityData.profile) }{favouriteOpportunityData?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p> : <p className="price" style={{flexGrow: 1}}></p>}
								
									<div className="profile-details" 
							
									style={{display: "flex", 
									alignItems: "center", 
									padding: "0px 0px 0", 
									cursor: "pointer"
									}}>

										<div className="" style={{
											flexGrow: 1, 
											padding: "0 9px 2px 9px", 
											fontWeight: "500",
											display: "flex",
											alignItems: "center",
											textAlign: "right"}}>
											<div className="" style={{
												flexGrow: 1
											}}>
												{ isSuccess && <p style={{margin: 0}}>{ favouriteOpportunityData?.profile?.profileName }</p>}
												{ isSuccess && <p style={{margin: 0, lineHeight: 1, fontSize: "0.8em", fontWeight: 400}}>{ favouriteOpportunityData?.profile?.sport }</p>}
											
											</div>
										</div>

										<div className="avatar">
											<div className="avatar-image">
												
												{ favouriteOpportunityData?.profile?.profilePicture ? 
												
												<picture>
													<source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  favouriteOpportunityData?.profile?.profilePicture?.hash + ".webp" } />
													<source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  favouriteOpportunityData?.profile?.profilePicture?.hash + favouriteOpportunityData?.profile?.profilePicture?.ext } />
													<img className="profile-picture" alt={ "Profile Image " + favouriteOpportunityData?.profile?.profilePicture.id } src={ process.env.REACT_APP_S3_URL + "/images/profile/" +  favouriteOpportunityData?.profile?.profilePicture?.hash + favouriteOpportunityData?.profile?.profilePicture?.ext } /> 
												</picture>
												
												
												: <IonIcon color="medium" icon={personCircle} /> }
												
											</div>
										</div>
	
									</div>

								</div>


								{favouriteOpportunityData?.title && <p className="title">{favouriteOpportunityData?.title}</p> }

								{favouriteOpportunityData?.description && <p className="description">
									{favouriteOpportunityData?.description} 
								</p> }

							</div>
	
							{/* { favouriteOpportunityData?.images && <div className="opportunity-image-thumb">
								<picture>
									<source type="image/webp" media="(max-width: 576px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" +  favouriteOpportunityData?.images?.hash + ".webp" } />
									<source type="image/jpeg" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" +  favouriteOpportunityData?.images?.hash + favouriteOpportunityData?.images?.ext } />
									<img className="opportunity-image" src={  process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" + favouriteOpportunityData?.images?.hash + favouriteOpportunityData?.images?.ext } alt={favouriteOpportunityData?.title} /> 
								</picture> 
							</div> } */}

							
							
							
							{/* <IonIcon icon={trashOutline} color="primary" size="small" style={{position: "absolute", right: 0, bottom: 0, padding: "8px"}} onClick={(e) => {  removeOpportunity(favouriteOpportunityData?.id); e.stopPropagation(); }} /> */}
						
						</div>

						{selectEnabled && <div className=""
						onClick={ () => { selectOpportunity(favouriteOpportunityData?.id) }}
						style={{
								alignSelf: "center",
								width: '24px',
								height: '24px',
								minWidth: '24px',
								borderRadius: '12px',
								border: 'var(--ion-color-primary) 2px solid',
								background: selectedOpportunities?.includes(favouriteOpportunityData?.id) ? 'var(--ion-color-primary)' : '#fff',
								boxShadow: 'inset 0 0 0 3px #fff',
								margin: '0 0px 0 8px',
							cursor: 'pointer' }}
								></div> }
						
					</div>)
							
	
				})}	 
		
			 
			 
			 </div>
			 
			 }

 
export default SavedOpportunities;


