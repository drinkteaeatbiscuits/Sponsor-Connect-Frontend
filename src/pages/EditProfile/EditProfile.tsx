import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonModal, IonPage, IonSearchbar, IonTextarea, IonToolbar } from '@ionic/react';
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
import ReactCrop from 'react-image-crop';
import { saveAs } from 'file-saver';


import 'react-image-crop/dist/ReactCrop.css';

// import '../../../node_modules/react-image-crop/lib/ReactCrop.scss';


import './edit-profile.scss';

import sports from '../CreateAccount/sports.json'; 
import { env } from 'process';
import useUploadImage from '../../hooks/useUploadImage';
import UploadImage from '../../components/UploadImage/UploadImage';
import { constructOutline, closeCircleOutline, happy, close } from 'ionicons/icons';

export interface props {}


const EditProfile: React.FC = () => {
  
 
	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const {isLoading, error, mutateAsync: addProfileMutation} = useUpdateProfile();
  const profileData = useMyProfile();
  
  const [profileName, setProfileName] = useState("");
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState<any>("");
  const [priceRange, setPriceRange] = useState("");
  const [website, setWebsite] = useState("");

  const [yourSport, setYourSport] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [latLong, setLatLong] = useState<any>("");
  const [searchText, setSearchText] = useState<string>("");

  const [filteredSports, setFilteredSports] = useState<any>(sports);
  
  const [socialMedia, setSocialMedia] = useState<Array<object>>();
  const [facebookTotal, setFacebookTotal] = useState<any>("");
  const [facebookUrl, setFacebookUrl] = useState<any>(""); 
  const [instagramTotal, setInstagramTotal] = useState<any>("");
  const [instagramUrl, setInstagramUrl] = useState<any>("");
  const [twitterTotal, setTwitterTotal] = useState<any>("");
  const [twitterUrl, setTwitterUrl] = useState<any>("");
  const [youTubeTotal, setYouTubeTotal] = useState<any>("");
  const [youTubeUrl, setYouTubeUrl] = useState<any>("");
  const [accolades, setAccolades] = useState<any>("");
  
  
  const [shortDescription, setShortDescription] = useState<any>("");
  const [fullDescription, setFullDescription] = useState<any>("");
  
  const [currentProfilePicture, setCurrentProfilePicture] = useState<any>("");
  
  const [coverImage, setCoverImage] = useState<any>("");

  

  const updateProfile = async () => {
    
    await addProfileMutation({
      profileName, 
      sport: yourSport, 
      location,  
      priceRange, 
      website,
      socialMedia: socialMediaObject,
      shortDescription,
      accolades: accolades?.filter(Boolean),
      description: fullDescription,
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
      
      setSocialMedia(profileData.data[0]?.socialMedia);

      setFacebookTotal(profileData.data[0]?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'facebook'; })[0]?.socialMediaTotal);
      setFacebookUrl(profileData.data[0]?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'facebook'; })[0]?.socialMediaUrl);
      
      setInstagramTotal(profileData.data[0]?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'instagram'; })[0]?.socialMediaTotal);
      setInstagramUrl(profileData.data[0]?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'instagram'; })[0]?.socialMediaUrl);
      
      setTwitterTotal(profileData.data[0]?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'twitter'; })[0]?.socialMediaTotal);
      setTwitterUrl(profileData.data[0]?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'twitter'; })[0]?.socialMediaUrl);
      
      setYouTubeTotal(profileData.data[0]?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'youTube'; })[0]?.socialMediaTotal);
      setYouTubeUrl(profileData.data[0]?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'youTube'; })[0]?.socialMediaUrl);

      setShortDescription(profileData.data[0]?.shortDescription);
      setFullDescription(profileData.data[0]?.description);
      setAccolades(profileData.data[0]?.accolades);
      
      setCurrentProfilePicture(profileData.data[0]?.profilePicture);
      setCoverImage(profileData.data[0]?.coverImage);
    }

    
  }, [profileData.status, profileData.data]);


  

  // console.log(src);

  
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

  if (filteredSports?.length > 0) {

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


  // const getSocialMediaData = (socialMediaName: string) => {


  //     return socialMedia?.filter(function (entry:any) { return entry.socialMediaName === socialMediaName; })      
    
  // }
  // console.log(getSocialMediaData('facebook'));

  const socialMediaObject: { socialMediaName: string; socialMediaTotal: any; socialMediaUrl: any; }[] = [];

  facebookTotal && socialMediaObject.push({
    "socialMediaName": "facebook",
    "socialMediaTotal": facebookTotal,
    "socialMediaUrl": facebookUrl
  });
  
  instagramTotal && socialMediaObject.push({
    "socialMediaName": "instagram",
    "socialMediaTotal": instagramTotal,
    "socialMediaUrl": instagramUrl
  });
  
  twitterTotal && socialMediaObject.push({
    "socialMediaName": "twitter",
    "socialMediaTotal": twitterTotal,
    "socialMediaUrl": twitterUrl
  });
  
  youTubeTotal && socialMediaObject.push({
    "socialMediaName": "youTube",
    "socialMediaTotal": youTubeTotal,
    "socialMediaUrl": youTubeUrl
  });

  // console.log(socialMediaObject);

  const createAccolades = (e:any) => {
    
    let accoladeIndex = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement);
    let newAccolades: Array<any> = [];
    newAccolades = newAccolades.concat(accolades);
    newAccolades[accoladeIndex] = e.detail.value;
    setAccolades(newAccolades);
  }
    
  const addAccolade = () => {
    
    let newAccolades: Array<string> = [];

    newAccolades = newAccolades.concat(accolades);

    accolades?.length < 1 && (newAccolades.push(""));
    
    newAccolades.push("");

    setAccolades(newAccolades);
    
  }

  const removeAccolade = (e: any) => {

    const removeIndex = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement);
    let newAccolades: Array<string> = [];
    newAccolades = newAccolades.concat(accolades);

    // console.log(removeIndex);

    newAccolades.splice(removeIndex, 1);

    setAccolades(newAccolades);
    
  }

 


  

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
                            location: location,
                            onChange: doLocationSelected,
                            placeholder: location ? location.label : "Start typing to select location",
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
                    <IonInput type="number" value={ facebookTotal && facebookTotal } onIonChange={ (e:any) => setFacebookTotal(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Facebook URL</IonLabel>
                    <IonInput type="text" value={ facebookUrl && facebookUrl } onIonChange={ (e:any) => setFacebookUrl(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Instagram Total</IonLabel>
                    <IonInput type="number" value={ instagramTotal && instagramTotal  } onIonChange={ (e:any) => setInstagramTotal(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Instagram URL</IonLabel>
                    <IonInput type="text" value={ instagramUrl && instagramUrl } onIonChange={ (e:any) => setInstagramUrl(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Twitter Total</IonLabel>
                    <IonInput type="number" value={ twitterTotal && twitterTotal  } onIonChange={ (e:any) => setTwitterTotal(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Twitter URL</IonLabel>
                    <IonInput type="text" value={ twitterUrl && twitterUrl } onIonChange={ (e:any) => setTwitterUrl(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">YouTube Total</IonLabel>
                    <IonInput type="number" value={ youTubeTotal && youTubeTotal  } onIonChange={ (e:any) => setYouTubeTotal(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">YouTube URL</IonLabel>
                    <IonInput type="text" value={ youTubeUrl && youTubeUrl } onIonChange={ (e:any) => setYouTubeUrl(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Short Description</IonLabel>
                    <IonTextarea value={ shortDescription ? shortDescription : p.shortDescription } onIonChange={ (e:any) => setShortDescription(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Full Description</IonLabel>
                    <IonTextarea value={ fullDescription ? fullDescription : p.description } onIonChange={ (e:any) => setFullDescription(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Accolades</IonLabel>

                    {/* {console.log(accolades)} */}
                    <IonList className="accolade-list">
                    {accolades?.length > 0 ? accolades.map((accolade: string, index: any) => {

                      // {console.log(accolade)}

                      return <IonItem className="accolade-field" key={index}>
                              <IonInput placeholder="Your Accolade" value={accolade && accolade} id={"accolade-" + index} onIonChange={ (e:any) => createAccolades(e) } />
                              <IonIcon icon={close} onClick={ (e) => { removeAccolade(e); } } />
                            </IonItem>

                     })

                     : 
                     <IonItem className="accolade-field" >
                      <IonInput value={""} placeholder="Your Accolade" onIonChange={ (e:any) => createAccolades(e.detail.value) } /> 
                      <IonIcon icon={close} />
                     </IonItem>
                     
                     }</IonList>

                    <IonButton buttonType="link"  className="link ion-align-self-end" onClick={ () => addAccolade() } >Add Accolade</IonButton>
                  </IonItem>

                  
                  <div>

                    
                    <UploadImage currentImage={ coverImage } setCurrentImage={ setCoverImage } field="coverImage" theref="profile" crop={{ aspect: 2 / 1 }} circularCrop={ false } showCroppedPreview={ false } />
                     
                  </div>

                  <div>
                    
                    <UploadImage currentImage={ currentProfilePicture } setCurrentImage={ setCurrentProfilePicture } field="profilePicture" theref="profile" crop={{ aspect: 1 / 1 }} circularCrop={ true } showCroppedPreview={ false } />
                    
                  </div>


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

              { showSports }


            </IonList>

            <IonButton className="ion-padding-top ion-padding-bottom ion-margin-bottom" button-type="link" onClick={() => setShowModal(false)}>Close Search</IonButton>

          </IonContent>

        </IonModal>
          
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
