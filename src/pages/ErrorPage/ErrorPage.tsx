import { IonButton, IonContent, IonPage, useIonViewDidEnter } from '@ionic/react';
// import Header from '../components/Header';
import { AuthContext } from '../../App';
import React from 'react';
import { useHistory } from 'react-router';
import TabBar from '../../components/TabBar';
// import TabBar from '../components/TabBar'; 

export interface props { }

const ErrorPage: React.FC = () => {

  const history = useHistory();

  const { state: authState } = React.useContext(AuthContext);

  const { dispatch } = React.useContext( AuthContext );


  return (
    <IonPage>
      { authState.isAuthenticated && <TabBar activeTab="profile"/> }
      <IonContent fullscreen>
      <div className="content">

        <h1>404 - This page doesn't exist</h1>
        <p>Please select an item from the menu above or <a href="/login">login</a></p>
      </div>

      </IonContent>
    </IonPage>
  );
};


export default ErrorPage;
