import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonLoading, IonPage } from '@ionic/react';
import Header from '../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useUpdateProfile from '../hooks/useUpdateProfile';
import useMyProfile from '../hooks/useMyProfile';

export interface props {}


const EditProfile: React.FC = () => {
  

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const {isLoading, error, mutateAsync: addProfileMutation} = useUpdateProfile();
  const profileData = useMyProfile();

  console.log(profileData);
  
  const [profileName, setProfileName] = useState("");
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [website, setWebsite] = useState("");

  const updateProfile = async () => {
    
    await addProfileMutation({
      profileName, 
      sport, 
      location, 
      priceRange, 
      website 
    });
    
    history.goBack();
  }

  error && console.log(error);
  profileData.error && console.log(profileData);

  useEffect(() => {
    if (profileData.status === "success") {
      setProfileName(profileData.data[0]?.profileName);
      setSport(profileData.data[0]?.sport);
      setLocation(profileData.data[0]?.location);
      setPriceRange(profileData.data[0]?.priceRange);
      setWebsite(profileData.data[0]?.website);
    }
  }, [profileData.status, profileData.data]);

  return (
    <IonPage>
      <Header headerTitle="Edit Profile"/>
      <IonContent fullscreen>
        {/* <IonLoading isOpen={isLoadingProfile} message="Loading Profile" /> */}
        <IonLoading isOpen={isLoading} message="Updating Profile" />

          { authState.isAuthenticated ? <p>Hello user { authState.user.id }</p>	: <p>Please log in</p> }
            
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/opportunities/" )}>Opportunities</IonButton>
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/dashboard/" )}>Back to Dashboard</IonButton>

          { profileData.data[0] ? profileData.data?.map((p: any) => {
            return (
              <div className="ion-text-center" key={p.id}>

                  <IonItem>
                    <IonLabel position="stacked">Profile Name</IonLabel>
                    <IonInput type="text" value={ profileName ? profileName : p.profileName } onIonChange={ (e:any) => setProfileName(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Sport</IonLabel>
                    <IonInput type="text" value={ sport ? sport : p.sport } onIonChange={ (e:any) => setSport(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Location</IonLabel>
                    <IonInput type="text" value={ location ? location : p.location } onIonChange={ (e:any) => setLocation(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Price Range</IonLabel>
                    <IonInput type="text" value={ priceRange ? priceRange : p.priceRange } onIonChange={ (e:any) => setPriceRange(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Website</IonLabel>
                    <IonInput type="text" value={ website ? website : p.website } onIonChange={ (e:any) => setWebsite(e.detail.value) } />
                  </IonItem>

              </div>
            )
          }) :  <div className="ion-text-center">

                  <IonItem>
                    <IonLabel position="stacked">Profile Name</IonLabel>
                    <IonInput type="text" value={ profileName } onIonChange={ (e:any) => setProfileName(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Sport</IonLabel>
                    <IonInput type="text" value={ sport } onIonChange={ (e:any) => setSport(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Location</IonLabel>
                    <IonInput type="text" value={ location } onIonChange={ (e:any) => setLocation(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Price Range</IonLabel>
                    <IonInput type="text" value={ priceRange } onIonChange={ (e:any) => setPriceRange(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Website</IonLabel>
                    <IonInput type="text" value={ website } onIonChange={ (e:any) => setWebsite(e.detail.value) } />
                  </IonItem>

              </div>
            
        
        }
          

          <div style={{paddingTop: 8}}><IonButton onClick={()=> updateProfile()} expand="block">SAVE</IonButton></div>
          
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
