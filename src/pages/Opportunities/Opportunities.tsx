import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { AuthContext } from "../../App";
import React from 'react';
import TabBar from '../../components/TabBar';
import OpportunitiesList from '../../components/OpportunitiesList/OpportunitiesList';

import './Opportunities.scss';

export interface props {}

interface ParamTypes {
  id: string;
}

const Opportunities: React.FC = () => {

  const profileId = useParams<ParamTypes>();

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);


  return (
    <IonPage>
      <TabBar activeTab="opportunities"/>
      <IonContent className="opportunities-content " fullscreen>
        <div className="content">

                  <IonButton className="link" fill="clear" color="dark" size="small" onClick={() => history.push("/profile/" + profileId.id )}>Back to Profile</IonButton>
                  

                    <h1 className="ion-text-uppercase ion-text-center ion-color-dark line-height-1 ion-color-dark">Sponsorship Opportunities</h1>

                  <OpportunitiesList profileId={ profileId.id } />

                  { authState?.user.profile === parseInt(profileId.id) && <div className="contact-button ion-padding-top">
                        <IonButton expand="block" className="add-opportunity" onClick={() => history.push("/add-opportunity/" + profileId.id )}>Add New Opportunity</IonButton>
                      </div> }

        </div>
          

      </IonContent>
    </IonPage>
  );
};

export default Opportunities;
