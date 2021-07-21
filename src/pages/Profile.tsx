import { IonButton, IonContent, IonItem, IonLabel, IonList, IonLoading, IonPage } from '@ionic/react';
import Header from '../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../App";
import React from 'react';
import LogoutButton from '../components/LogoutButton';
import { useQueryClient, useQuery } from 'react-query';
import useMyProfile from '../hooks/useMyProfile';

export interface props {}


const Profile: React.FC = () => {

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  const {isLoading, data, error} = useMyProfile();

  error && console.log(error);
  // console.log(data);

  return (
    <IonPage>
      <Header headerTitle="Profile"/>
      <IonContent fullscreen>
        <IonLoading isOpen={isLoading} message="Loading Profile" />

        <IonList>
          {data?.map((p: any) => {
            return (
              <div className="ion-text-center" key={p.id}>
                
                  { p.profileName && <h1>{ p.profileName }</h1> }
                  { p.sport && <h2>{ p.sport }</h2> }
                  { p.location && <p>{ p.location }</p> }
                  { p.priceRange && <p>{ p.priceRange }</p> }
                  { p.website && <p>{ p.website }</p> }
                  
                  { p.socialMedia.facebook && <p>Facebook: { p.socialMedia.facebook }</p> }
                  { p.socialMedia.twitter && <p>Twitter: { p.socialMedia.twitter }</p> }
                  { p.socialMedia.instagram && <p>Instagram: { p.socialMedia.instagram }</p> }
                  { p.socialMedia.youtube && <p>YouTube: { p.socialMedia.youtube }</p> }


              </div>
            )
          })}
        </IonList>

          {/* { authState.isAuthenticated ? <p>Hello user { authState.user.id }</p>	: <p>Please log in</p> } */}
            
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/profile/edit" )}>Edit Profile</IonButton>
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/opportunities/" )}>Opportunities</IonButton>
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/dashboard/" )}>Back to Dashboard</IonButton>
          

      </IonContent>
    </IonPage>
  );
};

export default Profile;
