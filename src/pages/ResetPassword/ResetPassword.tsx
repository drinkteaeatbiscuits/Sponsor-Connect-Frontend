import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow, useIonViewDidEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { AuthContext } from "../../App";
import SvgScLogo from '../OnBoardingSport/images/SvgScLogo';
import { useHistory, useParams } from 'react-router';
import { keypadOutline } from 'ionicons/icons';
import {useLocation} from "react-router-dom";

export interface props { }

// interface ParamTypes {
//   code: string;
// }

const ResetPassword: React.FC<props> = () => {

  const history = useHistory();

  const [password, setPassword] = useState<any>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<any>("");
  const [resetPasswordSet, setResetPasswordSet] = useState<any>("");
  // const [privateCode, setPrivateCode] = useState<any>("");

  
  const search = useLocation().search;
  const code = new URLSearchParams(search).get('code');


  // const code = useParams<ParamTypes>();

  console.log(code);

  const doForgotPassword = async () => {

    const forgotPasswordResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/auth/reset-password", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        code: code,
        password: password,
        passwordConfirmation: passwordConfirmation,
      }),

    });

    const forgotPasswordInfo = await forgotPasswordResp.json();

    if (forgotPasswordInfo?.statusCode) {

      alert("Error: " + forgotPasswordInfo.data[0].messages[0].message);

    } else {

      setResetPasswordSet("Your new password has been set.")

    }
  }

  const keyUp = (event: any) => {
    if (event.keyCode === 13) {
      doForgotPassword();
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
            {!resetPasswordSet ? 
              <div className="login-form">
                <IonItem className="ion-no-padding">
                  <IonLabel position="stacked">New Password</IonLabel>
                  <IonInput type="password" onKeyUp={(e: any) => keyUp(e)} onIonChange={(e: any) => setPassword(e.detail.value)} />
                </IonItem>
                <IonItem className="ion-no-padding">
                  <IonLabel position="stacked">New Password Confirmation</IonLabel>
                  <IonInput type="password" onKeyUp={(e: any) => keyUp(e)} onIonChange={(e: any) => setPasswordConfirmation(e.detail.value)} />
                </IonItem>
                <div style={{ paddingTop: 8 }}><IonButton type="submit" onClick={() => doForgotPassword()} expand="block">Submit</IonButton></div>
                <div className="form-secondary-buttons">
                  <p className="text-center" onClick={() => history.push("/forgot-password")}>Request new link</p>
                  
                </div>
              </div>
            :
              <div>
                <div className="forgot-password-sent-message ion-text-center">{ resetPasswordSet }</div>
                <div style={{ paddingTop: 8 }}><IonButton onClick={() => history.push("/login")} expand="block">Login</IonButton></div>
              </div>
            }
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;
