import { IonSegment, IonSegmentButton, IonIcon } from "@ionic/react"
import { person, pencil, images } from "ionicons/icons"
import React from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";

export interface props { 
	value: string
}

const EditProfileTabs: React.FC<props> = (props) => {

	const { value } = props;
	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);
 
	const profileId = authState?.user?.profile;



	return <IonSegment mode="md" style={{justifyContent: 'flex-end', padding: '0 16px'}} value={value}>
	<IonSegmentButton onClick={() => { history.push('/profile/' + profileId + '/edit') }} 
	style={{'--color-checked': 'var(--ion-color-primary)', '--indicator-color': 'var(--ion-color-primary)', flexGrow: 0}} value="profile">
	  <p style={{display: 'flex', textTransform: 'none', letterSpacing: '0', fontSize: '1.1em'}}><IonIcon style={{margin: '4px 5px 0 0'}} icon={person} /> Info</p>
	</IonSegmentButton>
	<IonSegmentButton onClick={() => { history.push('/edit-profile-description') }}
	style={{'--color-checked': 'var(--ion-color-primary)', '--indicator-color': 'var(--ion-color-primary)', flexGrow: 0}} value="description">
	  <p style={{display: 'flex', textTransform: 'none', letterSpacing: '0', fontSize: '1.1em'}}><IonIcon style={{margin: '4px 5px 0 0'}} icon={pencil} /> Description</p>
	</IonSegmentButton>
	<IonSegmentButton onClick={() => { history.push('/manage-profile-images') }}
	style={{'--color-checked': 'var(--ion-color-primary)', '--indicator-color': 'var(--ion-color-primary)', flexGrow: 0}} value="images">
	  <p style={{display: 'flex', textTransform: 'none', letterSpacing: '0', fontSize: '1.1em'}}><IonIcon style={{margin: '4px 5px 0 0'}} icon={images} /> Images</p>
	</IonSegmentButton>
	
  </IonSegment>

}

export default EditProfileTabs