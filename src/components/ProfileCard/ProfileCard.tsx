import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { logoFacebook, logoInstagram, logoTwitter, logoYoutube, location, barChart, shareSocial } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";
import getProfileOpportunityValues from "../../functions/getProfileOpportunityValues";
import { showCurrency } from "../../functions/showCurrency";
import useOpportunityValues from "../../hooks/useOpportunityValues";
import FavouriteProfileButton from "../FavouriteProfileButton/FavouriteProfileButton";

import './ProfileCard.scss';
 
interface ProfileProps {
	profileData?: any,
	className?: string
}

const ProfileCard: React.FC<ProfileProps> = ( ProfileProps ) => {

	const { profileData, className } = ProfileProps;

	const history = useHistory();

	
	const totalSocialFollowing = ( socialMediaArray: any ) => {
		
		let socialMediaTotal:number = 0;

		if(socialMediaArray){
			socialMediaArray.forEach((socialMedia:any) => {
				
				socialMediaTotal = socialMediaTotal + parseFloat(socialMedia.socialMediaTotal);
			});
		}
		return socialMediaTotal;
	}

	// console.log(profileData);

	return <div className={"profile-card " + className} onClick={ ()=> history.push("/profile/" + profileData?.id) } >

				<div className="profile-image" >

					{ profileData?.coverImage && 
						<picture>
						
							<source type="image/webp" media="(max-width: 1024px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_sm/" +  profileData?.coverImage?.hash + ".webp" } />
							<source type="image/jpeg" media="(max-width: 1024px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_sm/" +  profileData?.coverImage?.hash + profileData?.coverImage?.ext } />
							<source type="image/webp" media="(max-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_md/" +  profileData?.coverImage?.hash + ".webp" } />
							<source type="image/jpeg" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_md/" +  profileData?.coverImage?.hash + profileData?.coverImage?.ext } />
							<img className="profile-image" src={  process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" + profileData?.coverImage?.hash + profileData?.coverImage?.ext } alt={profileData.title} /> 
						</picture> 
					}

				</div>

				<div className="profile-information">
					<p className="name">{profileData?.profileName}</p>
					<p className="sport">{profileData?.sport}</p>
					<div className="description">{ profileData?.shortDescription }</div>

					<div className="profile-facts">
						<div className="">
							<IonIcon color="tertiary" icon={location} /><p>{ profileData?.location?.label }</p>
						</div>

						{ getProfileOpportunityValues(profileData.opportunities) &&
						<div className="">
							<IonIcon color="tertiary" icon={barChart} /><p> {showCurrency(profileData)}{ getProfileOpportunityValues(profileData.opportunities)?.min } - {showCurrency(profileData)}{ getProfileOpportunityValues(profileData.opportunities)?.max } </p> 
						
						</div>
						
						}

						{ totalSocialFollowing(profileData?.socialMedia) > 0 && 
							<div className="profile-information-row">
								<IonIcon color="tertiary" icon={shareSocial} /><p>{totalSocialFollowing(profileData?.socialMedia).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
							</div>
						}
					

					</div>
				</div>

				
					<FavouriteProfileButton profileId={profileData?.id} />
				
				


			</div>

}

export default ProfileCard;

