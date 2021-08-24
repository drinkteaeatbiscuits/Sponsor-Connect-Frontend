import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave, } from '@ionic/react';
// import React from 'react';
import { useHistory } from 'react-router';
import React, { useEffect } from 'react';

// import { AuthContext } from '../../App';

import SvgScLogo from './images/SvgScLogo';

// import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './landing.scss';
import OnBoardingProgress from '../../components/OnBoardingProgress/OnBoardingProgress';
import { AuthContext } from '../../App';
 
// import TabBar from '../../components/TabBar';
// import Header from '../../components/Header';
// import { useEffect } from 'react';


export interface props { }

const Landing: React.FC = () => {



 
  
  const history = useHistory();

 

  

  return (
    <IonPage>
      <IonContent fullscreen>

          <IonGrid className="flex-direction-column ion-padding-bottom">
            <IonRow className="ion-padding-bottom">
              <IonCol className="logo ion-text-center ion-padding" size="auto">
                <div onClick={() => history.push("/")}><SvgScLogo /></div>
              </IonCol>
              <IonCol className="login-image">
 
              </IonCol>
              <IonCol className="ion-padding-bottom" size="auto">
                <IonButton className="primary-button" color="primary" onClick={() => history.push("/login")} expand="block">Login</IonButton>
              <IonButton color="secondary" onClick={() => history.push("/create-account")} expand="block">Create Account</IonButton>
              <IonButton button-type="link" size="small"  onClick={() => history.push("/")} >cancel</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          
      </IonContent>
    </IonPage>
  );
};

export default Landing;


