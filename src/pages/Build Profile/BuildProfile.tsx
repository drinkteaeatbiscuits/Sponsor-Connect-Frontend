import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonList, IonModal, IonPage, IonSearchbar, IonTextarea, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import {useQueryClient } from 'react-query';
import useUpdateProfile from '../../hooks/useUpdateProfile';
import useMyProfile from '../../hooks/useMyProfile';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

import { convertFromRaw } from 'draft-js';
import 'react-image-crop/dist/ReactCrop.css';
import './BuildProfile.scss';

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
import ExampleProfileCard from '../../components/ExampleProfileCard/ExampleProfileCard';
import Arrow from '../CreateAccount/images/Arrow';
import { personCircle } from 'ionicons/icons';

export interface props { }


const BuildProfile: React.FC = () => {

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


  const [buildStep, setBuildStep] = useState("");


  const [facebookTotal, setFacebookTotal] = useState<any>(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'facebook'; })[0]?.socialMediaTotal);
  const [facebookUrl, setFacebookUrl] = useState<any>(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'facebook'; })[0]?.socialMediaUrl); 
  const [instagramTotal, setInstagramTotal] = useState<any>(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'instagram'; })[0]?.socialMediaTotal);
  const [instagramUrl, setInstagramUrl] = useState<any>(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'instagram'; })[0]?.socialMediaUrl);
  const [twitterTotal, setTwitterTotal] = useState<any>(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'twitter'; })[0]?.socialMediaTotal);
  const [twitterUrl, setTwitterUrl] = useState<any>(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'twitter'; })[0]?.socialMediaUrl);
  const [youTubeTotal, setYouTubeTotal] = useState<any>(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'youTube'; })[0]?.socialMediaTotal);
  const [youTubeUrl, setYouTubeUrl] = useState<any>(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'youTube'; })[0]?.socialMediaUrl);


//   console.log(profileData);

  const saveField = async (fieldName: string, fieldData: any) => {

    let newEditorContent;
    newEditorContent = {};
    newEditorContent[fieldName] = fieldData;

    await editProfileMutation(newEditorContent);

  }

  error && console.log(error);
  profileError && console.log(profileError);

  const updateSocialMediaObject = () => {
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

	setSocialMediaObject(socialMediaObject);
	setSocialMedia(socialMediaObject);
}

//   console.log(profileData);

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


	  if(profileData?.socialMedia ) {
		!facebookTotal && setFacebookTotal(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'facebook'; })[0]?.socialMediaTotal)
		!facebookUrl && setFacebookUrl(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'facebook'; })[0]?.socialMediaUrl)
	  
		!instagramTotal && setInstagramTotal(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'instagram'; })[0]?.socialMediaTotal)
		!instagramUrl && setInstagramUrl(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'instagram'; })[0]?.socialMediaUrl)
	  
		!twitterTotal && setTwitterTotal(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'twitter'; })[0]?.socialMediaTotal)
		!twitterUrl && setTwitterUrl(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'twitter'; })[0]?.socialMediaUrl)
	  
		!youTubeTotal && setYouTubeTotal(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'youTube'; })[0]?.socialMediaTotal)
		!youTubeUrl && setYouTubeUrl(profileData?.socialMedia?.filter(function (entry:any) { return entry.socialMediaName === 'youTube'; })[0]?.socialMediaUrl)
	  
	
	  } 

	  updateSocialMediaObject(); 

      setCurrentProfilePicture(profileData?.profilePicture);
      setCoverImage(profileData?.coverImage);

    }


  }, [profileData, isLoadingProfile, youTubeTotal, youTubeUrl, twitterTotal, twitterUrl, instagramTotal, instagramUrl, facebookTotal, facebookUrl ]);



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

      <MetaTags title={'Build Profile | Sponsor Connect'} path={'/profile/' + authState?.user.profile + '/build'} description={'Build your Sponsor Connect profile.'} image={ "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />  

      <TabBar activeTab="profile" />
      <IonContent className="editor-content" fullscreen>
        <div className="content build-profile">
          

				{!buildStep && 
					<div className="build-step build-profile-name">

						<div className="example-profile" style={{}}>
							<ExampleProfileCard profileName={profileName} sport={yourSport} image={coverImage} location={location}  description={shortDescription}  />
				
						</div>
						

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>What’s your <span style={{fontWeight: 700}}>Profile Name?</span></p>
							<p style={{marginTop: '8px'}}>This might be your own name, your team name or the name of your event.</p>
						</div>

						
						<div className="section-input">

							<IonInput autocomplete='off' 
								autocapitalize='words' 
								type='text'
								value={ profileName } 
								onIonChange={ (e:any) => {
									setProfileName( e.detail.value );   
								} } />
						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							{/* <IonButton className="arrow previous" onClick={() => console.log('previous')} expand="block"><Arrow /></IonButton> */}
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('sport')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => { setBuildStep('sport'); saveField("profileName", profileName) }} expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}

				{ buildStep === 'sport' && 
					<div className="build-step">

						<div className="example-profile" style={{}}>
							<ExampleProfileCard profileName={profileName} sport={yourSport} image={coverImage} location={location}  description={shortDescription}  />
				
						</div>
						

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>What is the name of your <span style={{fontWeight: 700}}>sport?</span></p>
							<p style={{marginTop: '8px'}}>Please select the sport that you are looking for sponsorship.</p>
						</div>

						
						<div className="section-input">
							<IonInput autocomplete='off' 
								autocapitalize='words' 
								type='text'
								value={ yourSport } 
								onClick={() => { setShowModal(true); focusOnSport(); }}
								className="sport-input"
								placeholder='Your sport...'
								disabled
								 />

						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							<IonButton className="arrow previous" onClick={() => setBuildStep('')} expand="block"><Arrow /></IonButton>
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('cover')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => { setBuildStep('cover'); saveField("sport", yourSport) } } expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}

				{ buildStep === 'cover' && 
					<div className="build-step">

						<div className="example-profile" style={{}}>
							<ExampleProfileCard profileName={profileName} sport={yourSport} image={coverImage} location={location}  description={shortDescription}  />
				
						</div>
						

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>Please add a <span style={{fontWeight: 700}}>cover photo.</span></p>
							<p style={{marginTop: '8px'}}>This image will sit at the top of your profile.</p>
						</div>

						
						<div className="section-input">
							
							<NewImageUpload3
								currentImage={coverImage}
								setCurrentImage={setCoverImage}
								field="coverImage"
								theref="profile"
								refId={authState?.user.profile}
								imageCropAspectRatio={3 / 1}
								circularCrop={false}
								showCroppedPreview={ false }
								label="Cover Image"
								required={true}
								isProfileBuild
								/>

						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							<IonButton className="arrow previous" onClick={() => setBuildStep('sport')} expand="block"><Arrow /></IonButton>
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('description')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => setBuildStep('description')} expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}

				{ buildStep === 'description' && 
					<div className="build-step short-description-step">

						<div className="example-profile" style={{}}>
							<ExampleProfileCard profileName={profileName} sport={yourSport} image={coverImage} location={location}  description={shortDescription}  />
						</div>
						

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>How would you <span style={{fontWeight: 700}}>describe</span> yourself?</p>
							<p style={{marginTop: '8px'}}>A brief description to help potential sponsors learn more about you.</p>
						</div>

						
						<div className="section-input">
				
								<IonTextarea value={ shortDescription } autocapitalize='on' onIonChange={ (e:any) => {
								setShortDescription( e.detail.value ); }} />

						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							<IonButton className="arrow previous" onClick={() => setBuildStep('cover')} expand="block"><Arrow /></IonButton>
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('location')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => {setBuildStep('location');  saveField("shortDescription", shortDescription)}} expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}

				{ buildStep === 'location' && 
					<div className="build-step">

						<div className="example-profile" style={{}}>
							<ExampleProfileCard profileName={profileName} sport={yourSport} image={coverImage} location={location}  description={shortDescription}  />
						</div>
						
						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>Where is your <span style={{fontWeight: 700}}>location?</span></p>
							<p style={{marginTop: '8px'}}>This is to help nearby sponsors find you.</p>
						</div>

						<div className="section-input">

							<GooglePlacesAutocomplete
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
							/>

						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							<IonButton className="arrow previous" onClick={() => setBuildStep('location')} expand="block"><Arrow /></IonButton>
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('profilePicture')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => {setBuildStep('profilePicture');  saveField("location", location)}} expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}
				{buildStep === 'profilePicture' && 
					<div className="build-step">

						<div className="example-profile" style={{}}>
							<div className="avatar">
								<div className="avatar-image">
									
									{ currentProfilePicture ? 
									
									<picture>
										<source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  currentProfilePicture?.hash + ".webp" } />
										<source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  currentProfilePicture?.hash + currentProfilePicture?.ext } />
										<img className="profile-picture" alt={ "Profile Image " + currentProfilePicture.id } src={ process.env.REACT_APP_S3_URL + "/images/profile/" +  currentProfilePicture?.hash + currentProfilePicture?.ext } /> 
									</picture>
									
									: <IonIcon color="medium" icon={personCircle} /> }
									
								</div>
							</div>
						</div>
						

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>Please add a <span style={{fontWeight: 700}}>profile picture.</span></p>
							<p style={{marginTop: '8px'}}>This could be your logo, or a photo.</p>
						</div>

						
						<div className="section-input">

							<NewImageUpload3
							className="profile-picture-upload"
							currentImage={currentProfilePicture}
							setCurrentImage={setCurrentProfilePicture}
							field="profilePicture"
							theref="profile"
							refId={authState?.user.profile}
							imageCropAspectRatio={1}
							circularCrop={true}
							showCroppedPreview={ false }
							label="Profile Picture"
							required={true}
							isProfileBuild
							/>

						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							<IonButton className="arrow previous" onClick={() => setBuildStep('location')} expand="block"><Arrow /></IonButton>
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('website')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => setBuildStep('website')} expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}

				{buildStep === 'website' && 
					<div className="build-step build-website">

						<div className="example-profile" style={{}}>
							<ExampleProfileCard profileName={profileName} sport={yourSport} image={coverImage} location={location}  description={shortDescription}  />
				
						</div>
						

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>Do you have a <span style={{fontWeight: 700}}>website?</span></p>
							<p style={{marginTop: '8px'}}>This could also be a social media profile.</p>
						</div>

						
						<div className="section-input">

							<IonInput autocomplete='off' 
								autocapitalize='words' 
								type='text'
								value={ website } 
								placeholder="www.yourwebsite.com"
								onIonChange={ (e:any) => {
									setWebsite( e.detail.value );   
								} } />
						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							<IonButton className="arrow previous" onClick={() => setBuildStep('profilePicture')} expand="block"><Arrow /></IonButton>
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('facebook')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => {setBuildStep('facebook'); saveField("website", website) }} expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}

				{buildStep === 'facebook' && 
					<div className="build-step build-social-media">

						<div className="example-profile" style={{}}>
							<SocialMediaTotals socialMediaData={profileData?.socialMedia} showEmpty={true} />
						</div>
						

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>Please enter details about <span style={{fontWeight: 700}}>Facebook.</span></p>
							<p style={{marginTop: '8px'}}>These can be rounded total followers.</p>
						</div>


						
						<div className="section-input">
							<label style={{fontSize: '14px', padding: '8px 3px 0'}}>Total</label>
							<IonInput type="number" value={ facebookTotal && facebookTotal } onIonChange={ (e:any) => setFacebookTotal(e.detail.value) } />
							<label style={{fontSize: '14px', padding: '8px 3px 0'}}>Link</label>
							<IonInput type="text" value={ facebookUrl && facebookUrl } onIonChange={ (e:any) => setFacebookUrl(e.detail.value) } />
							
						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							<IonButton className="arrow previous" onClick={() => setBuildStep('website')} expand="block"><Arrow /></IonButton>
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('instagram')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => {setBuildStep('instagram'); saveField("socialMedia", socialMediaObject) }} expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}

				{buildStep === 'instagram' && 
					<div className="build-step build-social-media">

						<div className="example-profile" style={{}}>
							<SocialMediaTotals socialMediaData={profileData?.socialMedia} showEmpty={true} />
						</div>
						

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>Please enter details about <span style={{fontWeight: 700}}>Instagram.</span></p>
							<p style={{marginTop: '8px'}}>These can be rounded total followers.</p>
						</div>

						
						<div className="section-input">
							<label style={{fontSize: '14px', padding: '8px 3px 0'}}>Total</label>
							<IonInput type="number" value={ instagramTotal && instagramTotal } onIonChange={ (e:any) => setInstagramTotal(e.detail.value) } />
							<label style={{fontSize: '14px', padding: '8px 3px 0'}}>Link</label>
							<IonInput type="text" value={ instagramUrl && instagramUrl } onIonChange={ (e:any) => setInstagramUrl(e.detail.value) } />
							
						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							<IonButton className="arrow previous" onClick={() => setBuildStep('facebook')} expand="block"><Arrow /></IonButton>
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('twitter')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => {setBuildStep('twitter'); saveField("socialMedia", socialMediaObject) }} expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}

				{buildStep === 'twitter' && 
					<div className="build-step build-social-media">

						<div className="example-profile" style={{}}>
							<SocialMediaTotals socialMediaData={profileData?.socialMedia} showEmpty={true} />
						</div>
						

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>Please enter details about <span style={{fontWeight: 700}}>Twitter.</span></p>
							<p style={{marginTop: '8px'}}>These can be rounded total followers.</p>
						</div>

						
						<div className="section-input">
							<label style={{fontSize: '14px', padding: '8px 3px 0'}}>Total</label>
							<IonInput type="number" value={ twitterTotal && twitterTotal } onIonChange={ (e:any) => setTwitterTotal(e.detail.value) } />
							<label style={{fontSize: '14px', padding: '8px 3px 0'}}>Link</label>
							<IonInput type="text" value={ twitterUrl && twitterUrl } onIonChange={ (e:any) => setTwitterUrl(e.detail.value) } />
							
						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							<IonButton className="arrow previous" onClick={() => setBuildStep('instagram')} expand="block"><Arrow /></IonButton>
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('youtube')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => {setBuildStep('youtube'); saveField("socialMedia", socialMediaObject) }} expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}

				{buildStep === 'youtube' && 
					<div className="build-step build-social-media">

						<div className="example-profile" style={{}}>
							<SocialMediaTotals socialMediaData={profileData?.socialMedia} showEmpty={true} />
						</div>
						

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>Please enter details about <span style={{fontWeight: 700}}>YouTube.</span></p>
							<p style={{marginTop: '8px'}}>These can be rounded total followers.</p>
						</div>

						
						<div className="section-input">
							<label style={{fontSize: '14px', padding: '8px 3px 0'}}>Total</label>
							<IonInput type="number" value={ youTubeTotal && youTubeTotal } onIonChange={ (e:any) => setYouTubeTotal(e.detail.value) } />
							<label style={{fontSize: '14px', padding: '8px 3px 0'}}>Link</label>
							<IonInput type="text" value={ youTubeUrl && youTubeUrl } onIonChange={ (e:any) => setYouTubeUrl(e.detail.value) } />
							
						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							<IonButton className="arrow previous" onClick={() => setBuildStep('twitter')} expand="block"><Arrow /></IonButton>
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('achievements')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => {setBuildStep('achievements'); saveField("socialMedia", socialMediaObject) }} expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}

				{buildStep === 'achievements' && 
					<div className="build-step build-achievements">
						
						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '24px 5px 0'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>Tell everyone about your <span style={{fontWeight: 700}}>achievements.</span></p>
							<p style={{marginTop: '8px'}}>This could be competitions you've won or milestones you've reached.</p>
						</div>

						
						<div className="section-input editor-section ">
							<div className="editor-section-bottom">

								<AchievementsEdit achievements={accolades} setAchievements={setAccolades} />
							</div>
						</div>

						<div className="build-navigation" style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

							<IonButton className="arrow previous" onClick={() => setBuildStep('youtube')} expand="block"><Arrow /></IonButton>
							<IonButton button-type="link" size="small" onClick={() => setBuildStep('youtube')} expand="block">Skip</IonButton>
							<IonButton className="arrow primary-button" onClick={() => {setBuildStep('youtube'); saveField("accolades", accolades?.filter(Boolean));}} expand="block"><Arrow className="next-arrow" /></IonButton>
						
						</div>
						

					</div>
				}




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

export default BuildProfile;
