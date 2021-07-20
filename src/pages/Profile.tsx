import { IonButton, IonContent, IonItem, IonLabel, IonList, IonLoading, IonPage } from '@ionic/react';
import Header from '../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../App";
import React from 'react';
import LogoutButton from '../components/LogoutButton';
import { useQueryClient, useQuery } from 'react-query';

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

const Profile: React.FC = () => {

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  const {isLoading, data, error} = useMyProfile();

  console.log(error);
  console.log(data);

  return (
    <IonPage>
      <Header headerTitle="Profile"/>
      <IonContent fullscreen>
        <IonLoading isOpen={isLoading} message="Loading Profile" />

        <IonList>
          {data?.map((p: any) => {
            return (
              <IonItem
              key={p.id}
            >
              <IonLabel>
                { p.profileName && <p>{ p.profileName }</p> }
              </IonLabel>
              </IonItem>
            )
          })}
        </IonList>

          { authState.isAuthenticated ? <p>Hello user { authState.user.id }</p>	: <p>Please log in</p> }
            
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/profile/edit" )}>Edit Profile</IonButton>
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/opportunities/" )}>Opportunities</IonButton>
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/dashboard/" )}>Back to Dashboard</IonButton>
          

      </IonContent>
    </IonPage>
  );
};

export default Profile;
