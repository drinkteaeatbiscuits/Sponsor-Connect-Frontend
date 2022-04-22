import { IonIcon } from "@ionic/react";
import { closeOutline, trailSign } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useHistory, useLocation } from "react-router";
import { AuthContext } from "../../App";
import useMyProfile from "../../hooks/useMyProfile";
import useProfile from "../../hooks/useProfile";

import './Notifications.scss';

interface NotificationsProps {
	
}
 
const Notifications: React.FC<NotificationsProps> = () => {
	
	const history = useHistory();

	const location = useLocation();

	const [ showCompleteProfileNotification, setShowCompleteProfileNotification ] = useState(true);
	const { state: authState } = React.useContext(AuthContext);
	const [ profileComplete, setProfileComplete ] = useState(0);
	
	const {isLoading, data, error, isSuccess} = useMyProfile( authState.user?.profile );

	const [isProfileComplete, setIsProfileComplete] = useState<any>({ profile: true, opportunity: false });

	const checkProfileCompletion = () => {

		if( authState.user.profileComplete === 100 ){

			setIsProfileComplete( { profile: true, opportunity: true } );

		}else if( authState?.user?.profileCompletionList?.length === 1 && authState?.user?.profileCompletionList[0] === "Add at least one active opportunity") {

			setIsProfileComplete({ profile: true, opportunity: false } );

		} else {

			setIsProfileComplete( { profile: false, opportunity: false } );
		}
	}
	
	
	useEffect(() => {
		// console.log(data);
		isSuccess && setProfileComplete(data?.profileComplete);

		profileComplete === 100 && setShowCompleteProfileNotification(true);

		checkProfileCompletion();

	}, [data, useMyProfile, authState]);


	return <div className="notifications" style={{display: location?.pathname !== '/profile/'+ authState.user?.profile + '/build' ? 'block' : 'none' }}>

			{ authState.user?.profile && showCompleteProfileNotification && !isProfileComplete.profile && <div className="notification dark" 
			onClick={(e) => {e.preventDefault(); history.push( "/profile/" + authState.user?.profile +"/build" )} }
			style={{position: 'relative'}}
			>
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
					<IonIcon style={{position: "absolute", cursor: "pointer", top: "10px", right: "10px", fontSize: "20px" }} onClick={(e) => { e.stopPropagation(); setShowCompleteProfileNotification(false); } } icon={closeOutline}></IonIcon>
					
				</div> 
				}

				{ authState.user?.profile && showCompleteProfileNotification && isProfileComplete.profile && !isProfileComplete.opportunity && <div className="notification dark" 
				onClick={(e) => {e.preventDefault(); history.push( "/add-opportunity/" + authState?.user?.profile )} }
				style={{position: 'relative', display: location?.pathname !== '/add-opportunity/'+ authState.user?.profile ? 'flex' : 'none' }}
				>
					<div className="notification-badge">
						<div className="progress-circle" style={{ 
							width: '75px', 
							height: '75px',
							backgroundColor: "rgb(92 92 92)",
							borderRadius: "150px",
							padding: "2px",
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center' }}>
							<IonIcon style={{fontSize: '28px', opacity: '1'}} color="primary" icon={trailSign} />
						</div>
					</div>
					<div className="notification-text">
						<p className="notification-title">Add an opportunity</p>
						<p className="notification-description">In order to begin to show up in searches by potential sponsors, you must have an active sponsorship opportunity.</p>
					</div>
					<IonIcon style={{position: "absolute", cursor: "pointer", top: "10px", right: "10px", fontSize: "20px" }} onClick={(e) => { e.stopPropagation(); setShowCompleteProfileNotification(false); } } icon={closeOutline}></IonIcon>
					
				</div> }



			</div>
}
 
export default Notifications;