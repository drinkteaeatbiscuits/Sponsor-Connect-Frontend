import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonLoading, IonModal, IonPage, IonSearchbar, IonToolbar } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App"; 
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useUpdateProfile from '../../hooks/useUpdateProfile';
import useMyProfile from '../../hooks/useMyProfile';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

import './edit-profile.scss';

import sports from '../CreateAccount/sports.json';

export interface props {}


const EditProfile: React.FC = () => {
  

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const {isLoading, error, mutateAsync: addProfileMutation} = useUpdateProfile();
  const profileData = useMyProfile();
  
  const [profileName, setProfileName] = useState("");
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [website, setWebsite] = useState("");

  const [yourSport, setYourSport] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [latLong, setLatLong] = useState<any>("");
  const [searchText, setSearchText] = useState<string>("");

  const [filteredSports, setFilteredSports] = useState<any>(sports);
  
  
  const [facebookTotal, setFacebookTotal] = useState<any>("");
  const [facebookUrl, setFacebookUrl] = useState<any>("");

  const updateProfile = async () => {
    
    await addProfileMutation({
      profileName, 
      sport: yourSport, 
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
      setYourSport(profileData.data[0]?.sport);
      setLocation(profileData.data[0]?.location);
      setPriceRange(profileData.data[0]?.priceRange);
      setWebsite(profileData.data[0]?.website);
    }
  }, [profileData.status, profileData.data]);

  
  const focusOnSport = () => {
    
    document.addEventListener('ionModalDidPresent', () => { document.querySelector('ion-searchbar')?.setFocus(); });

  }

  const doLocationSelected = (event: any) => {

    setLocation(event);
    geocodeByAddress(event.label)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        // console.log('Successfully got latitude and longitude', { lat, lng });
        setLatLong({ lat, lng });
      }
      );
  }

  let showSports = null;

  if (filteredSports.length > 0) {

    showSports = filteredSports.map((data: any) => {
      return (
        <IonItem className="sport" onClick={() => { setYourSport(data); setShowModal(false); }} key={data}>{data}</IonItem>
      )
    });

  } else {

    showSports = <div><IonItem key="other">Other</IonItem><div className="ion-text-center ion-padding-top" ><p>Can't find your sport?</p><p className="ion-no-margin">Please let us know here:</p><p className="ion-no-margin"><a href="mailto:info@sponsor-connect.co.uk">info@sponsor-connect.co.uk</a></p> </div></div>;

  }

  const handleFilter = (event: any) => {

    setSearchText(event.target.value);

    const query = event.target.value.toLowerCase();

    requestAnimationFrame(() => {

      let filteredSports: any = [];

      sports.forEach(item => {

        const shouldShow = item.toLowerCase().indexOf(query) > -1;

        shouldShow && filteredSports.push(item);

      });

      setFilteredSports(filteredSports);

    });

  }



  // console.log(profileData);

  return (
    <IonPage>
      <Header headerTitle="Edit Profile"/>
      <IonContent fullscreen>
        
          <IonLoading isOpen={isLoading} message="Updating Profile" />
          <IonLoading isOpen={profileData.isLoading} message="Loading Profile" />
            
          {/* <IonButton fill="clear" expand="full" onClick={()=> history.push( "/opportunities/" )}>Opportunities</IonButton>
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/dashboard/" )}>Back to Dashboard</IonButton> */}

          {  !profileData.isLoading && profileData.data?.map((p: any) => { 
            return (
              <div className="ion-text-center" key={p.id}>

                  <IonItem>
                    <IonLabel position="stacked">Profile Name</IonLabel>
                    <IonInput type="text" value={ profileName ? profileName : p.profileName } onIonChange={ (e:any) => setProfileName(e.detail.value) } />
                  </IonItem>

                      <IonItem>
                        <IonLabel position="stacked">Your Sport</IonLabel>
                        <IonInput placeholder="Please select your sport" value={ yourSport ? yourSport : p.sport } readonly={true} type="text" onClick={() => { setShowModal(true); focusOnSport(); }} onFocus={() => {setShowModal(true); focusOnSport(); }} />
                      </IonItem>

                      <IonItem className="location-item">

                        <IonLabel className="location-label" position="stacked" >Location</IonLabel>
              
                        <GooglePlacesAutocomplete
                          apiKey="AIzaSyBVk9Y4B2ZJG1_ldwkfUPfgcy48YzNTa4Q"

                          selectProps={{
                            location,
                            onChange: doLocationSelected,
                            placeholder: "Start typing to select location",
                            menuPlacement: "auto",
                            className: "google-places"
                          }}
                          autocompletionRequest={{
                            componentRestrictions: {
                              country: ['uk', 'ie'],
                            }
                          }}
                        />

                      </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Price Range</IonLabel>
                    <IonInput type="text" value={ priceRange ? priceRange : p.priceRange } onIonChange={ (e:any) => setPriceRange(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Website</IonLabel>
                    <IonInput type="text" value={ website ? website : p.website } onIonChange={ (e:any) => setWebsite(e.detail.value) } />
                  </IonItem>


                  <IonItem>
                    <IonLabel position="stacked">Facebook Total</IonLabel>
                    <IonInput type="number" value={ facebookTotal ? facebookTotal : p.socialMedia } onIonChange={ (e:any) => setFacebookTotal(e.detail.value) } />
                    
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Facebook URL</IonLabel>
                    <IonInput type="text" value={ facebookUrl ? facebookUrl : p.socialMedia } onIonChange={ (e:any) => setFacebookUrl(e.detail.value) } />
                    
                  </IonItem>

              </div>
            )
          }) 
         } 
        
        
          

          <div style={{paddingTop: 8}}><IonButton onClick={()=> updateProfile()} expand="block">SAVE</IonButton></div>

          <IonModal isOpen={showModal} animated={true} cssClass='select-sport-modal' backdropDismiss={false} >


          <IonToolbar className="ion-text-start">

            <IonButton className="ion-no-padding ion-color-tertiary" button-type="link" onClick={() => setShowModal(false)}>Close Search</IonButton>

            <IonSearchbar value={searchText} onIonChange={e => handleFilter(e)} placeholder="Please select your sport"></IonSearchbar>

          </IonToolbar>
          <IonContent className="ion-padding-bottom">
            <IonList className="sports-list">

              {showSports}



            </IonList>

            <IonButton className="ion-padding-top ion-padding-bottom ion-margin-bottom" button-type="link" onClick={() => setShowModal(false)}>Close Search</IonButton>

          </IonContent>

        </IonModal>
          
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
