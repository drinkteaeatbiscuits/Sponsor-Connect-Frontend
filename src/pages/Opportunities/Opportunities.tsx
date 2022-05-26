import { IonButton, IonButtons, IonContent, IonIcon, IonPage, IonToolbar } from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { AuthContext } from "../../App";
import React from 'react';
import TabBar from '../../components/TabBar';
import OpportunitiesList from '../../components/OpportunitiesList/OpportunitiesList';

import './Opportunities.scss';
import MetaTags from '../../components/MetaTags/MetaTags';
import { create, rocket } from 'ionicons/icons';

export interface props {}

interface ParamTypes {
  id: string;
}

const Opportunities: React.FC = () => {

  const profileId = useParams<ParamTypes>();

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  
  const subscriptionActive = () => {
    if(authState?.mySubscription?.subscriptionStatus === 'active'){
      return true
    }else{
      return false
    }
  }

  return (
    <IonPage className='opportunities-page'>

      <MetaTags title={'Opportunities | Sponsor Connect'} path={ '/opportunities/' + profileId?.id } description={'Sponsor Connect opportunities.'} image={ "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />  

      { authState?.user?.profile === parseInt(profileId?.id) && 
        <IonToolbar>
          <IonButtons className="edit-profile-toolbar-buttons" style={{}}>

            <IonButton className="new-opportunity-button" style={{color: 'var(--ion-color-medium-tint)'}}  size="small" onClick={()=> history.push( "/add-opportunity/" + profileId.id )}>
              <IonIcon style={{margin: '0 8px 0 0'}} color="medium" icon={create} /> Add Opportunity
            </IonButton>
            
           { ! subscriptionActive() && <IonButton className="make-profile-live-button" style={{
              '--background': 'var(--ion-color-primary)',
              '--border-radius': '0',
              
              marginInlineStart: 0,
              marginInlineEnd: 0,
              height: '56px',
              fontWeight: 500,
              color: '#fff'
              }} size="small" onClick={()=> history.push( "/subscribe" )}
              ><IonIcon style={{margin: '0 8px 0 0', color: 'var(--ion-color-primary-tint)'}} icon={rocket} /> Make Profile Live &gt;</IonButton>
            } 
          </IonButtons> 
          
        </IonToolbar> 
      }


      <TabBar activeTab="opportunities"/>
      <IonContent className="opportunities-content " fullscreen>
        <div className="content">

                  <IonButton className="link" fill="clear" color="dark" size="small" onClick={() => history.push("/profile/" + profileId.id )}>Back to Profile</IonButton>

                    <h1 className="ion-text-uppercase ion-text-center ion-color-dark line-height-1 ion-color-dark">Sponsorship Opportunities</h1>

                  <OpportunitiesList profileId={ profileId?.id } />

                  { authState?.user?.profile === parseInt(profileId.id) && <div className="contact-button ion-padding-top">
                        <IonButton expand="block" className="add-opportunity" onClick={() => history.push("/add-opportunity/" + profileId.id )}>Add New Opportunity</IonButton>
                      </div> }

        </div>
          

      </IonContent>
    </IonPage>
  );
};

export default Opportunities;
