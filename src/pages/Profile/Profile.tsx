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
// import { stateToMarkdown } from "draft-js-export-markdown";

import { Fancybox } from "@fancyapps/ui"; 

import "@fancyapps/ui/dist/fancybox.css";

import './profile.scss';
import { personCircle, location, cash, wallet, cellular, browsersOutline, logoVimeo, settings } from 'ionicons/icons';
import SocialMediaTotals from '../../components/SocialMediaTotals/SocialMediaTotals';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import OpportunitiesList from '../../components/OpportunitiesList/OpportunitiesList';
import TextEditorContent from '../../components/TextEditorContent/TextEditorContent';
import OpportunityExpanded from '../../components/OpportunityExpanded/OpportunityExpanded';
import useOpportunity from '../../hooks/useOpportunity';
import ContactProfile from '../../components/ContactProfile/ContactProfile';

export interface props {}

interface ParamTypes {
  id: string;
}

const Profile: React.FC = () => {

  const thelocation = useLocation<any>();

  const profileId = useParams<ParamTypes>();
	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false) 
  const [fullDescriptionText, setFullDescriptionText] = useState<any>(""); 
  const {isLoading, data, error, isSuccess} = useProfile( profileId.id );

  const [profileImages, setProfileImages] = useState([]);

  const [profileTabNumber, setProfileTabNumber] = useState(1);

  const [opportunityData, setOpportunityData] = useState();

  error && console.log(error);

  useEffect(() => {

    isSuccess && setFullDescriptionText(  data?.fullDescriptionText  );

    isSuccess && setProfileImages( data?.images );

    thelocation && thelocation?.state?.tab === "contact" ? setProfileTabNumber(4) : setProfileTabNumber(1);
    
  }, [data?.fullDescriptionText, isSuccess, thelocation])


  Fancybox.bind("[data-fancybox]", {
    // Your options go here
  });


  return (
    <IonPage className="profile">

      { authState?.user.profile === parseInt(profileId.id) && 
        <IonToolbar>
          <IonButtons className="ion-justify-content-center ion-padding-start ion-padding-end">
            <IonButton className="" size="small" onClick={()=> history.push( "/profile/" + profileId.id +"/edit" )}>Edit Profile</IonButton>
          </IonButtons>
          
        </IonToolbar> }
            
      <TabBar activeTab="profile"/>
      
      <IonContent className="profile-content" fullscreen>


        <IonLoading isOpen={isLoading} message="Loading Profile" />

         <div className="profile-header">

          
          
          { isLoading ? <IonSkeletonText animated style={{ width: '60%', margin: '20px  auto' }} /> : data?.coverImage && 
         

          <picture>
            <source type="image/webp" media="(max-width: 576px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_xs_" +  data?.coverImage?.hash + ".webp" } />
            <source type="image/webp" media="(max-width: 768px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_sm_" +  data?.coverImage?.hash + ".webp" } />
            <source type="image/webp" media="(max-width: 992px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_md_" +  data?.coverImage?.hash + ".webp" } />
            <source type="image/webp" media="(max-width: 1440px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_lg_" +  data?.coverImage?.hash + ".webp" } />
            <source type="image/webp" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_xl_" +  data?.coverImage?.hash + ".webp" } />

            <source type="image/jpeg" media="(max-width: 576px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_xs_" +  data?.coverImage?.hash + ".jpg" } />
            <source type="image/jpeg" media="(max-width: 768px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_sm_" +  data?.coverImage?.hash + ".jpg" } />
            <source type="image/jpeg" media="(max-width: 992px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_md_" +  data?.coverImage?.hash + ".jpg" } />
            <source type="image/jpeg" media="(max-width: 1440px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_lg_" +  data?.coverImage?.hash + ".jpg" } />
            <source type="image/jpeg" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_xl_" +  data?.coverImage?.hash + ".jpg" } />

            <img className="cover-image" src={  process.env.REACT_APP_S3_URL + "/cover_xl_" + data?.coverImage?.hash + ".jpg" } alt="Profile Cover" />
          </picture>  
          
          }
          
        </div>

        <div className="profile-content-inner">

        <div className="profile-info">

        <div className="avatar">
          <div className="avatar-image">
            
            { isLoading ? <IonSkeletonText animated style={{ width: '60%', margin: '20px  auto' }} /> : data?.profilePicture ? 
            
              <picture>
                  <source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/profile_" +  data?.profilePicture?.hash + ".webp" } />
                  <source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/profile_" +  data?.profilePicture?.hash + ".jpg" } />
                  <img className="profile-picture" alt={ "Profile Image " + data?.profilePicture.id } src={ process.env.REACT_APP_S3_URL + "/profile_" +  data?.profilePicture?.hash + ".jpg" } /> 
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
                <IonButton expand="block" className="contact-now " onClick={() => setProfileTabNumber(4)}>Contact Now</IonButton>
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
                { data?.accolades.map((item: any) => { return <p className="accolade" key={ item }>{ item }</p>; } ) } 
              </div>
            
            } 

          </div>


          {/* { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data?.images?.length > 0 && 

            <div className="profile-images ion-padding-top  ion-padding-bottom images ion-text-center">
             
              { data?.images?.length > 1 && <ImageSlider images={data?.images}/> }
              { data?.images?.length === 1 && <img alt={ "Profile Image " + data?.images.id } src={ data?.images?.url } /> }
              
            </div>

          }  */}
          
          </div>



            <div className= "profile-tabs">
              <div className="profile-tab-navigation">
                <p className={profileTabNumber === 1 ? "active" : ""} onClick={() => setProfileTabNumber(1)}>Sponsorship</p>
                <p className={profileTabNumber === 2 ? "active" : ""} onClick={() => setProfileTabNumber(2)}>Description</p>
                <p className={profileTabNumber === 3 ? "active" : ""} onClick={() => setProfileTabNumber(3)}>Photos</p>
                <p className={profileTabNumber === 4 ? "active" : ""} onClick={() => setProfileTabNumber(4)}>Contact</p>
              </div>


               {profileTabNumber === 1 && 
                <div className="profile-opportunities">
                    <h2 className="ion-color-dark line-height-12 tab-title">Sponsorship Opportunities</h2>
          
                    
                    <OpportunitiesList profileId={ profileId.id } />

                    <div className="other-sponsorship-ideas ion-padding">
                      <p>Have any other sponsorship ideas? <br/>
                      Please get in touch <a href="/">here.</a></p>
                    </div>
                  </div>
                }

                


                { profileTabNumber === 2 && <div className="profile-description">

                    { authState?.user.profile === parseInt(profileId.id) && <IonButton className="button-tertiary" size="small" onClick={ () => history.push('/edit-profile-description') } >Edit Description</IonButton> }

                    {data?.informationAboutYou && <div className="profile-description-section">
                    <p className="ion-color-dark" style={{paddingLeft: "16px", fontWeight: 700, fontSize: "1.3em"}}>About</p>
                    <TextEditorContent editorContent={data?.informationAboutYou} />
                    </div> }
                    
                    {data?.competitionInformation && <div className="profile-description-section">
                      <p className="ion-color-dark" style={{paddingLeft: "16px", fontWeight: 700, fontSize: "1.3em"}}>Competitions</p>
                    <TextEditorContent editorContent={data?.competitionInformation} />
                    </div>  }
                    
                    {data?.supportersInformation && <div className="profile-description-section">
                      <p className="ion-color-dark" style={{paddingLeft: "16px", fontWeight: 700, fontSize: "1.3em"}}>Supporters</p>
                    <TextEditorContent editorContent={data?.supportersInformation} />
                    </div>  }
                    
                    {data?.anyOtherInfo && <div className="profile-description-section">
                      <p className="ion-color-dark" style={{paddingLeft: "16px", fontWeight: 700, fontSize: "1.3em"}}>Other Info</p>
                    <TextEditorContent editorContent={data?.anyOtherInfo} />
                    </div>  }
                  
                  </div>

                   }



                { profileTabNumber === 3 && <div className="photos">
                  { authState?.user.profile === parseInt(profileId.id) && <IonButton className="button-tertiary" size="small" onClick={ () => history.push('/manage-profile-images') } >Add/Edit Photos</IonButton> }

                  <div className="profile-images">
                  { profileImages && profileImages.map((profileImage: any) => {
						
                  return <div key={profileImage.id} className="profile-image" onMouseLeave={(e) => {(e.currentTarget.querySelector('.active')  as HTMLElement)?.classList.remove("active")}}>
                          <div className="profile-image-inner">
                          <a
                              href={profileImage?.url}
                              data-fancybox="profile-gallery"
                            >
                            <picture>
                              <source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/profile_image_thumbnail_" +  profileImage?.hash + ".webp" } />
                              <source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/profile_image_thumbnail_" +  profileImage?.hash + ".jpg" } />
                              <img className="profile-image-thumb" alt={ "Profile Image " + profileImage.id } src={ process.env.REACT_APP_S3_URL + "/profile_image_thumbnail_" +  profileImage?.hash + ".jpg" } /> 
                            </picture>
                            </a>
                        </div>
                      </div>
                  
                })
                }
                  </div>  
                </div> }

                { profileTabNumber === 4 && <div className="contact">
                  
                  <ContactProfile profileId={profileId.id} label="Contact" profileData={data} />
                </div> }
          
          </div>
          
          </div>

          
      </IonContent>
      
    </IonPage>

    
  );
};

export default Profile;

function ionViewWillEnter(arg0: () => void) {
  throw new Error('Function not implemented.');
}
