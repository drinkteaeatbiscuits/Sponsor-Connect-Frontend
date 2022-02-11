import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { logoFacebook, logoInstagram, logoTwitter, logoYoutube, location, barChart, shareSocial, trashOutline, checkmark, close, closeOutline, starOutline, star, shareSocialOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";
import useDeleteOpportunity from "../../hooks/useDeleteOpportunity";
import useOpportunityValues from "../../hooks/useOpportunityValues";
import ImageGallery from "../ImageGallery/ImageGallery";
import ShareButtons from "../ShareButtons/ShareButtons";
import TextEditorContent from "../TextEditorContent/TextEditorContent";

import './OpportunityExpanded.scss';

interface OpportunityExpandedProps {
	opportunityData?: any,
}



const OpportunityExpanded: React.FC<OpportunityExpandedProps> = (OpportunityExpandedProps) => {

	const history = useHistory();
	const { state: authState, dispatch } = React.useContext(AuthContext);
	const { opportunityData } = OpportunityExpandedProps;
	const { isLoading: isDeletingOpportunity, error: deleteOpportunityError, isSuccess: hasDeletedOpportunity, mutateAsync: deleteOpportunityMutation } = useDeleteOpportunity(opportunityData.id);
	const [showDelete, setShowDelete] = useState(false);
	const [opportunityDeleted, setOpportunityDeleted] = useState(false);

	const [isFavourite, setIsFavourite] = useState(false);
	const [showShare, setShowShare] = useState(false);

	const deleteOpportunity = async () => {
		await deleteOpportunityMutation();
	}

	const setFavourite = async () => {
		// console.log('favourite opportunity');

		const favouriteOpportunityResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/favourite-opportunity", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({
				opportunityId: opportunityData.id
			})
		});
		
		const favouriteOpportunityInfo = await favouriteOpportunityResp.json();

		favouriteOpportunityInfo?.favouriteOpportunities?.length > 0 && favouriteOpportunityInfo.favouriteOpportunities.includes(opportunityData?.id) ? setIsFavourite(true) : setIsFavourite(false);

		dispatch && dispatch({
			type: "setFavouriteOpportunities",
			payload: favouriteOpportunityInfo
		  });
		  
		return favouriteOpportunityInfo?.statusCode ? false : favouriteOpportunityInfo;  

	}

	useEffect(() => {

		hasDeletedOpportunity && setOpportunityDeleted(true);

		authState?.user?.favouriteOpportunities?.length > 0 && authState?.user.favouriteOpportunities.includes(opportunityData?.id) ? setIsFavourite(true) : setIsFavourite(false);

	}, [hasDeletedOpportunity, authState])



	return <div className="opportunity-expanded">

		{ !opportunityDeleted ? <div className="">

			<div className="opportunity-actions">

				<div className="opportunity-back">
					<p onClick={() => history.push("/opportunities/" + opportunityData.profile.id)}>{"< Back to all opportunities"}</p>
				</div>

				{ authState?.user.profile === parseInt(opportunityData?.profile.id) && <div className="opportunity-owner-actions">

					{!showDelete && <div className="edit" onClick={() => history.push("/edit-opportunity/" + opportunityData.id)}>Edit</div>}

					{!showDelete && <IonIcon className="" onClick={() => { showDelete ? setShowDelete(false) : setShowDelete(true) }} icon={trashOutline}></IonIcon>}

					{showDelete && <div className="delete-opportunity">
						<span>Delete opportunity? </span>
						<IonIcon className="tick" onClick={() => deleteOpportunity()} icon={checkmark}></IonIcon>
						<IonIcon className="" onClick={() => setShowDelete(false)} icon={closeOutline}></IonIcon>

					</div>}

				</div>

				}

			</div>

			{opportunityData?.images &&

				<picture>
					<source type="image/webp" media="(max-width: 576px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_xs/" + opportunityData?.images?.hash + ".webp"} />
					<source type="image/webp" media="(max-width: 768px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_sm/" + opportunityData?.images?.hash + ".webp"} />
					<source type="image/webp" media="(max-width: 992px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_md/" + opportunityData?.images?.hash + ".webp"} />
					<source type="image/webp" media="(max-width: 1440px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_lg/" + opportunityData?.images?.hash + ".webp"} />
					<source type="image/webp" media="(min-width: 1441px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_xl/" + opportunityData?.images?.hash + ".webp"} />

					<source type="image/jpeg" media="(max-width: 576px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_xs/" + opportunityData?.images?.hash + opportunityData?.images?.ext} />
					<source type="image/jpeg" media="(max-width: 768px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_sm/" + opportunityData?.images?.hash + opportunityData?.images?.ext} />
					<source type="image/jpeg" media="(max-width: 992px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_md/" + opportunityData?.images?.hash + opportunityData?.images?.ext} />
					<source type="image/jpeg" media="(max-width: 1440px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_lg/" + opportunityData?.images?.hash + opportunityData?.images?.ext} />
					<source type="image/jpeg" media="(min-width: 1441px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_xl/" + opportunityData?.images?.hash + opportunityData?.images?.ext} />

					<img className="cover-image" src={process.env.REACT_APP_S3_URL + "/images/cover_xl/" + opportunityData?.images?.hash + opportunityData?.images?.ext} alt="Opportunity Cover" />
				</picture>

			}

			<div className="opportunity-content">

				{ showShare && <ShareButtons url={ window.location.href } /> }

				<div className="opportunity-content-top">

					{opportunityData?.price && <div className="price">£{opportunityData?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>}

					<div className="opportunity-call-to-actions">

						<div className="favourite" onClick={() => setFavourite()}>

							<IonIcon className="" icon={ isFavourite ? star : starOutline}></IonIcon>

						</div>
						<div className="share" onClick={() => setShowShare( showShare ? false : true )}>
							<IonIcon className=""  icon={shareSocialOutline}></IonIcon>
						</div>
						<div className="contact">
							<IonButton className="contact-button" size="small" >Contact Now</IonButton>
						</div>
					</div>
				</div>

				<div className="opportunity-content-bottom">

					<h1 className="ion-color-dark line-height-1">{opportunityData?.title}</h1>


					{opportunityData?.opportunityDescription && <TextEditorContent editorContent={opportunityData?.opportunityDescription} />}

					{opportunityData?.opportunityImages.length > 0 && <ImageGallery images={opportunityData?.opportunityImages} galleryId="Opportunity Images" />}
			

					<IonButton expand="block" className="interest-button" size="large" 
						onClick={() => { 
							history.push('/profile/' + opportunityData.profile.id, {tab: "contact"})} } 
					>Show an interest in this opportunity</IonButton>

				</div>


			</div>


		</div> : <div className="opportunity-deleted"><p style={{fontWeight: 700, fontSize: '24px', letterSpacing: "-0.02em"}}>Opportunity Deleted</p> <p style={{cursor: "pointer"}} onClick={() => history.push("/opportunities/" + opportunityData.profile.id)}>{"< Back to all opportunities"}</p> </div> }

	</div>


}

export default OpportunityExpanded;

 