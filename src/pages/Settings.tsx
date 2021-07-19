import { IonButton, IonContent, IonPage } from '@ionic/react';
import Header from '../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../App";
import React from 'react';
import LogoutButton from '../components/LogoutButton';

export interface props {}

const Settings: React.FC = () => {

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  return (
    <IonPage>
      <Header headerTitle="Settings"/>
      <IonContent fullscreen>

          { authState.isAuthenticated ? <p>Hello user { authState.user.id }</p>	: <p>Please log in</p> }

          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/settings/billing/" )}>Subscription/Billing</IonButton>
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/settings/account/" )}>Account</IonButton>
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/settings/notifications/" )}>Notifications</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Settings;
 