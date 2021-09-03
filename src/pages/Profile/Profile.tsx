import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonSkeletonText, IonTitle, IonToolbar } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import { useQueryClient, useQuery } from 'react-query';
import useProfile from '../../hooks/useProfile';
import TabBar from '../../components/TabBar';

import './profile.scss';
import { personCircle, location, cash, wallet, cellular, browsersOutline, logoVimeo, settings } from 'ionicons/icons';
import SocialMediaTotals from '../../components/SocialMediaTotals/SocialMediaTotals';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import OpportunitiesList from '../../components/OpportunitiesList/OpportunitiesList';

export interface props {}

interface ParamTypes {
  id: string;
}

const Profile: React.FC = () => {

  const profileId = useParams<ParamTypes>();
	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false) 
  const {isLoading, data, error} = useProfile( profileId.id );

  error && console.log(error);

  // console.log(data?.profilePicture);

  return (
    <IonPage className="profile">

      { authState?.user.profile === parseInt(profileId.id) && 
        <IonToolbar>
          <IonButtons className="ion-justify-content-around">
            <IonButton className="" size="small" onClick={()=> history.push( "/dashboard" )}>Dashboard</IonButton>
            <IonButton className="" size="small" onClick={()=> history.push( "/opportunities/" + profileId.id )}>Manage Opportunities</IonButton>
            <IonButton className="" size="small" onClick={()=> history.push( "/profile/" + profileId.id +"/edit" )}>Edit Profile</IonButton>
          </IonButtons>
          
        </IonToolbar> }
            
      <TabBar activeTab="profile"/>
      
      <IonContent className="profile-content" fullscreen>

        

        <IonLoading isOpen={isLoading} message="Loading Profile" />

         <div className="profile-header">
          
          { isLoading ? <IonSkeletonText animated style={{ width: '60%', margin: '20px  auto' }} /> : data?.coverImage && <img className="cover-image" alt={ "Cover Photo " + data?.coverImage.id } src={ (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : '') + data?.coverImage.url } />  }
            
        </div>

        <div className="profile-info">

        <div className="avatar">
          <div className="avatar-image">
            
            { isLoading ? <IonSkeletonText animated style={{ width: '60%', margin: '20px  auto' }} /> : data?.profilePicture ? <img className="profile-picture" alt={ "Profile Image " + data?.profilePicture.id } src={ (process.env.NODE_ENV === "development" ? 'http://localhost:1337'  : '') + data?.profilePicture.url } /> : <IonIcon color="medium" icon={personCircle} /> }
            
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

            </div>  


          
          { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data?.shortDescription && 
              
              <div className="profile-detail-about ion-text-left ion-padding-top">
                <h4>About</h4>
                { data?.shortDescription } 
                <div className="read-more ion-color-primary ion-padding-top" onClick={() => setShowFullDescription(!showFullDescription)}>{showFullDescription ? "Read less" : "Read more"}</div>
                <div className="fullDescription ion-padding-top">
                  { showFullDescription && data?.description}
                </div>
              </div>
            
            } 
            { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data?.accolades?.length > 0 && 
              
              <div className="profile-detail-about ion-text-left ion-padding-top accolades">
                <h4>Accolades</h4>
                { data?.accolades.map((item: any) => { return <p className="accolade" key={ item }>{ item }</p>; } ) } 
              </div>
            
            } 

          </div>


          { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data?.images?.length > 0 && 

            <div className="profile-images ion-padding-top  ion-padding-bottom images ion-text-center">
             
              { data?.images?.length > 1 && <ImageSlider images={data?.images}/> }
              { data?.images?.length === 1 && <img alt={ "Profile Image " + data?.images.id } src={ data?.images?.url } /> }
              
            </div>

          } 
          
          </div>
            

          <p className="ion-padding ion-color-dark line-height-12 section-title">Sponsorship Opportunities</p>
       
          <OpportunitiesList profileId={ profileId.id } />
      

      </IonContent>
      
    </IonPage>

    
  );
};

export default Profile;