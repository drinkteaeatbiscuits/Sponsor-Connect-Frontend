import { IonButton, IonButtons, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonModal, IonPage, IonSearchbar, IonTextarea, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
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

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';


import 'react-image-crop/dist/ReactCrop.css';

// import '../../../node_modules/react-image-crop/lib/ReactCrop.scss';


import './edit-profile.scss';

import sports from '../CreateAccount/sports.json'; 
import { env } from 'process';
import useUploadImage from '../../hooks/useUploadImage';
import UploadImage from '../../components/UploadImage/UploadImage';
import { constructOutline, closeCircleOutline, happy, close, logoFacebook, logoInstagram, logoTwitter, logoYoutube } from 'ionicons/icons';
import NewImageUpload3 from '../../components/NewImageUpload3/NewImageUpload3';
import TextEditor from '../../components/TextEditor/TextEditor';
import TabBar from '../../components/TabBar';
import EditorSection from '../../components/EditorSection/EditorSection';
import EditorSectionProfile from '../../components/EditorSection/EditorSectionProfile';
import useEditProfileField from '../../hooks/useEditProfileField';
import SocialMediaTotals from '../../components/SocialMediaTotals/SocialMediaTotals';

export interface props {}


const EditProfile: React.FC = () => {
 
  const client = useQueryClient(); 
 
	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const { isLoading, error, mutateAsync: addProfileMutation } = useUpdateProfile();
  const { isLoading: isEditingOpportunity, error: editOpportunityError, isSuccess, mutateAsync: editProfileMutation } = useEditProfileField( authState?.user.profile.id );

  const profileData = useMyProfile(authState?.user.profile.id);
  
  const [profileName, setProfileName] = useState("");
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState<any>("");
  const [priceRange, setPriceRange] = useState("");
  const [website, setWebsite] = useState("");

  const [yourSport, setYourSport] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [latLong, setLatLong] = useState<any>("");
  const [searchText, setSearchText] = useState<string>("");
  const [showLocation, setShowLocation] = useState<boolean>(false);
  const [showSocials, setShowSocials] = useState<boolean>(false);
  const [showEditAccolades, setShowEditAccolades] = useState<boolean>(false);

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


  const [fullDescriptionText, setFullDescriptionText] = useState();

  // console.log(textEditorText);

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
      fullDescriptionText: fullDescriptionText && convertToRaw( fullDescriptionText )
    });
    
    history.goBack();
  }


  const saveField = async (fieldName: string, fieldData: any) => {

    let newEditorContent;
		newEditorContent = {};
		newEditorContent[fieldName] = fieldData;

    await editProfileMutation( newEditorContent );

  }

  error && console.log(error);
  profileData.error && console.log(profileData);

  const [initialProfileData, setInitialProfileData] = useState(false);

  useEffect(() => {

    if (profileData.status === "success" ) {

      setProfileName(profileData.data?.profileName);
      setYourSport(profileData.data?.sport);
      setLocation(profileData.data?.location);
      setPriceRange(profileData.data?.priceRange);
      setWebsite(profileData.data?.website);
      
      setSocialMedia(profileData.data?.socialMedia);

      setFacebookTotal(profileData.data?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'facebook'; })?.socialMediaTotal);
      setFacebookUrl(profileData.data?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'facebook'; })?.socialMediaUrl);
      
      setInstagramTotal(profileData.data?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'instagram'; })?.socialMediaTotal);
      setInstagramUrl(profileData.data?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'instagram'; })?.socialMediaUrl);
      
      setTwitterTotal(profileData.data?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'twitter'; })?.socialMediaTotal);
      setTwitterUrl(profileData.data?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'twitter'; })?.socialMediaUrl);
      
      setYouTubeTotal(profileData.data?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'youTube'; })?.socialMediaTotal);
      setYouTubeUrl(profileData.data?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'youTube'; })?.socialMediaUrl);

      setShortDescription(profileData.data?.shortDescription);
      setFullDescription(profileData.data?.description);
      
      setFullDescriptionText( profileData.data?.fullDescriptionText && convertFromRaw( profileData.data?.fullDescriptionText ) );
      
      // setAccolades(profileData.data?.accolades);
      
      setCurrentProfilePicture(profileData.data?.profilePicture);
      setCoverImage(profileData.data?.coverImage);


    }

    
  }, [profileData]);

  useIonViewWillEnter(() => {

    if (profileData.status === "success" ) {

      
      setAccolades(profileData.data?.accolades);
      

    }

  });

  console.log(profileData?.data?.accolades);
  
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

  let showSports;

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

  
  console.log(accolades);

  const createAccolades = (e:any) => {

    console.log(e);
    
    let accoladeIndex = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement);
    let newAccolades: Array<any> = [];
    newAccolades = newAccolades.concat(accolades);
    newAccolades[accoladeIndex] = e.target.value;

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


  const socialMediaIcon = (socialMediaName:any) => {
		
		let socialMediaIconName = "";
		socialMediaName === 'facebook' && (socialMediaIconName = logoFacebook);
		socialMediaName === 'instagram' && (socialMediaIconName = logoInstagram);
		socialMediaName === 'twitter' && (socialMediaIconName = logoTwitter);
		socialMediaName === 'youTube' && (socialMediaIconName = logoYoutube);

		return socialMediaIconName;
	}
 

  return (
    <IonPage>
      

      <TabBar activeTab="profile" />
      <IonContent className="editor-content" fullscreen>
        <div className="content">
          <div className="edit-profile">
            <h1 style={{color: "var(--ion-color-dark)", lineHeight: 0.8, fontSize: "4em", padding: "15px"}}>EDIT <br/><span style={{color: "var(--ion-color-primary)"}}>PROFILE</span></h1>
            <div className="editor-wrap">

              <EditorSectionProfile profileId={authState?.user.profile} fieldRef="profileName" label={"Profile Name"} currentValue={profileName} />

              <NewImageUpload3 
                currentImage={ coverImage } 
                setCurrentImage={ setCoverImage } 
                field="coverImage" 
                theref="profile" 
                refId={ authState?.user.profile }
                imageCropAspectRatio={3 / 1} 
                circularCrop={false}
                // showCroppedPreview={ false }
                label="Cover Image" 
                required={true} 
                />

              <NewImageUpload3 
                className="profile-picture-upload"
                currentImage={ currentProfilePicture } 
                setCurrentImage={ setCurrentProfilePicture } 
                field="profilePicture" 
                theref="profile" 
                refId={ authState?.user.profile }
                imageCropAspectRatio={1} 
                circularCrop={true}
                // showCroppedPreview={ false }
                label="Profile Picture"
                required={true}
                />


              <div className="editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Your Sport</label>

                  <div className="editor-section-top-buttons">

                    { profileData.isSuccess && yourSport === profileData?.data[0]?.sport && <div className="editor-section-button" onClick={() => { setShowModal(true); focusOnSport(); }}>{ yourSport ? "Edit" : "Add"}</div> }

                    { profileData.isSuccess && yourSport !== profileData?.data[0]?.sport && <div className="editor-section-button" onClick={() => { saveField("sport", yourSport ) }}>Save</div> }
 
                  </div>	

                </div>

                <div className="editor-section-bottom">
                
                  <div className="">{ yourSport }</div>
                  {/* <IonInput placeholder="Please select your sport" value= readonly={true} type="text"  />  */}

                </div>

              </div>
              
              <div className="editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Location</label>

                  <div className="editor-section-top-buttons">

                    { profileData.isSuccess && location?.label === profileData?.data[0]?.location?.label && (!showLocation && <div className="editor-section-button" onClick={() => { setShowLocation(true); }}>{ location ? "Edit" : "Add"}</div>) }

                    { showLocation && <div className="editor-section-button" onClick={() => { saveField("location", location ); saveField("latLong", latLong ); setShowLocation(false); }}>Save</div> }
 
                  </div>	

                </div>
                
                <div className={"editor-section-bottom " + (location?.label ? "" : "")}>
                      
                      { !showLocation && (location ? location?.label : "Add a location...")}

                      { showLocation && <GooglePlacesAutocomplete
                          apiKey="AIzaSyBVk9Y4B2ZJG1_ldwkfUPfgcy48YzNTa4Q"
                          selectProps={{
                            location: location,
                            onChange: doLocationSelected,
                            placeholder: location ? location?.label : "Start typing to select location",
                            menuPlacement: "auto",
                            className: "google-places"
                          }}
                          autocompletionRequest={{
                            componentRestrictions: {
                              country: ['uk', 'ie'],
                            }
                          }}
                        /> }
              
                </div> 

              </div>


              <EditorSectionProfile profileId={authState?.user.profile} fieldRef="website" label={"Website"} currentValue={website} />
              

              <div className="editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Social Media</label>

                  <div className="editor-section-top-buttons">

                    { profileData.isSuccess && !showSocials && <div className="editor-section-button" onClick={() => { setShowSocials(true); }}>{ socialMedia ? "Edit" : "Add"}</div> }

                    { showSocials && <div className="editor-section-button" onClick={() => { saveField("socialMedia", socialMediaObject ); setShowSocials(false); }}>Save</div> }
 
                  </div>	

                </div>
                
                <div className="editor-section-bottom">

                  {  profileData.isSuccess && !showSocials && <SocialMediaTotals socialMediaData={profileData?.data[0]?.socialMedia} showEmpty={true} /> }


                  {  profileData.isSuccess && showSocials && <div className="social-media-fields">

                        <div className="social-media-field">

                          <IonIcon color={ facebookTotal || facebookUrl ? "primary" : "tertiary" } size="large" icon={ socialMediaIcon("facebook") } />
                          <div className="total">
                            <div className="label">
                              <label>Total</label>
                            </div>
                            
                            <IonInput type="number" value={ facebookTotal && facebookTotal } onIonChange={ (e:any) => setFacebookTotal(e.detail.value) } />
                          </div>
                          <div className="url">
                            <div className="label">
                              <label>URL</label>
                            </div>
                            <IonInput type="text" value={ facebookUrl && facebookUrl } onIonChange={ (e:any) => setFacebookUrl(e.detail.value) } />
                          </div>
                          
                        </div>
                        <div className="social-media-field">

                          <IonIcon color={ instagramTotal || instagramUrl ? "primary" : "tertiary" } size="large" icon={ socialMediaIcon("instagram") } />
                          <div className="total">
                            <div className="label">
                              <label>Total</label>
                            </div>
                            
                            <IonInput type="number" value={ instagramTotal && instagramTotal  } onIonChange={ (e:any) => setInstagramTotal(e.detail.value) } />
                          </div>
                          <div className="url">
                            <div className="label">
                              <label>URL</label>
                            </div>
                            <IonInput type="text" value={ instagramUrl && instagramUrl } onIonChange={ (e:any) => setInstagramUrl(e.detail.value) } />
                          </div>
                          
                        </div>
                        <div className="social-media-field">

                          <IonIcon color={ twitterTotal || twitterUrl ? "primary" : "tertiary" } size="large" icon={ socialMediaIcon("twitter") } />
                          <div className="total">
                            <div className="label">
                              <label>Total</label>
                            </div>
                            
                            <IonInput type="number" value={ twitterTotal && twitterTotal  } onIonChange={ (e:any) => setTwitterTotal(e.detail.value) } />
                          </div>
                          <div className="url">
                            <div className="label">
                              <label>URL</label>
                            </div>
                            <IonInput type="text" value={ twitterUrl && twitterUrl } onIonChange={ (e:any) => setTwitterUrl(e.detail.value) } />
                          </div>
                          
                        </div>
                        <div className="social-media-field">

                          <IonIcon color={ youTubeTotal || youTubeUrl ? "primary" : "tertiary" } size="large" icon={ socialMediaIcon("youTube") } />
                          <div className="total">
                            <div className="label">
                              <label>Total</label>
                            </div>
                            
                            <IonInput type="number" value={ youTubeTotal && youTubeTotal  } onIonChange={ (e:any) => setYouTubeTotal(e.detail.value) } />
                          </div>
                          <div className="url">
                            <div className="label">
                              <label>URL</label>
                            </div>
                            <IonInput type="text" value={ youTubeUrl && youTubeUrl } onIonChange={ (e:any) => setYouTubeUrl(e.detail.value) } />
                          </div>
                          
                        </div>
 

                      </div>
                      
                      }
                
                
                </div>
              </div>


              <EditorSectionProfile fieldType="IonTextarea" profileId={authState?.user.profile} fieldRef="shortDescription" label={"Short Description"} currentValue={shortDescription} />
              
              
              <div className="editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Achievements</label>

                  <div className="editor-section-top-buttons">

                    { profileData.isSuccess && (!showEditAccolades && <div className="editor-section-button" onClick={() => { setShowEditAccolades(true); }}>{ accolades?.length > 0  ? "Edit" : "Add"}</div>) }

                    { showEditAccolades && <div className="editor-section-button" onClick={() => { saveField("accolades", accolades?.filter(Boolean) ); setShowEditAccolades(false); }}>Save</div> }
   
                  </div>	

                </div>

                <div className={"editor-section-bottom " + (location?.label ? "" : "")}>
                      
                      { !showEditAccolades && (accolades?.length < 0 ? "Add an Achievement..." : 
                      
                      accolades?.length > 0 && accolades.map((accolade: string, index: any) => {

                        

                          return <div className="accolade" key={index}>
                                  { accolade && accolade }
                                </div>

                        })

                      )} 

                      

                      { showEditAccolades && <div className="">

                        <div className="accolade-list">

                          { accolades?.length > 0 && accolades.map((accolade: string, index: any) => {

                           

                            return <div className="accolade-field" key={index}>
                                    <IonInput placeholder="Your Achievement" value={accolade && accolade} id={"accolade-" + index} onIonChange={ (e:any) => createAccolades(e) } />
                                    <IonIcon icon={close} onClick={ (e) => { removeAccolade(e); } } />
                                  </div>

                                })

                          } </div>

                            <IonButton expand="block" size="small" className="button-tertiary" onClick={ () => addAccolade() } >Add Accolade</IonButton>

                      </div>  }

                 

                </div>

              </div>


              {profileData.isSuccess && <IonButton className="button-tertiary" expand="block" size="small" onClick={() => { client.invalidateQueries("profile-" + profileData.data.id); history.push('/profile/' + profileData.data.id)}}>Back to Profile</IonButton>}

            </div>

          </div>
        </div>
      
     
        
         
          
          
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
