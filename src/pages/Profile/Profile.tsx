import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonSkeletonText, IonTitle, IonToolbar } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React from 'react';
import LogoutButton from '../../components/LogoutButton';
import { useQueryClient, useQuery } from 'react-query';
import useMyProfile from '../../hooks/useMyProfile';
import TabBar from '../../components/TabBar';

import './profile.scss';
import { personCircle, location, cash, wallet, cellular, browsersOutline } from 'ionicons/icons';
import SocialMediaTotals from '../../components/SocialMediaTotals/SocialMediaTotals';

export interface props {}


const Profile: React.FC = () => {

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  const {isLoading, data, error} = useMyProfile();

  error && console.log(error);

  

  return (
    <IonPage>

      { authState.isAuthenticated && <IonToolbar><IonButton className="button-tertiary ion-margin-bottom" size="small" color="tertiary" expand="block" onClick={()=> history.push( "/profile/edit" )}>Edit Profile</IonButton></IonToolbar> }
            
      <TabBar activeTab="profile"/>
      
      <IonContent className="profile-content" fullscreen>

        <IonLoading isOpen={isLoading} message="Loading Profile" />

        <div className="profile-header">

        </div>

        <div className="avatar">
          <div className="avatar-image">
            <IonIcon color="medium" icon={personCircle} />
          </div>
        </div>

        <div className="profile-info">

          <div className="ion-text-center ion-padding-top ion-padding">
          
            { isLoading ? <IonSkeletonText animated style={{ width: '60%', margin: '20px  auto' }} /> : data[0]?.profileName && <h1 className="profile-name ion-no-margin">{ data[0].profileName }</h1>  }
            
            { isLoading ? <IonSkeletonText animated style={{ width: '20%', margin: '20px  auto' }} /> : data[0]?.sport && <h2 className="profile-sport ion-no-margin">{ data[0].sport }</h2>  }

            { isLoading ? <IonSkeletonText animated style={{ width: '40%', margin: '40px  auto' }} /> : data[0]?.socialMedia && <SocialMediaTotals socialMediaData={data[0].socialMedia} /> } 
            
            <div className="profile-details ion-padding-top">

              { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data[0]?.location && 
                
                <div className="profile-detail location ion-text-left">
                  
                    <IonIcon color="tertiary" size="large" icon={location} />
                    <p>{data[0].location.label}</p>

                </div> 
              
              } 
              
              { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data[0]?.priceRange && 
              
                <div className="profile-detail price-range ion-text-left">
                  <IonIcon color="tertiary" size="large" icon={cellular} />
                  
                  <p>{data[0].priceRange}</p>
                </div> 
              
              } 
              
              { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data[0]?.website && 
              
                <div className="profile-detail price-range ion-text-left">
                  <IonIcon color="tertiary" size="large" icon={browsersOutline} />
                  <p>{data[0].website}</p>
                </div> 
              
              } 


            </div>  


          

          { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data[0]?.shortDescription && 
              
              <div className="profile-detail-about ion-text-left ion-padding-top">
                <h4>About</h4>
                { data[0]?.shortDescription }  
              </div>
            
            } 
            { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data[0]?.accolades && 
              
              <div className="profile-detail-about ion-text-left ion-padding-top accolades">
                <h4>Accolades</h4>
                { data[0]?.accolades.map((item: any) => { return <p className="accolade" key={ item }>{ item }</p>; } ) } 
              </div>
            
            } 

          </div>

        </div>


        { isLoading ? <IonSkeletonText animated style={{ width: '90%', margin: '10px  auto' }} /> : data[0]?.images && 
              
              <div className="profile-detail-about ion-text-left ion-padding-top images">
                { data[0]?.images.map((item: any) => { console.log(item); return <p className="image" key={ item.id }><img alt={ "Profile Image " + item.id } src={ process.env.REACT_APP_API_URL + item.url } /></p>; } ) } 
              </div>
            
            } 

            

       
       

          
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/opportunities/" )}>Opportunities</IonButton>
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/dashboard/" )}>Back to Dashboard</IonButton>
          

      </IonContent>
    </IonPage>
  );
};

export default Profile;
