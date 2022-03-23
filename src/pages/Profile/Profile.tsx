import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonSkeletonText, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory, useParams, useLocation } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import { useQueryClient, useQuery } from 'react-query';
import useProfile from '../../hooks/useProfile';
import TabBar from '../../components/TabBar';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { stateToHTML } from "draft-js-export-html";
import ErrorBoundary from '../../containers/ErrorBoundary/ErrorBoundary';
// import { stateToMarkdown } from "draft-js-export-markdown";
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Fancybox } from "@fancyapps/ui"; 

import "@fancyapps/ui/dist/fancybox.css";

import './profile.scss';
import { personCircle, location, cash, wallet, cellular, browsersOutline, logoVimeo, settings, text } from 'ionicons/icons';
import SocialMediaTotals from '../../components/SocialMediaTotals/SocialMediaTotals';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import OpportunitiesList from '../../components/OpportunitiesList/OpportunitiesList';
import TextEditorContent from '../../components/TextEditorContent/TextEditorContent';
import OpportunityExpanded from '../../components/OpportunityExpanded/OpportunityExpanded';
import useOpportunity from '../../hooks/useOpportunity';
import ContactProfile from '../../components/ContactProfile/ContactProfile';
import MetaTags from '../../components/MetaTags/MetaTags';

export interface props {}

interface ParamTypes {
  id: string;
}

const Profile: React.FC = () => {

  const thelocation = useLocation<any>();

  const profileId = useParams<ParamTypes>();
	const history = useHistory();
  const { state: authState, dispatch } = React.useContext(AuthContext);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false) 
  const [fullDescriptionText, setFullDescriptionText] = useState<any>(""); 
  const {isLoading, data, error, isSuccess} = useProfile( profileId.id );

  const [updatingViewedProfiles, setUpdatingViewedProfiles] = useState(false);

  const [profileImages, setProfileImages] = useState([]);

  const [profileTabNumber, setProfileTabNumber] = useState(1);

  const [opportunityData, setOpportunityData] = useState();

  const [latestUpdateDate, setLatestUpdateDate] = useState("");

  error && console.log(error);

  const viewedProfiles = authState?.user?.viewedProfiles;


  useEffect(() => {

    isSuccess && setFullDescriptionText(  data?.fullDescriptionText  );

    isSuccess && setProfileImages( data?.images );

    thelocation && thelocation?.state?.tab === "contact" ? setProfileTabNumber(4) : setProfileTabNumber(1);

    isSuccess && latestUpdateDate.length === 0 && profileLastUpdated();

    !updatingViewedProfiles && authState?.user && viewedProfile();
    
  }, [data?.fullDescriptionText, isSuccess, thelocation, updatingViewedProfiles, viewedProfiles, profileId, latestUpdateDate ]);


  Fancybox.bind("[data-fancybox]", {
    // Your options go here
  });

  const profileLastUpdated = () => {

    let lastUpdatedDate = "";

    lastUpdatedDate = data.updated_at;

    for (let i = 0; i < data.opportunities.length; i++) {

      if(new Date(data.opportunities[i].updated_at) > new Date(lastUpdatedDate)  ) {

        lastUpdatedDate = data.opportunities[i].updated_at;

      }

    }
    setLatestUpdateDate(lastUpdatedDate);
  }



  const viewedProfile = async () => {

    setUpdatingViewedProfiles(true);

    // Get Previously Viewed Date
    const previouslyViewed = viewedProfiles ? viewedProfiles?.filter(e => e.profileId === profileId.id) : null;

    // Has Latest Profile Update Date Loaded
    if(latestUpdateDate.length > 0 ){      


      // console.log(previouslyViewed[0]?.date);
      // console.log(latestUpdateDate);
      // console.log(new Date(previouslyViewed[0]?.date) < new Date(latestUpdateDate));

      // Has Viewed Profiles Loaded
      // Has Profile Been Previously Viewed
      // Is the previously viewed date older than the latest update date
      if ( viewedProfiles && previouslyViewed?.length > 0 
        && (new Date(previouslyViewed[0]?.date) > new Date(latestUpdateDate) === true ) ) {
        
        setUpdatingViewedProfiles(false);

        return

      } else {

        const viewedProfilesResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/profile-viewed", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            profileId: profileId
          })
        });
        
        const viewedProfileInfo = await viewedProfilesResp.json();
    
        dispatch && await dispatch({
          type: "viewedProfile",
          payload: viewedProfileInfo
          });

        setUpdatingViewedProfiles(false);

        return viewedProfileInfo?.statusCode ? false : viewedProfileInfo; 

      }
      
    }

      setUpdatingViewedProfiles(false);
    
  }


  const gotoContact = () => { 
    let y = document?.getElementById("contact-form")?.offsetTop;
    let content = document.querySelector("ion-content");

    if( y && y > 0 ){

      content?.scrollToPoint(0, y, 200);

    }
    
  };
  
  const profileVisible = () => {
    let showProfile = false;

    if(isSuccess && data?.profileComplete === 100 && data?.user?.subscriptionStatus === 'active' ){
      showProfile = true;
    }

    if( authState?.user?.profile === parseInt(profileId.id)) {
      showProfile = true;
    }

    return showProfile;
  }  

  console.log(data?.profileName )

  return (
    <IonPage className="profile">

      { isSuccess && <MetaTags title={data?.profileName + ' | Sponsor Connect'} path={thelocation.pathname} description={data?.shortDescription} image={ data?.coverImage ? process.env.REACT_APP_S3_URL + "/images/cover_xl/" + data?.coverImage?.hash + data?.coverImage?.ext : "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } /> }

      { authState?.user?.profile === parseInt(profileId.id) && 
        <IonToolbar>
          <IonButtons className="ion-justify-content-center ion-padding-start ion-padding-end">
            <IonButton className="" size="small" onClick={()=> history.push( "/profile/" + profileId.id +"/edit" )}>Edit Profile</IonButton>
          </IonButtons>
          
        </IonToolbar> }
            
      <TabBar activeTab="profile"/>
      
      { profileVisible() ? <IonContent className="profile-content" fullscreen scrollEvents={true}>

        
        <IonLoading isOpen={isLoading} message="Loading Profile" />

         <div className="profile-header">

          { isLoading ? <IonSkeletonText animated style={{ width: '60%', margin: '20px  auto' }} /> : data?.coverImage &&          

          <picture>
            <source type="image/webp" media="(max-width: 576px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_xs/" +  data?.coverImage?.hash + ".webp" } />
            <source type="image/webp" media="(max-width: 768px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_sm/" +  data?.coverImage?.hash + ".webp" } />
            <source type="image/webp" media="(max-width: 992px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_md/" +  data?.coverImage?.hash + ".webp" } />
            <source type="image/webp" media="(max-width: 1440px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_lg/" +  data?.coverImage?.hash + ".webp" } />
            <source type="image/webp" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_xl/" +  data?.coverImage?.hash + ".webp" } />

            <source type="image/jpeg" media="(max-width: 576px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_xs/" +  data?.coverImage?.hash + data?.coverImage?.ext } />
            <source type="image/jpeg" media="(max-width: 768px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_sm/" +  data?.coverImage?.hash + data?.coverImage?.ext } />
            <source type="image/jpeg" media="(max-width: 992px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_md/" +  data?.coverImage?.hash + data?.coverImage?.ext } />
            <source type="image/jpeg" media="(max-width: 1440px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_lg/" +  data?.coverImage?.hash + data?.coverImage?.ext } />
            <source type="image/jpeg" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_xl/" +  data?.coverImage?.hash + data?.coverImage?.ext } />

            <img className="cover-image" src={  process.env.REACT_APP_S3_URL + "/images/cover_xl/" + data?.coverImage?.hash + data?.coverImage?.ext } alt="Profile Cover" />
          </picture>  
          
          }
          
        </div>

        <div className="profile-content-inner">

        <div className="profile-info">

        <div className="avatar">
          <div className="avatar-image">
            
            { isLoading ? <IonSkeletonText animated style={{ width: '60%', margin: '20px  auto' }} /> : data?.profilePicture ? 
            
              <picture>
                  <source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  data?.profilePicture?.hash + ".webp" } />
                  <source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  data?.profilePicture?.hash + data?.profilePicture?.ext } />
                  <img className="profile-picture" alt={ "Profile Image " + data?.profilePicture.id } src={ process.env.REACT_APP_S3_URL + "/images/profile/" +  data?.profilePicture?.hash + data?.profilePicture?.ext } /> 
              </picture>
            
            : <IonIcon color="medium" icon={personCircle} /> }
            
          </div>
        </div>
        
          <div className="ion-text-center ion-padding-top ion-padding">
          
            { isLoading ? <IonSkeletonText animated style={{ width: '60%', margin: '20px  auto' }} /> : data?.profileName && <h1 className="profile-name ion-no-margin">{ data.profileName }</h1>  }
            
            { isLoading ? <IonSkeletonText animated style={{ width: '20%', margin: '20px  auto' }} /> : data?.sport && <h2 className="profile-sport ion-no-margin">{ data.sport }</h2>  }

            { isLoading ? <IonSkeletonText animated style={{ width: '40%', margin: '40px  auto' }} /> : data?.socialMedia?.length > 0 && <SocialMediaTotals socialMediaData={data.socialMedia} /> } 
            
            <div className="profile-details ion-padding-top">
              { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data?.location?.label?.length > 0 && 
                
                <div className="profile-detail location ion-text-left">
                  
                    <IonIcon color="tertiary" size="large" icon={location} />
                    <p>{data?.location?.label}</p>

                </div> 
              
              } 
              
              { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data?.priceRange && 
              
                <div className="profile-detail price-range ion-text-left">
                  <IonIcon color="tertiary" size="large" icon={cellular} />
                  
                  <p>{data.priceRange}</p>
                </div> 
              
              } 
              
              { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data?.website && 
              
                <div className="profile-detail price-range ion-text-left">
                  <IonIcon color="tertiary" size="large" icon={browsersOutline} />
                  <p>{data.website}</p>
                </div> 
              
              } 
              <div className="contact-button ion-padding-top">
                <IonButton expand="block" className="contact-now " onClick={() => {setProfileTabNumber(4); gotoContact()}}>Contact Now</IonButton>
              </div>
              

            </div>  


          
          { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data?.shortDescription && 
              
              <div className="profile-detail-about ion-text-left ion-padding-top">
                <h4>About</h4>
                { data?.shortDescription } 
                <div className="read-more ion-color-primary ion-padding-top" onClick={() => setProfileTabNumber(2)}>Read more</div>
              </div>
            
            } 
            { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data?.accolades?.length > 0 && 
              
              <div className="profile-detail-about ion-text-left ion-padding-top accolades">
                <h4>Achievements</h4>
                { data?.accolades.map((item: any, index: any) => { return <p className="accolade" key={ item + index }>{ item }</p>; } ) } 
              </div>
            
            } 

          </div>

          
          </div>

          {/* {console.log(data)} */}

            <div className={ "profile-tabs active-tab-" + profileTabNumber } >
              <div className="profile-tab-navigation">
                <p className={profileTabNumber === 1 ? "active" : ""} onClick={() => setProfileTabNumber(1)}>Sponsorship</p>
                <p className={profileTabNumber === 2 ? "active" : ""} onClick={() => setProfileTabNumber(2)}>Description</p>
                <p className={profileTabNumber === 3 ? "active" : ""} onClick={() => setProfileTabNumber(3)}>Photos</p>
                <p className={profileTabNumber === 4 ? "active" : ""} onClick={() => setProfileTabNumber(4)}>Contact</p>
              </div>


                
                <div className="profile-tab profile-opportunities">
                    <h2 className="ion-color-dark line-height-12 tab-title">Sponsorship Opportunities</h2>
          
                    <ErrorBoundary> 
                      <OpportunitiesList profileId={ profileId.id } />
                    </ErrorBoundary> 
                 

                    <div className="other-sponsorship-ideas ion-padding">
                      <p>Have any other sponsorship ideas? <br/>
                      Please get in touch <span onClick={() => {setProfileTabNumber(4); gotoContact()}}>here.</span></p>
                    </div>
                  </div>
               

                <div className="profile-tab profile-description">
                  
                    { authState?.user?.profile === parseInt(profileId.id) && <IonButton className="button-tertiary" style={{marginBottom: '16px'}} size="small" onClick={ () => history.push('/edit-profile-description') } >Edit Description</IonButton> }

                    {data?.informationAboutYou && <div className="profile-description-section">
                    <p className="ion-color-dark" style={{paddingLeft: "16px", margin: '8px 0 4px', fontWeight: 700, fontSize: "1.3em"}}>About</p>
                    <TextEditorContent editorContent={data?.informationAboutYou} />
                    </div> }
                    
                    {data?.competitionInformation && <div className="profile-description-section">
                      <p className="ion-color-dark" style={{paddingLeft: "16px", margin: '8px 0 4px', fontWeight: 700, fontSize: "1.3em"}}>Competitions</p>
                    <TextEditorContent editorContent={data?.competitionInformation} />
                    </div>  }
                    
                    {data?.supportersInformation && <div className="profile-description-section">
                      <p className="ion-color-dark" style={{paddingLeft: "16px", margin: '8px 0 4px', fontWeight: 700, fontSize: "1.3em"}}>Supporters</p>
                    <TextEditorContent editorContent={data?.supportersInformation} />
                    </div>  }
                    
                    {data?.anyOtherInfo && <div className="profile-description-section">
                      <p className="ion-color-dark" style={{paddingLeft: "16px", margin: '8px 0 4px', fontWeight: 700, fontSize: "1.3em"}}>Other Info</p>
                    <TextEditorContent editorContent={data?.anyOtherInfo} />
                    </div>  }
                  
                  </div>

                   



              <div className="profile-tab photos">

                  { authState?.user?.profile === parseInt(profileId.id) && <IonButton className="button-tertiary" size="small" onClick={ () => history.push('/manage-profile-images') } >Add/Edit Photos</IonButton> }

                  { profileImages.length > 0 && <div className="profile-images">
                    
                  { profileImages.map((profileImage: any) => {
						
                    return <div key={profileImage.id} className="profile-image" onMouseLeave={(e) => {(e.currentTarget.querySelector('.active')  as HTMLElement)?.classList.remove("active")}}>
                          <div className="profile-image-inner">
                          <a
                              href={profileImage?.url}
                              data-fancybox="profile-gallery"
                            >
                            <picture>
                              <source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  profileImage?.hash + ".webp" } />
                              <source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  profileImage?.hash + profileImage?.ext } />
                              <img className="profile-image-thumb" alt={ "Profile Image " + profileImage.id } src={ process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" +  profileImage?.hash + profileImage?.ext } /> 
                            </picture>

                            
                            </a>
                        </div>
                      </div>
                  
                    })
                  }
                  </div> }

                </div> 

                <div id="contact-form" className="profile-tab contact">
                  
                  <ContactProfile profileId={profileId.id} label="Contact" profileData={data} />
                </div> 
          
          </div>
          
          </div>

          
      </IonContent> : <div style={{ 
				padding: '16px 24px',
        width: '100%', 
				margin: "180px auto", 
				maxWidth: '920px', 
				background: '#fff',
				borderRadius: '5px' }}><h1 style={{textTransform: 'uppercase', color: 'var(--ion-color-dark)'}}>Profile Not Found</h1></div>}
      
    </IonPage>

    
  );
};

export default Profile;
