import { IonButton, IonCol, IonContent, IonGrid, IonLabel, IonPage, IonRow, IonSegment, IonSegmentButton, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave, } from '@ionic/react';
// import React from 'react';
import { useHistory } from 'react-router';
import React, { useEffect, useState } from 'react';

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

  const [selectedOption, setSelectedOption] = useState<any>("sports");
  const history = useHistory();

  const { state: authState } = React.useContext(AuthContext);

  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="landing-background-wrap">
              <picture className="landing-background">
                    <source media="(max-width: 499px)" srcSet="https://sponsor-connect-website-images.s3.eu-west-2.amazonaws.com/landing-background-sm%402x.jpg 2x, https://sponsor-connect-website-images.s3.eu-west-2.amazonaws.com/landing-background-sm.jpg 1x"/>
                    <source media="(max-width: 1023px)" srcSet="https://sponsor-connect-website-images.s3.eu-west-2.amazonaws.com/landing-background-md%402x.jpg 2x, https://sponsor-connect-website-images.s3.eu-west-2.amazonaws.com/landing-background-md.jpg 1x"/>
                    <source media="(min-width: 1024px)" srcSet="https://sponsor-connect-website-images.s3.eu-west-2.amazonaws.com/landing-background%402x.jpg 2x, https://sponsor-connect-website-images.s3.eu-west-2.amazonaws.com/landing-background.jpg 1x"/>
                    <img className="landing-background-image" src="https://sponsor-connect-website-images.s3.eu-west-2.amazonaws.com/landing-background%402x.jpg" alt="sponsor-connect-landing-background"/>
              </picture>
            </div>
        <IonGrid className="landing-grid flex-direction-column ion-padding-bottom">
            <IonRow className="ion-padding-bottom">
              <IonCol className="logo ion-text-center ion-padding" size="auto">
                <SvgScLogo />
              </IonCol>
              <IonCol className="select-sport-business ion-padding">
                <div className="please-select"><p>Please select</p></div>

                <div className={selectedOption + " sport-business-selector"}>
                  <div onClick={() => setSelectedOption('sports') }>Sports</div>
                  <div onClick={() => setSelectedOption('business') }>Business</div>
                </div>

              </IonCol>

              <IonCol className="ion-padding-bottom" size="auto">
                
                <IonButton className="primary-button" color="primary" onClick={() => history.push("/" + selectedOption)} expand="block">Let's Go</IonButton>

              </IonCol>
            </IonRow>
          </IonGrid>
        
    </IonContent>
    </IonPage>
  );
};

export default Landing;


