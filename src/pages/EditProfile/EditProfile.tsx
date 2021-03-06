import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonModal, IonPage, IonSearchbar, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import {useQueryClient } from 'react-query';
import useUpdateProfile from '../../hooks/useUpdateProfile';
import useMyProfile from '../../hooks/useMyProfile';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

import { convertFromRaw } from 'draft-js';
import 'react-image-crop/dist/ReactCrop.css';
import './edit-profile.scss';

import sports from '../CreateAccount/sports.json';

import NewImageUpload3 from '../../components/NewImageUpload3/NewImageUpload3';
import TabBar from '../../components/TabBar';
import EditorSectionProfile from '../../components/EditorSection/EditorSectionProfile';
import useEditProfileField from '../../hooks/useEditProfileField';
import SocialMediaTotals from '../../components/SocialMediaTotals/SocialMediaTotals';
import SocialMediaTotalsEdit from '../../components/SocialMediaTotalsEdit/SocialMediaTotalsEdit';
import AchievementsEdit from '../../components/AchievementsEdit/AchievementsEdit';
import ErrorBoundary from '../../containers/ErrorBoundary/ErrorBoundary';
import MetaTags from '../../components/MetaTags/MetaTags';
import { images, pencil, person, rocket } from 'ionicons/icons';
import EditProfileTabs from '../../components/EditProfileTabs/EditProfileTabs';

export interface props { }


const EditProfile: React.FC = () => {

  const client = useQueryClient();

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const { isLoading, error, mutateAsync: addProfileMutation } = useUpdateProfile(authState?.user?.profile);
  const { isLoading: isEditingOpportunity, error: editOpportunityError, isSuccess, mutateAsync: editProfileMutation } = useEditProfileField(authState?.user?.profile);

  const { isSuccess: isSuccessProfile, isLoading: isLoadingProfile, data: profileData, error: profileError } = useMyProfile(authState?.user.profile);

  const [profileName, setProfileName] = useState(profileData?.profileName);
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

  const [socialMedia, setSocialMedia] = useState<Array<object>>([]);
  const [accolades, setAccolades] = useState<any>([]);


  const [shortDescription, setShortDescription] = useState<any>("");
  const [fullDescription, setFullDescription] = useState<any>("");
  const [currentProfilePicture, setCurrentProfilePicture] = useState<any>("");

  const [coverImage, setCoverImage] = useState<any>("");


  const [fullDescriptionText, setFullDescriptionText] = useState();

  const [socialMediaObject, setSocialMediaObject] = useState([{}]);


  const subscriptionActive = () => {
    if(authState?.mySubscription?.subscriptionStatus === 'active'){
      return true
    }else{
      return false
    }
  }

  const saveField = async (fieldName: string, fieldData: any) => {

    let newEditorContent;
    newEditorContent = {};
    newEditorContent[fieldName] = fieldData;

    await editProfileMutation(newEditorContent);

  }

  error && console.log(error);
  profileError && console.log(profileError);


  useEffect(() => {

    if (!isLoadingProfile) {
     
      setProfileName(profileData?.profileName);
      
    }

    if (!isLoadingProfile) {

      // !profileName && setProfileName(profileData?.data?.profileName);
      
      setYourSport(profileData?.sport);

      !location && setLocation(profileData?.location);
      setPriceRange(profileData?.priceRange);
      !website && setWebsite(profileData?.website);

      !shortDescription && setShortDescription(profileData?.shortDescription);
      setFullDescription(profileData?.description);

      setFullDescriptionText(profileData?.fullDescriptionText && convertFromRaw(profileData?.fullDescriptionText));

      accolades?.length === 0 && setAccolades(profileData?.accolades);

      setCurrentProfilePicture(profileData?.profilePicture);
      setCoverImage(profileData?.coverImage);

    }


  }, [profileData, isLoadingProfile]);



  const focusOnSport = () => {

    document.addEventListener('ionModalDidPresent', () => { document.querySelector('ion-searchbar')?.setFocus(); });

  }

  const doLocationSelected = (event: any) => {

    setLocation(event);
    geocodeByAddress(event.label)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {

        setLatLong({ lat, lng });
      }
      );
  }

  let showSports;

  if (filteredSports?.length > 0) {

    showSports = filteredSports.map((data: any, index) => {
      return (
        <IonItem className="sport" onClick={() => { setYourSport(data); setShowModal(false); }} key={data + '-' + index}>{data}</IonItem>
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


  return (
    <IonPage>

      <MetaTags title={'Edit Profile | Sponsor Connect'} path={'/profile/' + authState?.user.profile + '/edit'} description={'Edit Sponsor Connect profile.'} image={ "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />  


      <TabBar activeTab="profile" />
      <IonContent className="editor-content" fullscreen>
        <div className="content">
          <div className="edit-profile">
            <h1 style={{ color: "var(--ion-color-dark)", lineHeight: 0.8, fontSize: "4em", padding: "15px" }}>EDIT <br /><span style={{ color: "var(--ion-color-primary)" }}>PROFILE</span></h1>
            
            <EditProfileTabs value='profile' />


            <div className="editor-wrap">

              <ErrorBoundary>
                <EditorSectionProfile autocapitalize='words' 
                profileId={authState?.user.profile} fieldRef="profileName" 
                label={"Profile Name"} currentValue={profileName} setValue={setProfileName} />
              </ErrorBoundary>

              <ErrorBoundary>
                <NewImageUpload3
                  currentImage={coverImage}
                  setCurrentImage={setCoverImage}
                  field="coverImage"
                  theref="profile"
                  refId={authState?.user.profile}
                  imageCropAspectRatio={3 / 1}
                  circularCrop={false}
                  showCroppedPreview={ true }
                  label="Cover Image"
                  required={true}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <NewImageUpload3
                  className="profile-picture-upload"
                  currentImage={currentProfilePicture}
                  setCurrentImage={setCurrentProfilePicture}
                  field="profilePicture"
                  theref="profile"
                  refId={authState?.user.profile}
                  imageCropAspectRatio={1}
                  circularCrop={true}
                  showCroppedPreview={ true }
                  label="Profile Picture"
                  required={true}
                />
              </ErrorBoundary>

              <div className="editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Your Sport</label>

                  <div className="editor-section-top-buttons">

  

                    {isSuccessProfile && yourSport === profileData?.sport && <div className="editor-section-button" onClick={() => { setShowModal(true); focusOnSport(); }}>{yourSport ? "Edit" : "Add"}</div>}

                    {isSuccessProfile && yourSport !== profileData?.sport && <div className="editor-section-button" onClick={() => { saveField("sport", yourSport) }}>Save</div>}

                  </div>

                </div>

                <div className="editor-section-bottom">

                  <div className="">{yourSport}</div>
                  {/* <IonInput placeholder="Please select your sport" value= readonly={true} type="text"  />  */}

                </div>

              </div>

              <div className="editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Location</label>

                  <ErrorBoundary> <div className="editor-section-top-buttons">

                    {isSuccessProfile && location?.label === profileData?.location?.label && (!showLocation && <div className="editor-section-button" onClick={() => { setShowLocation(true); }}>{location ? "Edit" : "Add"}</div>)}

                    {showLocation && <div className="editor-section-button" onClick={() => { saveField("location", location); saveField("latLong", latLong); setShowLocation(false); }}>Save</div>}

                  </div>	</ErrorBoundary>

                </div>

                <ErrorBoundary><div className={"editor-section-bottom " + (location?.label ? "" : "")}>

                  {!showLocation && (location ? location?.label : "Add a location...")}

                  {showLocation && <GooglePlacesAutocomplete
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
                  />}

                </div>
                </ErrorBoundary>

              </div>


              <ErrorBoundary>
                <EditorSectionProfile autocapitalize='off' profileId={authState?.user.profile} fieldRef="website" label={"Website"} currentValue={website} setValue={setWebsite} />
              </ErrorBoundary>

              <div className="editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Social Media</label>

                  <div className="editor-section-top-buttons">
                    <ErrorBoundary>
                      {isSuccessProfile && !showSocials ? <div className="editor-section-button" onClick={() => { setShowSocials(true); }}>{socialMedia ? "Edit" : "Add"}</div> :
                        <div className="editor-section-button secondary" onClick={() => { setShowSocials(false); setSocialMediaObject(profileData?.socialMedia) }}>Cancel</div>}

                      {showSocials && <div className="editor-section-button" onClick={() => {
                   
                        saveField("socialMedia", socialMediaObject);
                        setShowSocials(false);
                      }}>Save</div>}
                    </ErrorBoundary>
                  </div>

                </div>

                <div className="editor-section-bottom">
                  <ErrorBoundary>
                    {isSuccessProfile && !showSocials && <SocialMediaTotals socialMediaData={profileData?.socialMedia} showEmpty={true} />}

                    {isSuccessProfile && showSocials && <SocialMediaTotalsEdit socialMediaData={profileData?.socialMedia} setSocialMediaObject={setSocialMediaObject} />}
                  </ErrorBoundary>

                </div> 
              </div>


              <ErrorBoundary>
                <EditorSectionProfile autocapitalize='on' fieldType="IonTextarea" profileId={authState?.user.profile} fieldRef="shortDescription" label={"Short Description"} currentValue={shortDescription} setValue={setShortDescription} />
              </ErrorBoundary>

              <div className="editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Achievements</label>

                  <div className="editor-section-top-buttons">
                    <ErrorBoundary>
                      {isSuccessProfile && (!showEditAccolades ? <div className="editor-section-button" onClick={() => { setShowEditAccolades(true); }}>{accolades?.length > 0 ? "Edit" : "Add"}</div> :
                        <div className="editor-section-button secondary" onClick={() => { setShowEditAccolades(false); setAccolades(profileData?.accolades) }}>Cancel</div>)}

                      {showEditAccolades && <div className="editor-section-button" onClick={() => { saveField("accolades", accolades?.filter(Boolean)); setShowEditAccolades(false); }}>Save</div>}
                    </ErrorBoundary>
                  </div>

                </div>
                <ErrorBoundary>
                  <div className={"editor-section-bottom " + (location?.label ? "" : "")}>

                    {!showEditAccolades && (accolades?.length < 0 ? "Add an Achievement..." :

                      accolades?.length > 0 && accolades.map((accolade: string, index: any) => {

                        return <div className="accolade" key={index}>
                          {accolade && accolade}
                        </div>

                      })

                    )}


                    {showEditAccolades && <AchievementsEdit achievements={accolades} setAchievements={setAccolades} />}


                  </div>
                </ErrorBoundary>

              </div>

              { !subscriptionActive() && <IonButton className="" style={{
              '--background': 'var(--ion-color-primary)',
              '--border-radius': '30px',
              '--padding-start': '24px',
              '--padding-end': '30px',
              marginInlineStart: 'auto',
              marginInlineEnd: 0,
              height: '56px',
              fontWeight: 500,
              color: '#fff',
              margin: '24px 0 0'
              }} size="small" expand='block' onClick={()=> history.push( "/subscribe" )}
              ><IonIcon style={{margin: '0 8px 0 0', color: 'var(--ion-color-primary-tint)'}} icon={rocket} /> Make Profile Live &gt;</IonButton>
              }
              {isSuccessProfile && <IonButton style={{marginTop: '8px'}} className="button-tertiary" expand="block" size="small" onClick={() => { client.invalidateQueries("profile-" + profileData.id); history.push(authState?.user.profileSlug ? "/" + authState?.user.profileSlug : "/profile/" + authState?.user.profile) }}>Back to Profile</IonButton>}

              
            </div>

          </div>
        </div>






        <IonModal isOpen={showModal} animated={true} cssClass='select-sport-modal' backdropDismiss={false} >

          <ErrorBoundary>
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
            
          </ErrorBoundary>

        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
