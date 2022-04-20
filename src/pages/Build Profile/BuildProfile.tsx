import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonList, IonModal, IonPage, IonPopover, IonSearchbar, IonTextarea, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import {useQueryClient } from 'react-query';
import useUpdateProfile from '../../hooks/useUpdateProfile';
import useMyProfile from '../../hooks/useMyProfile';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

import { convertFromRaw, convertToRaw } from 'draft-js';
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
import { chatbubbles, map, personCircle, rocket, trailSign } from 'ionicons/icons';
import TextEditor from '../../components/TextEditor/TextEditor';
import BuildNavigation from '../../components/BuildNavigation/BuildNavigation';
import ProfileTodoList from '../../components/ProfileTodoList/ProfileTodoList';

export interface props { }


const BuildProfile: React.FC = () => {

  const client = useQueryClient();

  const history = useHistory();
  const { state: authState, dispatch } = React.useContext(AuthContext);

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

  const [informationAboutYou, setInformationAboutYou] : any = useState();
  const [competitionInformation, setCompetitionInformation] : any = useState();
  const [supportersInformation, setSupportersInformation] : any = useState();
  const [anyOtherInfo, setAnyOtherInfo] : any = useState();

  const [informationAboutYouTipState, setInformationAboutYouTipState] = useState({
	showPopover: false,
	event: undefined
  });
  const [competitionInformationTipState, setCompetitionInformationTipState] = useState({
	showPopover: false,
	event: undefined
});

const [supportersInformationTipState, setSupportersInformationTipState] = useState({
	showPopover: false,
	event: undefined
});
const [anyOtherInfoTipState, setAnyOtherInfoTipState] = useState({
	showPopover: false,
	event: undefined
});

//   console.log(profileData);



  const saveField = async (fieldName: string, fieldData: any) => {

	// console.log(fieldData);

    let newEditorContent;
    newEditorContent = {};
    newEditorContent[fieldName] = fieldData;

    await editProfileMutation(newEditorContent);


	isProfileComplete();

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

const [profileComplete, setProfileComplete] = useState<any>({ profile: true, opportunity: false });

const isProfileComplete = () => {

	if( authState.user.profileComplete === 100 ){

		setProfileComplete( { profile: true, opportunity: true } );

	}else if( authState.user.profileCompletionList.length === 1 && authState.user.profileCompletionList[0] === "Add at least one active opportunity") {
		
		setProfileComplete({ profile: true, opportunity: false } );

	} else {

		setProfileComplete( { profile: false, opportunity: false } );
	}
}

// console.log(profileComplete);
// console.log(authState.user.profileCompletionList);
// console.log(authState.user.profileComplete);

  useEffect(() => {

	isProfileComplete();

    if (isSuccessProfile) {
     
      setProfileName(profileData?.profileName);
      
    }

	if (isSuccessProfile) {

		setInformationAboutYou(profileData.data?.informationAboutYou && convertFromRaw( profileData.data?.informationAboutYou ));
  
		setCompetitionInformation(profileData.data?.competitionInformation && convertFromRaw( profileData.data?.competitionInformation ));
  
		setSupportersInformation(profileData.data?.supportersInformation && convertFromRaw( profileData.data?.supportersInformation ));
  
		setAnyOtherInfo(profileData.data?.anyOtherInfo && convertFromRaw( profileData.data?.anyOtherInfo ));
  

      // !profileName && setProfileName(profileData?.data?.profileName);
      
      setYourSport(profileData?.sport);

      !location && setLocation(profileData?.location);
      setPriceRange(profileData?.priceRange);
      !website && setWebsite(profileData?.website);

      !shortDescription && setShortDescription(profileData?.shortDescription);
      setFullDescription(profileData?.description);

      setFullDescriptionText(profileData?.fullDescriptionText && convertFromRaw(profileData?.fullDescriptionText));

      accolades?.length === 0 && profileData?.accolades.length > 0 ? setAccolades(profileData?.accolades) : setAccolades([""]);


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


  }, [ profileData, isSuccessProfile, isLoadingProfile, youTubeTotal, youTubeUrl, twitterTotal, twitterUrl, instagramTotal, instagramUrl, facebookTotal, facebookUrl ]);


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

  const [ stepNumber, setStepNumber ] = useState(0);
  const stepNames = [
	"profileName", 
	"sport",
	"cover",
	"description",
	"location",
	"profilePicture",
	"website",
	"facebook",
	"instagram",
	"twitter",
	"youtube",
	"achievements",
	"informationAboutYou",
	"competitionInformation",
	"supportersInformation",
	"anyOtherInfo",
	"buildComplete"
  ];

  
	


  return (
    <IonPage>

      <MetaTags title={'Build Profile | Sponsor Connect'} path={'/profile/' + authState?.user.profile + '/build'} description={'Build your Sponsor Connect profile.'} image={ "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />  

      <TabBar activeTab="profile" />
      <IonContent className="editor-content" fullscreen>
        <div className="content build-profile">

				<div className="progress-dots" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '18px 16px 0'}}>
					{stepNames.map((step, index) => {
						return <div className="dot" key={step} style={{
							backgroundColor: stepNumber >= index ? 'var(--ion-color-primary)' : 'var(--ion-color-tertiary-tint)',
							margin: '0', 
							flexGrow: 1,
							// width: '12px', 
							height: '7px', 
							borderRadius: index === 0 && stepNumber !== 0 ? '7px 0 0 7px' : index === ( stepNames.length - 1 ) ? '0 7px 7px 0' : stepNumber === index ? index === 0 ? '7px' : '0 7px 7px 0' : '0',
							// boxShadow: stepNumber === index ? '0 0 0 2px var(--ion-color-primary)' : '0 0 0 3px transparent',
						
						}}></div>
					})}
					
				</div>
          

				{stepNumber === 0 && 
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


						<BuildNavigation isFirst saveFieldName="profileName" saveFieldValue={profileName} className="" setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />
						

					</div>
				}

				{ stepNumber === 1 && 
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
	
						<BuildNavigation className="" saveFieldName="sport" saveFieldValue={yourSport}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />
						

					</div>
				}

				{ stepNumber === 2 && 
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

	

						<BuildNavigation className=""   
						setStepNumber={setStepNumber} stepNumber={stepNumber} />
						

					</div>
				}

				{ stepNumber === 3 && 
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

			

						
						<BuildNavigation className="" saveFieldName="shortDescription" saveFieldValue={shortDescription}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />
						

					</div>
				}

				{ stepNumber === 4 && 
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

						
						<BuildNavigation className="" saveFieldName="location" saveFieldValue={location}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />

					</div>
				}
				{ stepNumber === 5 && 
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

						<BuildNavigation className=""   
						setStepNumber={setStepNumber} stepNumber={stepNumber}  />
						

					</div>
				}

				{ stepNumber === 6 && 
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
						
						<BuildNavigation className="" saveFieldName="website" saveFieldValue={website}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />

					</div>
				}

				{ stepNumber === 7 && 
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

						<BuildNavigation className="" saveFieldName="socialMedia" saveFieldValue={socialMediaObject}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />
						

					</div>
				}

				{stepNumber === 8 && 
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

						<BuildNavigation className="" saveFieldName="socialMedia" saveFieldValue={socialMediaObject}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />
						

					</div>
				}

				{stepNumber === 9 && 
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

						<BuildNavigation className="" saveFieldName="socialMedia" saveFieldValue={socialMediaObject}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />

					</div>
				}

				{stepNumber === 10 && 
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

						<BuildNavigation className="" saveFieldName="socialMedia" saveFieldValue={socialMediaObject}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />

					</div>
				}

				{stepNumber === 11 && 
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


						<BuildNavigation className="" saveFieldName="accolades" saveFieldValue={accolades?.filter(Boolean)}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />
						

					</div>
				}

				{ stepNumber === 12 && 
					<div className="build-step description-step">

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>Information <span style={{fontWeight: 700}}>about you.</span></p>
							<p style={{marginTop: '8px'}} onClick={(e: any) => {
							e.persist();
							setInformationAboutYouTipState({ showPopover: true, event: e });
							}}>Need ideas? <span style={{color: 'var(--ion-color-primary)', textDecoration: 'underline', cursor: 'pointer'}}>Click here.</span></p>
							<IonPopover
								cssClass="description-hints-tips"
								event={informationAboutYouTipState.event}
								isOpen={informationAboutYouTipState.showPopover}
								onDidDismiss={() => setInformationAboutYouTipState({ showPopover: false, event: undefined })}
								mode="ios"
							>	<div className="" style={{padding: '8px 16px'}}>
									<p style={{fontSize: '0.95em'}}>These are some suggestions for key bits of information that potential sponsors may wish to know.</p>
									<p style={{fontSize: '0.95em'}}>Please feel free to expand on this as you see fit.</p>
									<ul style={{margin: '0', fontSize: '0.95em', padding: '8px 12px 8px 18px'}}>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>What makes you special?</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>History within the sport</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>Training schedule/sacrifices</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>Ambition – What do you want the sponsorship to help achieve</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>Support team</li>
									</ul>
							</div>
								
							</IonPopover>
						</div>

						
						<div className="section-input">
				
						<TextEditor
							autoCapitalize="Sentences"
							placeholder="Enter your description here."
							initialText={profileData?.informationAboutYou && convertFromRaw(profileData?.informationAboutYou)}
							textEditorText={informationAboutYou}
							setTextEditorText={setInformationAboutYou} />

						</div>

		

						<BuildNavigation className="" saveFieldName="informationAboutYou" saveFieldValue={informationAboutYou && convertToRaw( informationAboutYou )}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />
						

					</div>
				}

				{ stepNumber === 13 && 
					<div className="build-step description-step">

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}><span style={{fontWeight: 700}}>Competition</span> information</p>
							<p style={{marginTop: '8px'}} onClick={(e: any) => {
							e.persist();
							setCompetitionInformationTipState({ showPopover: true, event: e });
							}}>Need ideas? <span style={{color: 'var(--ion-color-primary)', textDecoration: 'underline', cursor: 'pointer'}}>Click here.</span></p>
							<IonPopover
								cssClass="description-hints-tips"
								event={competitionInformationTipState.event}
								isOpen={competitionInformationTipState.showPopover}
								onDidDismiss={() => setCompetitionInformationTipState({ showPopover: false, event: undefined })}
								mode="ios"
							>	<div className="" style={{padding: '8px 16px'}}>
									<p style={{fontSize: '0.95em'}}>These are some suggestions for key bits of information that potential sponsors may wish to know.</p>
									<p style={{fontSize: '0.95em'}}>Please feel free to expand on this as you see fit.</p>
									<ul style={{margin: '0', fontSize: '0.95em', padding: '8px 12px 8px 18px'}}>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>What makes you special?</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>History within the sport</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>Training schedule/sacrifices</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>Ambition – What do you want the sponsorship to help achieve</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>Support team</li>
									</ul>
							</div>
								
							</IonPopover>
						</div>

						
						<div className="section-input">
				
						<TextEditor
							autoCapitalize="Sentences"
							placeholder="Enter your description here."
							initialText={profileData?.competitionInformation && convertFromRaw(profileData?.competitionInformation)}
							textEditorText={competitionInformation}
							setTextEditorText={setCompetitionInformation} />

						</div>

				

						<BuildNavigation className="" saveFieldName="competitionInformation" saveFieldValue={competitionInformation && convertToRaw( competitionInformation )}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />
						

					</div>
				}

				{ stepNumber === 14 && 
					<div className="build-step description-step">

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}><span style={{fontWeight: 700}}>Supporters</span> information</p>
							<p style={{marginTop: '8px'}} onClick={(e: any) => {
							e.persist();
							setSupportersInformationTipState({ showPopover: true, event: e });
							}}>Need ideas? <span style={{color: 'var(--ion-color-primary)', textDecoration: 'underline', cursor: 'pointer'}}>Click here.</span></p>
							<IonPopover
								cssClass="description-hints-tips"
								event={supportersInformationTipState.event}
								isOpen={supportersInformationTipState.showPopover}
								onDidDismiss={() => setSupportersInformationTipState({ showPopover: false, event: undefined })}
								mode="ios"
							>	<div className="" style={{padding: '8px 16px'}}>
									<p style={{fontSize: '0.95em'}}>These are some suggestions for key bits of information that potential sponsors may wish to know.</p>
									<p style={{fontSize: '0.95em'}}>Please feel free to expand on this as you see fit.</p>
									<ul style={{margin: '0', fontSize: '0.95em', padding: '8px 12px 8px 18px'}}>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>What makes you special?</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>History within the sport</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>Training schedule/sacrifices</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>Ambition – What do you want the sponsorship to help achieve</li>
										<li style={{padding: '0 0 8px', fontWeight: 500}}>Support team</li>
									</ul>
								</div>
								
							</IonPopover>
						</div>

						
						<div className="section-input">
				
						<TextEditor
							autoCapitalize="Sentences"
							placeholder="Enter your description here."
							initialText={profileData?.supportersInformation && convertFromRaw(profileData?.supportersInformation)}
							textEditorText={supportersInformation}
							setTextEditorText={setSupportersInformation} />

						</div>

						<BuildNavigation className="" saveFieldName="supportersInformation" saveFieldValue={supportersInformation && convertToRaw( supportersInformation )}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />
						
					</div>
				}

				{ stepNumber === 15 && 
					<div className="build-step description-step">

						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '24px 5px 0'}}>
							<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}>Any <span style={{fontWeight: 700}}>other</span> information?</p>
							<p style={{marginTop: '8px'}} >Any other information which you feel is important?</p>
						</div>

						
						<div className="section-input">
				
						<TextEditor
							autoCapitalize="Sentences"
							placeholder="Enter your description here."
							initialText={profileData?.anyOtherInfo && convertFromRaw(profileData?.anyOtherInfo)}
							textEditorText={anyOtherInfo}
							setTextEditorText={setAnyOtherInfo} />

						</div>


						<BuildNavigation className="" saveFieldName="anyOtherInfo" saveFieldValue={anyOtherInfo && convertToRaw( anyOtherInfo )}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />
						
						
					</div>
				}
				

				{ stepNumber === 16 && 
					<div className="build-step complete-step">



						<div className="section-text" style={{color: 'var(--ion-color-dark)', padding: '0 5px', marginTop: 'auto', marginBottom: 'auto'}}>

							{profileComplete.profile && profileComplete.opportunity && 
								<div className="">
									<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}><span style={{fontWeight: 700}}>Profile complete!</span></p>
									<p style={{marginTop: '8px'}} >Well done, you have completed your profile and added at least one opportunity.</p>
								</div>
							}

							{profileComplete.profile && !profileComplete.opportunity && 
								<div className="">
									<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}><span style={{fontWeight: 700}}>Profile complete!</span></p>
									<p style={{marginTop: '8px'}} >Well done, you have completed your profile.</p>
								</div>
							}

							{!profileComplete.profile && 
								<div className="">
									<p style={{fontSize: '1.2em', letterSpacing: '-0.01em',  paddingBottom: '0', marginBottom: '0'}}><span style={{fontWeight: 700}}>Profile incomplete</span></p>
									<p style={{marginTop: '8px'}}>There are still things that need adding to your profile.</p> 
									<p style={{marginTop: '8px', marginBottom: '8px'}}>In order to begin to show up to potential sponsors we require each of the following to be added:</p>
								</div>
							}


							{!profileComplete.profile && <ProfileTodoList setStepNumber={setStepNumber} excludeOpportunity /> }

							{!profileComplete.profile && <div className="" style={{margin: '0 -12px'}}><p style={{padding: '12px 18px 12px', margin: '0'}}>Need help completing your profile?</p><div className="menu-list"><div className='menu-list-option'
										onClick={() => history.push("/book-consultation/")}>
											<div className="icon">
												<IonIcon color="primary" icon={chatbubbles} />
											</div>
											<div className="text">
												<p className="main-text">Book Consultation</p>
												<p className="sub-text">Get advice about sponsorship</p>
											</div>
										</div></div></div> }

							{profileComplete.profile && !profileComplete.opportunity && 
								<div className="" style={{margin: '0 -12px'}}>
									<p style={{padding: '12px 12px 12px', margin: '0'}}>To start finding potential sponsors:</p>
									<div className="menu-list">
										<div className="menu-list-option"
										onClick={() => history.push("/add-opportunity/" + authState?.user?.profile )}>
											<div className="icon">
												<IonIcon color="primary" icon={trailSign} />
											</div>
											<div className="text">
												<p className="main-text">Add Opportunities</p>
												<p className="sub-text">Add your first sponsorship opportunity</p>
											</div>
										</div> 
										<div className='menu-list-option'
										onClick={() => history.push("/book-consultation/")}>
											<div className="icon">
												<IonIcon color="primary" icon={chatbubbles} />
											</div>
											<div className="text">
												<p className="main-text">Book Consultation</p>
												<p className="sub-text">Get advice about sponsorship</p>
											</div>
										</div>
										<div className='menu-list-option'
										onClick={() => history.push("/subscribe/")}>
											<div className="icon">
												<IonIcon color="primary" icon={rocket} />
											</div>
											<div className="text">
												<p className="main-text">Subscribe</p>
												<p className="sub-text">Start finding sponsorship today</p>
											</div>
										</div>
									</div>
								</div>

								
							}


						</div>

						<BuildNavigation isLast={true} className="" saveFieldName="anyOtherInfo" saveFieldValue={anyOtherInfo && convertToRaw( anyOtherInfo )}  
						setStepNumber={setStepNumber} stepNumber={stepNumber} saveField={saveField} />
						
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
