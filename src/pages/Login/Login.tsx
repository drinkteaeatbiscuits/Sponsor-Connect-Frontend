import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow, useIonViewDidEnter } from '@ionic/react';

import React, { useEffect, useState } from 'react';

import { AuthContext } from "../../App";
import OnBoardingProgress from '../../components/OnBoardingProgress/OnBoardingProgress';
import SvgScLogo from '../OnBoardingSport/images/SvgScLogo';
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

      alert("Error: " + loginInfo?.data[0]?.messages[0]?.message);

    } else {

      // console.log(loginInfo);

      loginInfo.user.role.id !== 3 && ( loginInfo.user.profile = loginInfo.user.profile.id )

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
                  <IonInput type="email" onKeyUp={(e: any) => keyUp(e)} onIonInput={(e: any) => setUsername(e.target.value)} onIonChange={(e: any) => setUsername(e.detail.value)} />
                </IonItem>
                <IonItem className="ion-no-padding">
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput type="password" onKeyUp={(e: any) => keyUp(e)} onIonInput={(e: any) => setPassword(e.target.value)} onIonChange={(e: any) => setPassword(e.detail.value)} />
                  
                </IonItem>
                
                <div style={{ paddingTop: 8 }}><IonButton onClick={() => doLogin()} expand="block">Login</IonButton></div>
                
                <div className="form-secondary-buttons">
                  <p className="cancel-button" onClick={() => history.push("/landing")}>Cancel</p>
                  <p className="forgot-password-button" onClick={() => history.push("/forgot-password")}>Forgot password?</p>
                </div>
                
              </div>

            </IonCol>
          </IonRow>
        </IonGrid>



      </IonContent>
    </IonPage>
  );
};

export default Login;
