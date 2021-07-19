import { IonButton, IonContent, IonPage } from '@ionic/react';
import Header from '../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../App";
import React from 'react';
import LogoutButton from '../components/LogoutButton';

export interface props {}

const Notifications: React.FC = () => {

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  return (
    <IonPage>
      <Header headerTitle="Notifications"/>
      <IonContent fullscreen>

          { authState.isAuthenticated ? <p>Hello user { authState.user.id }</p>	: <p>Please log in</p> }


      </IonContent>
    </IonPage>
  );
};

export default Notifications;
