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
import EditProfileTabs from '../../components/EditProfileTabs/EditProfileTabs';

export interface props {}

const ProfileImages: React.FC = () => {

	const history = useHistory();
  	const { state: authState } = React.useContext(AuthContext);

	const myProfileImages = useMyProfileImages();

	const [ uploadedImage, setUploadedImage ] = useState("");
	const [ profileImages, setProfileImages ] = useState([]);
	const [ hasRefetched, setHasRefetched ] = useState(false);
	const [	showImageUpload, setShowImageUpload ] = useState(false);
	

	const { isLoading: isDeletingImage, isSuccess: isDeletingImageSuccess, error: isDeletingImageError, mutateAsync: addDeletingImageMutation, reset: resetDeletingImage } = useDeleteImage(authState?.user?.profile);

	
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

	// console.log(profileImages);

	return (
		<IonPage>
		<TabBar activeTab="profile"/>
		<IonContent className="editor-content" fullscreen>
        <div className="content">
          <div className="edit-profile">
            <h1 style={{ color: "var(--ion-color-dark)", lineHeight: 0.8, fontSize: "4em", padding: "15px" }}>EDIT <br /><span style={{ color: "var(--ion-color-primary)" }}>PROFILE</span></h1>
            
            <EditProfileTabs value='images' />
            
        
			<div className="editor-wrap">
			

				<div className="upload-image">
					<NewImageUpload3 
						currentImage={ uploadedImage} 
						setCurrentImage={ setUploadedImage } 
						field="images" 
						theref="profile" 
						refId={ authState?.user.profile }
						imageCropAspectRatio={null} 
						circularCrop={false}
						showCroppedPreview={ false }  
						label="Profile Images"
						/> 
	
						
				</div>
				<div className="profile-images">
					{ profileImages && profileImages.map((profileImage: any) => {
						
						return <div key={profileImage.id} className="profile-image" onMouseLeave={(e) => {(e.currentTarget.querySelector('.active')  as HTMLElement)?.classList.remove("active")}}>
								<div className="profile-image-inner">

								
									<picture>
										<source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  profileImage?.hash + ".webp" } />
										<source srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  profileImage?.hash + profileImage?.ext } />
										<img className="profile-image-thumb" alt={ "Profile Image " + profileImage.id } src={ process.env.REACT_APP_S3_URL + "/images/profile/" +  profileImage?.hash + profileImage?.ext } /> 
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
				
				<IonButton className="button-tertiary" expand="block" size="small" onClick={() => history.push('/profile/' + authState?.user.profile )} >Back to Profile</IonButton>

			</div>
			
			</div>

			</div>

		</IonContent>
		</IonPage>
	);
};

export default ProfileImages;
