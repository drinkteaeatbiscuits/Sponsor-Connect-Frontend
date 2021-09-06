import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { logoFacebook, logoInstagram, logoTwitter, logoYoutube, location, barChart, shareSocial } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";
import useOpportunityValues from "../../hooks/useOpportunityValues";

import './ProfileCard.scss';

interface ProfileProps {
	profileData?: any,
}

const ProfileCard: React.FC<ProfileProps> = ( ProfileProps ) => {

	const history = useHistory();

	const { isSuccess, data: opportunityValueRange } = useOpportunityValues(ProfileProps.profileData?.id)

	const totalSocialFollowing = ( socialMediaArray: any ) => {
		
		let socialMediaTotal = 0;

		if(socialMediaArray){
			socialMediaArray.forEach((socialMedia:any) => {
				socialMediaTotal = socialMediaTotal + socialMedia.socialMediaTotal;
			});
		}
		return socialMediaTotal;
	}

	return <IonCard className="profile-card" button={true} onClick={ ()=> history.push("/profile/" + ProfileProps.profileData?.id) } >

				{ ProfileProps.profileData.coverImage && <img className="" alt={ "Cover Photo " + ProfileProps.profileData?.coverImage?.id } src={ (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : '') + ProfileProps.profileData?.coverImage?.url } /> }
				
				<IonCardHeader>
					<h2 className="">{ProfileProps.profileData?.profileName}</h2>
					<h3 className="">{ProfileProps.profileData?.sport}</h3>
				</IonCardHeader>
				<IonCardContent>
					<div className="profile-information">
						<div className="profile-information-row">
							<IonIcon color="tertiary" icon={location} /><p>{ProfileProps.profileData?.location?.label}</p>
						</div>
						{ isSuccess && opportunityValueRange && <div className="profile-information-row">
							 <IonIcon color="tertiary" icon={barChart} /><p> { opportunityValueRange } </p> 
						</div> }
						{totalSocialFollowing(ProfileProps.profileData?.socialMedia) > 0 && 
						<div className="profile-information-row">
							<IonIcon color="tertiary" icon={shareSocial} /><p>{totalSocialFollowing(ProfileProps.profileData?.socialMedia)}</p>
						</div>
						}
					</div>
					<IonButton size="small" expand="full" className="link profile-link" onClick={ ()=> history.push("/profile/" + ProfileProps.profileData?.id) } >View Profile</IonButton>
				</IonCardContent>
			</IonCard>;

}

export default ProfileCard;

