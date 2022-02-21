import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonRow, IonSpinner } from "@ionic/react";
import { logoFacebook, logoInstagram, logoTwitter, logoYoutube, location, barChart, shareSocial, trashOutline, checkmark, close, closeOutline, starOutline, star, shareSocialOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";
import useDeleteImage from "../../hooks/useDeleteImage";
import useDeleteOpportunity from "../../hooks/useDeleteOpportunity";
import useDeleteOpportunityImage from "../../hooks/useDeleteOpportunityImage";
import useOpportunityValues from "../../hooks/useOpportunityValues";
import NewImageUpload3 from "../NewImageUpload3/NewImageUpload3";
import TextEditorContent from "../TextEditorContent/TextEditorContent";

import './OpportunityImagesUpload.scss';

interface OpportunityImagesUploadProps {
	opportunityData?: any,
	refetchOpportunityImages?: any,
	label?: string,
}

const OpportunityImagesUpload: React.FC<OpportunityImagesUploadProps> = (OpportunityImagesUploadProps) => {

	const {opportunityData, refetchOpportunityImages, label} = OpportunityImagesUploadProps;

	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);

	const [ uploadedImage, setUploadedImage ] = useState("");
	const [ profileImages, setProfileImages ] = useState([]);
	const [ hasRefetched, setHasRefetched ] = useState(false);
	const [	showImageUpload, setShowImageUpload ] = useState(false);

	const { isLoading: isDeletingImage, isSuccess: isDeletingImageSuccess, error: isDeletingImageError, mutateAsync: addDeletingImageMutation, reset: resetDeletingImage } = useDeleteOpportunityImage(opportunityData.id);

	useEffect(() => {

		if(uploadedImage && !hasRefetched){
			
			refetchOpportunityImages();

			setHasRefetched(true);

			setUploadedImage("");

			setShowImageUpload(false);

		}

		if(isDeletingImageSuccess && !hasRefetched) {

			refetchOpportunityImages();
			
			setHasRefetched(true);
		
		}

	}, [uploadedImage, hasRefetched, isDeletingImageSuccess])



	return <div className="opportunity-images-upload">

		{/* <div className="editor-section-top">
			<label className="editor-section-title">{ label }</label>
			<div className="editor-section-top-buttons">
				{!showImageUpload ? <div className="editor-section-button" onClick={() => { setHasRefetched(false); setShowImageUpload(true); resetDeletingImage(); }}>Add New</div> : 
				<div className="editor-section-button" onClick={() => { setShowImageUpload(false); }}>Cancel</div> }
			</div>	
		</div> */}

		

		<div className="upload-image">

			<NewImageUpload3 
				currentImage={ uploadedImage } 
				setCurrentImage={ setUploadedImage } 
				field="opportunityImages" 
				theref="opportunity" 
				refId={ opportunityData.id }
				imageCropAspectRatio={null} 
				circularCrop={false}
				label={ label }
				// showCroppedPreview={ false }  
				showUploadArea={showImageUpload}
				/>

	
		</div>

		<div className="gallery-images">
			{ opportunityData?.opportunityImages.length > 0 && opportunityData?.opportunityImages.map((image: any) => {
				
				return <div key={image.id} className="gallery-image" onMouseLeave={(e) => {(e.currentTarget.querySelector('.active')  as HTMLElement)?.classList.remove("active")}}>
						<div className="gallery-image-inner">

						
							<picture>
								<source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  image?.hash + ".webp" } />
								<source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  image?.hash + image?.ext } />
								<img className="gallery-image-thumb" alt={ "Profile Image " + image.id } src={ process.env.REACT_APP_S3_URL + "/images/profile/" +  image?.hash + image?.ext } /> 
							</picture>

							<div className="hovering-overlay"></div>

							<div className="image-controls">
								<div className="delete-image" onClick={() => { addDeletingImageMutation(image.id); setHasRefetched(false); }}>
									Delete
								</div>
								<IonIcon onClick={(e) => {(e.currentTarget.previousSibling as HTMLElement).classList.add("active")}} color="light" icon={trashOutline}></IonIcon>
								
							</div>

							
						{isDeletingImage && <div className="is-deleting-overlay"><IonSpinner name="dots" color="light" /></div>}
					</div>
				</div>
				
			})
			}
		</div>

		
	</div>


}

export default OpportunityImagesUpload;

