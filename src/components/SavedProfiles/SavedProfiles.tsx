import { IonIcon } from "@ionic/react";
import { ellipsisVertical, personCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";
import useMultipleProfiles from "../../hooks/useMultipleProfiles";
import FavouriteProfileButton from "../FavouriteProfileButton/FavouriteProfileButton";


import './SavedProfiles.scss';

interface props {
	
}
 
const SavedProfiles: React.FC<props> = () => {
	
	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);
	
    // console.log(authState);

	const favouriteProfiles = authState?.user?.favouriteProfiles;

	const [favouriteProfilesData, setFavouriteProfiles] = useState();

    // console.log(favouriteProfiles);

	const {isLoading, data: profileData, isSuccess, error} = useMultipleProfiles( favouriteProfiles, "favourite-profiles" );

	// isSuccess && console.log(profileData);

	useEffect(() => {
		
	}, []);

	
	return <div className="profiles-saved-list" style={{padding: "0 16px 0 12px", overflow: "scroll"}}>	

		{
			favouriteProfiles.length > 0 && favouriteProfiles.slice(0).reverse().map((contactedProfile, index) => {

                let contactedProfileId = contactedProfile.profileId ? contactedProfile.profileId : contactedProfile;

				const contactedProfileData = isSuccess && profileData.find(x => x.id === contactedProfileId);
				
				


				// console.log(contactedProfileData.profileName);


				return <div className="profile-saved" 
				key={contactedProfileId + "-" + index} 
				style={{display: "flex", 
				alignItems: "center", 
				padding: "8px 0", 
				borderBottom: "#EDEDED 1px solid",
				cursor: "pointer"
				}}>

					<div className="avatar" onClick={() =>  history.push( "/profile/" + contactedProfileId ) }>
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

					<div className="" style={{
                        flexGrow: 1, 
                        padding: "0 3px 2px 9px", 
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center"}}>
                        <div className="" onClick={() =>  history.push( "/profile/" + contactedProfileId ) } style={{
                            flexGrow: 1
                        }}>
                            { isSuccess && <p style={{margin: 0}}>{ contactedProfileData?.profileName }</p>}
                            { isSuccess && <p style={{margin: 0, lineHeight: 1, fontSize: "0.8em", fontWeight: 400}}>{ contactedProfileData?.sport }</p>}
                        
                        </div>
                        <div className=""
                        style={{display: "flex", alignItems: "center", fontSize: "20px"}}>
                            <FavouriteProfileButton className="smaller" profileId={contactedProfileId} />
				
                        </div>
                    	
                    </div>
 
				
					
					</div>

			})
 
			
		}
	</div>
}
 
export default SavedProfiles;


