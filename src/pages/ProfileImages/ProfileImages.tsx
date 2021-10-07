import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory } from 'react-router';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import TabBar from '../../components/TabBar';
import NewImageUpload3 from '../../components/NewImageUpload3/NewImageUpload3';
import useMyProfile from '../../hooks/useMyProfile';

import './ProfileImages.scss';
import useDeleteImage from '../../hooks/useDeleteImage';
import useMyProfileImages from '../../hooks/useMyProfileImages';
import { trashOutline } from 'ionicons/icons';

export interface props {}

const ProfileImages: React.FC = () => {

	const history = useHistory();
  	const { state: authState } = React.useContext(AuthContext);

	const myProfileImages = useMyProfileImages();

	const [ uploadedImage, setUploadedImage ] = useState("");
	const [ profileImages, setProfileImages ] = useState([]);
	const [ hasRefetched, setHasRefetched ] = useState(false);
	const [	showImageUpload, setShowImageUpload ] = useState(false);
	

	const { isLoading: isDeletingImage, isSuccess: isDeletingImageSuccess, error: isDeletingImageError, mutateAsync: addDeletingImageMutation, reset: resetDeletingImage } = useDeleteImage();

	
	useEffect(() => {

		if (myProfileImages.status === "success") {
			
			setProfileImages(myProfileImages.data);

		}

		
		if(uploadedImage && !hasRefetched){

			// console.log('refetch');
			
			myProfileImages.refetch();

			setHasRefetched(true);

			setUploadedImage("");

			setShowImageUpload(false);

		}

		if(isDeletingImageSuccess && !hasRefetched) {

			// console.log('deleted');

			myProfileImages.refetch();
			
			setHasRefetched(true);

			// setUploadedImage("");

			// setShowImageUpload(false);
		
		}

	}, [myProfileImages.status, myProfileImages.data, uploadedImage, myProfileImages, hasRefetched, isDeletingImageSuccess]);

	// console.log(isDeletingImageSuccess)

	return (
		<IonPage>
		<TabBar activeTab="profile"/>
		<IonContent fullscreen>
			<div className="content profile-images-content">
				<p>Profile Images</p>
				<div className="upload-image">
					{showImageUpload && <NewImageUpload3 
						currentImage={ uploadedImage} 
						setCurrentImage={ setUploadedImage } 
						field="images" 
						theref="profile" 
						refId={ authState?.user.profile }
						imageCropAspectRatio={null} 
						circularCrop={false}
						// showCroppedPreview={ false }  
						/> }
					{!showImageUpload && <IonButton onClick={() => { setHasRefetched(false); setShowImageUpload(true); resetDeletingImage(); }}>Add New</IonButton>}
						
				</div>
				<div className="profile-images">
					{ profileImages && profileImages.map((profileImage: any) => {
						
						return <div key={profileImage.id} className="profile-image" onMouseLeave={(e) => {(e.currentTarget.querySelector('.active')  as HTMLElement)?.classList.remove("active")}}>
								<div className="profile-image-inner">

								
									<picture>
										<source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/profile_image_thumbnail_" +  profileImage?.hash + ".webp" } />
										<source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/profile_image_thumbnail_" +  profileImage?.hash + ".jpg" } />
										<img className="profile-image-thumb" alt={ "Profile Image " + profileImage.id } src={ process.env.REACT_APP_S3_URL + "/profile_image_thumbnail_" +  profileImage?.hash + ".jpg" } /> 
									</picture>

									<div className="hovering-overlay"></div>

									<div className="image-controls">
										<div className="delete-image" onClick={() => { addDeletingImageMutation(profileImage.id); setHasRefetched(false); }}>
											delete
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
			


		</IonContent>
		</IonPage>
	);
};

export default ProfileImages;
