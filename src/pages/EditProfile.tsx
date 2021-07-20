import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonLoading, IonPage } from '@ionic/react';
import Header from '../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../App";
import React, { useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import { useQuery, useQueryClient } from 'react-query';

export interface props {}

export const useMyProfile = () => {
  const client = useQueryClient();
  return useQuery(
    "myProfile",
    async() => {
      console.log("in query");
      const response = await fetch(process.env.REACT_APP_API_URL + '/profiles/me', {
        credentials: "include",
      });
      
      const posts = await response.json();

      // pre load the cache
      posts.forEach((p: any) => {
        client.setQueryData(["myProfile", p.id], p);
      });

      return posts;
    }
  )
 
}

const EditProfile: React.FC = () => {
  

	const history = useHistory();
  const [profileName, setProfileName] = useState("");
  const { state: authState } = React.useContext(AuthContext);

  const {isLoading, data, error} = useMyProfile();

  console.log(error);
  console.log(data);
  return (
    <IonPage>
      <Header headerTitle="Edit Profile"/>
      <IonContent fullscreen>
        <IonLoading isOpen={isLoading} message="Loading Profiles" />

          { authState.isAuthenticated ? <p>Hello user { authState.user.id }</p>	: <p>Please log in</p> }
            
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/opportunities/" )}>Opportunities</IonButton>
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/dashboard/" )}>Back to Dashboard</IonButton>

          <IonItem>
            <IonLabel position="stacked">Profile Name</IonLabel>
            <IonInput type="text" onIonChange={ (e:any) => setProfileName(e.detail.value) } />
          </IonItem>
          

      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
