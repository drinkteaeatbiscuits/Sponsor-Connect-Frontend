import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';

import { AuthContext } from '../../App';

import SvgScLogo from './images/SvgScLogo';

import TabBar from '../../components/TabBar';
import Header from '../../components/Header';


export interface props { }

const Landing: React.FC = () => {

  const history = useHistory();

  const { state: authState } = React.useContext(AuthContext);

  // console.log(authState);

  return (
    <IonPage>
      {/* <Header headerTitle="Home" /> */}
      {/* <TabBar/> */}
      <IonContent fullscreen>

          <IonGrid className="flex-direction-column ion-padding-bottom">
            <IonRow className="ion-padding-bottom">
              <IonCol className="logo ion-text-center ion-padding" size="auto">
                <SvgScLogo />
              </IonCol>
              <IonCol className="login-image">

              </IonCol>
              <IonCol className="ion-padding-bottom" size="auto">
                <IonButton color="primary" onClick={() => history.push("/login")} expand="block">Login</IonButton>
              <IonButton color="secondary" onClick={() => history.push("/create-account")} expand="block">Create Account</IonButton>
              <IonButton button-type="link" size="small"  onClick={() => history.goBack()} >cancel</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          
      </IonContent>
    </IonPage>
  );
};

export default Landing;
