import { IonIcon } from "@ionic/react";
import { personCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";
import useMultipleProfiles from "../../hooks/useMultipleProfiles";


import './ProfilesContacted.scss';

interface ProfilesContactedProps {
	
}
 
const ProfilesContacted: React.FC<ProfilesContactedProps> = () => {
	
	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);
	
	const contactedProfiles = authState?.user?.contactedProfiles;

	const [contactedProfilesData, setContactedProfilesData] = useState();

	const {isLoading, data: profileData, isSuccess, error} = useMultipleProfiles( contactedProfiles, "contacted-profiles" );

	useEffect(() => {
		
	}, []);

	
	return <div className="profiles-contacted-list" style={{padding: "0 16px 0 12px", overflow: "scroll"}}>	

		{
			contactedProfiles && contactedProfiles.map((contactedProfile) => {

				const contactedProfileData = isSuccess && profileData.find(x => x.id === contactedProfile.profileId);
				
				
				// console.log(contactedProfileData.profileName);


				const date = new Date(contactedProfile.date);
				const options: Intl.DateTimeFormatOptions = { month: "short", day: '2-digit' };
				
				const dateString = new Intl.DateTimeFormat('en-GB', options).format(date);

				return <div className="profile-contacted" onClick={() =>  history.push( "/profile/" + contactedProfile?.profileId ) } 
				key={contactedProfile?.date} 
				style={{display: "flex", 
				alignItems: "center", 
				padding: "8px 0", 
				borderBottom: "#EDEDED 1px solid",
				cursor: "pointer"
				}}>

					<div className="avatar">
						<div className="avatar-image">
							
							{ contactedProfileData?.profilePicture ? 
							
							<picture>
								<source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  contactedProfileData?.profilePicture?.hash + ".webp" } />
								<source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  contactedProfileData?.profilePicture?.hash + contactedProfileData?.profilePicture?.ext } />
								<img className="profile-picture" alt={ "Profile Image " + contactedProfileData?.profilePicture.id } src={ process.env.REACT_APP_S3_URL + "/images/profile/" +  contactedProfileData?.profilePicture?.hash + contactedProfileData?.profilePicture?.ext } /> 
							</picture>
							
							: <IonIcon color="medium" icon={personCircle} /> }
							
						</div>
					</div>

					<div className="" style={{flexGrow: 1, padding: "0 9px 2px", fontWeight: "500"}}>
						{ isSuccess && contactedProfileData?.profileName}
					</div>

					<div className="" style={{fontSize: "0.9em", color: "var(--ion-color-medium)"}}>
						{ dateString }
					</div>
					
					</div>

			})
 
			
		}
	</div>
}
 
export default ProfilesContacted;


