import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow, useIonViewDidEnter } from '@ionic/react';

import React, { useEffect, useState } from 'react';

import { AuthContext } from "../App";
import OnBoardingProgress from '../components/OnBoardingProgress/OnBoardingProgress';
import SvgScLogo from './OnBoardingSport/images/SvgScLogo';
import { useHistory } from 'react-router';
import { keypadOutline } from 'ionicons/icons';

export interface props { }

const Login: React.FC<props> = () => {

  const history = useHistory();

  const [username, setUsername] = useState<any>("");
  const [password, setPassword] = useState<any>("");


  const { dispatch } = React.useContext(AuthContext);

  const doLogin = async () => {


    const loginResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/auth/local", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        identifier: username,
        password: password
      }),

    });

    const loginInfo = await loginResp.json();

    if (loginInfo?.statusCode) {

      alert("Error: " + loginInfo.data[0].messages[0].message);

    } else {

      // console.log(loginInfo);

      loginInfo.user.accountType !== "Business" && (loginInfo.user.profile = loginInfo.user.profile.id)

      dispatch && dispatch({
        type: "setUser",
        payload: loginInfo
      });

    }
  }

  const keyUp = (event: any) => {
    if (event.keyCode === 13) {
      doLogin();
    }
  }

  return (
    <IonPage>

      <IonContent fullscreen className="on-boarding">

        <IonGrid className="on-boarding-grid">
          <IonRow className="">
            <IonCol className="app-sidebar logo ion-text-center ion-padding">
              <div onClick={() => history.push("/")}><SvgScLogo /></div>
            </IonCol>
            
            <IonCol className="on-boarding-buttons">

              <div className="login-form">
                <IonItem className="ion-no-padding">
                  <IonLabel position="stacked">Username</IonLabel>
                  <IonInput type="email" onKeyUp={(e: any) => keyUp(e)} onIonChange={(e: any) => setUsername(e.detail.value)} />
                </IonItem>
                <IonItem className="ion-no-padding">
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput type="password" onKeyUp={(e: any) => keyUp(e)} onIonChange={(e: any) => setPassword(e.detail.value)} />
                </IonItem>
                <div style={{ paddingTop: 8 }}><IonButton onClick={() => doLogin()} expand="block">Login</IonButton></div>

                <IonButton button-type="link" onClick={() => history.push("/landing")} >cancel</IonButton>
              </div>

            </IonCol>
          </IonRow>
        </IonGrid>



      </IonContent>
    </IonPage>
  );
};

export default Login;
