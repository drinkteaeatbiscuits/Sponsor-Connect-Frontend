import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { logoFacebook, logoInstagram, logoTwitter, logoYoutube, location, barChart, shareSocial, trashOutline, checkmark, close, closeOutline, starOutline, star, shareSocialOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";
import useDeleteOpportunity from "../../hooks/useDeleteOpportunity";
import useOpportunityValues from "../../hooks/useOpportunityValues";
import TextEditorContent from "../TextEditorContent/TextEditorContent";

import './OpportunityExpanded.scss';

interface OpportunityExpandedProps {
	opportunityData?: any,
}

const OpportunityExpanded: React.FC<OpportunityExpandedProps> = (OpportunityExpandedProps) => {

	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);

	const { opportunityData } = OpportunityExpandedProps;

	const { isLoading: isDeletingOpportunity, error: deleteOpportunityError, isSuccess: hasDeletedOpportunity, mutateAsync: deleteOpportunityMutation } = useDeleteOpportunity(opportunityData.id);

	const [showDelete, setShowDelete] = useState(false);

	const [opportunityDeleted, setOpportunityDeleted] = useState(false);

	const deleteOpportunity = async () => {

		await deleteOpportunityMutation();

	}

	const setFavourite = async () => {
		console.log('favourite opportunity');
	}


	useEffect(() => {

		hasDeletedOpportunity && setOpportunityDeleted(true);

		

	}, [hasDeletedOpportunity])



	return <div className="opportunity-expanded">

		{ !opportunityDeleted ? <div className="">

			<div className="opportunity-actions">

				<div className="opportunity-back">
					<p onClick={() => history.push("/opportunities/" + opportunityData.profile.id)}>{"< Back to all opportunities"}</p>
				</div>
				{authState?.user.profile === parseInt(opportunityData?.profile.id) && <div className="opportunity-owner-actions">

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
					<source type="image/webp" media="(max-width: 576px)" srcSet={process.env.REACT_APP_S3_URL + "/cover_xs_" + opportunityData?.images?.hash + ".webp"} />
					<source type="image/webp" media="(max-width: 768px)" srcSet={process.env.REACT_APP_S3_URL + "/cover_sm_" + opportunityData?.images?.hash + ".webp"} />
					<source type="image/webp" media="(max-width: 992px)" srcSet={process.env.REACT_APP_S3_URL + "/cover_md_" + opportunityData?.images?.hash + ".webp"} />
					<source type="image/webp" media="(max-width: 1440px)" srcSet={process.env.REACT_APP_S3_URL + "/cover_lg_" + opportunityData?.images?.hash + ".webp"} />
					<source type="image/webp" media="(min-width: 1441px)" srcSet={process.env.REACT_APP_S3_URL + "/cover_xl_" + opportunityData?.images?.hash + ".webp"} />

					<source type="image/jpeg" media="(max-width: 576px)" srcSet={process.env.REACT_APP_S3_URL + "/cover_xs_" + opportunityData?.images?.hash + ".jpg"} />
					<source type="image/jpeg" media="(max-width: 768px)" srcSet={process.env.REACT_APP_S3_URL + "/cover_sm_" + opportunityData?.images?.hash + ".jpg"} />
					<source type="image/jpeg" media="(max-width: 992px)" srcSet={process.env.REACT_APP_S3_URL + "/cover_md_" + opportunityData?.images?.hash + ".jpg"} />
					<source type="image/jpeg" media="(max-width: 1440px)" srcSet={process.env.REACT_APP_S3_URL + "/cover_lg_" + opportunityData?.images?.hash + ".jpg"} />
					<source type="image/jpeg" media="(min-width: 1441px)" srcSet={process.env.REACT_APP_S3_URL + "/cover_xl_" + opportunityData?.images?.hash + ".jpg"} />

					<img className="cover-image" src={process.env.REACT_APP_S3_URL + "/cover_xl_" + opportunityData?.images?.hash + ".jpg"} alt="Opportunity Cover" />
				</picture>

			}

			<div className="opportunity-content">

				<div className="opportunity-content-top">

					{opportunityData?.price && <div className="price">£{opportunityData?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>}

					<div className="opportunity-call-to-actions">
						<div className="favourite">
							<IonIcon className="" onClick={() => setFavourite()} icon={authState?.user.profile === parseInt(opportunityData?.profile.id) ? star : starOutline}></IonIcon>
						</div>
						<div className="share">
							<IonIcon className="" onClick={() => setShowDelete(false)} icon={shareSocialOutline}></IonIcon>
						</div>
						<div className="contact">
							<IonButton className="contact-button" size="small" >Contact Now</IonButton>
						</div>
					</div>
				</div>

				<div className="opportunity-content-bottom">

					<h1 className="ion-color-dark line-height-1">{opportunityData?.title}</h1>


					{opportunityData?.opportunityDescription && <TextEditorContent editorContent={opportunityData?.opportunityDescription} />}

					<IonButton expand="block" className="interest-button" size="large" >Show an interest in this opportunity</IonButton>

				</div>


			</div>





		</div> : <div className="opportunity-deleted"><p style={{fontWeight: 700, fontSize: '24px', letterSpacing: "-0.02em"}}>Opportunity Deleted</p> <p style={{cursor: "pointer"}} onClick={() => history.push("/opportunities/" + opportunityData.profile.id)}>{"< Back to all opportunities"}</p> </div> }

	</div>


}

export default OpportunityExpanded;

