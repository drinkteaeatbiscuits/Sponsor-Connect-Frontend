import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";
import useMyProfile from "../../hooks/useMyProfile";
import useProfile from "../../hooks/useProfile";


import './Notifications.scss';

interface NotificationsProps {
	
}
 
const Notifications: React.FC<NotificationsProps> = () => {
	
	const history = useHistory();

	const [showCompleteProfileNotification, setShowCompleteProfileNotification] = useState(true);
	const { state: authState } = React.useContext(AuthContext);
	const [ profileComplete, setProfileComplete ] = useState(0);
	
	const {isLoading, data, error, isSuccess} = useMyProfile( authState.user?.profile );
	
	
	useEffect(() => {
		// console.log(data);
		isSuccess && setProfileComplete(data?.profileComplete);

		profileComplete === 100 && setShowCompleteProfileNotification(true);

	}, [data, useMyProfile]);
	// authState.user && console.log(authState.user.profileComplete);
	// isSuccess && console.log(data.profileComplete);

	// isSuccess && console.log(data);

	//  /console.log(authState?.user?.profile);

	return <div className="notifications">
		
			{ authState.user?.profile && showCompleteProfileNotification && profileComplete < 100 && <div className="notification dark" onClick={(e) => {e.preventDefault(); history.push( "/profile/" + authState.user?.profile +"/edit" )} }>
					<div className="notification-badge">
						<div className="progress-circle" style={{ 
							width: 75, 
							height: 75,
							backgroundColor: "transparent",
							borderRadius: "150px",
							padding: "2px" }}>
							<CircularProgressbar strokeWidth={10} value={profileComplete}
								background={true}
								styles={{
									root: {},
									path: {
										stroke: `#10B59B`,
									},
									trail: {
										stroke: '#393939',
										strokeWidth: '10px',
									},
									background: {
										fill: 'rgba(0,0,0,0)',
									},
								}}
							/>
							<p className="completion-percentage">{ profileComplete }%</p>
							
						</div>
					</div>
					<div className="notification-text">
						<p className="notification-title">Complete your profile</p>
						<p className="notification-description">In order to begin to show up in searches by potential sponsors, you must have all essential parts of your profile completed.</p>
					</div>
					<IonIcon style={{position: "absolute", cursor: "pointer", top: "20px", right: "20px", fontSize: "20px" }} onClick={(e) => { e.stopPropagation(); setShowCompleteProfileNotification(false); } } icon={closeOutline}></IonIcon>
					
				</div> 
				}

			</div>
}
 
export default Notifications;