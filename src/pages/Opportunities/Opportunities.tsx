import { IonButton, IonContent, IonPage } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import OpportunitiesList from '../../components/OpportunitiesList/OpportunitiesList';

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
      <IonContent className="opportunities-content" fullscreen>

          <IonButton className="link" fill="clear" color="dark" size="small" onClick={() => history.push("/profile/" + profileId.id )}>Back to Profile</IonButton>
           

          <h1 className="ion-text-uppercase ion-text-center ion-color-dark line-height-1 ion-color-dark">Sponsorship Opportunities</h1>

          <OpportunitiesList profileId={ profileId.id } />

      </IonContent>
    </IonPage>
  );
};

export default Opportunities;
