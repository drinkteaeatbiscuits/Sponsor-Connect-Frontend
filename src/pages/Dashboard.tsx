import { IonButton, IonContent, IonPage } from '@ionic/react';
import Header from '../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../App";
import React from 'react';
import LogoutButton from '../components/LogoutButton';

export interface props {}

const Dashboard: React.FC = () => {

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  return (
    <IonPage>
      <Header headerTitle="Dashboard"/>
      <IonContent fullscreen>

          { authState.isAuthenticated ? <p>Hello user { authState.user.id }</p>	: <p>Please log in</p> }

        <IonButton fill="clear" expand="full" onClick={()=> history.push( "/profile/" )}>Profile</IonButton>
        <IonButton fill="clear" expand="full" onClick={()=> history.push( "/opportunities" )}>Opportunities</IonButton>
        <IonButton fill="clear" expand="full" onClick={()=> history.push( "/settings/" )}>Settings</IonButton>

        <LogoutButton/>

      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
