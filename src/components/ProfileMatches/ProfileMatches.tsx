import { IonIcon } from "@ionic/react";
import { personCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";
import useMultipleProfiles from "../../hooks/useMultipleProfiles";
import useProfiles from "../../hooks/useProflies";
import ProfileCard from "../ProfileCard/ProfileCard";


import './ProfileMatches.scss';

interface ProfileMatchesProps {
	
}
 
const ProfileMatches: React.FC<ProfileMatchesProps> = () => {
	
	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);
	
	const viewedProfiles = authState?.user?.viewedProfiles;

	const {isLoading, data, isSuccess, error} = useProfiles();
	const [profileData, setProfileData] = useState<any[]>([]);
	// console.log(profileData);

	useEffect(() => {

		isSuccess && profileData.length === 0 && setProfileData(data);
		
	}, [ data ]);

	
	return <div className="profile-matches-list" style={{
		padding: "8px"
	}}>	

		{ profileData?.length > 0 && profileData?.map(( profile:any )=>{
                  return <ProfileCard className="condensed" key={profile.id} profileData={profile} />
                }) }
		
	</div>
} 
 
export default ProfileMatches;


