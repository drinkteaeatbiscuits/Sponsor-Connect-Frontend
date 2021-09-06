import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow, useIonViewDidEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { AuthContext } from "../../App";
import SvgScLogo from '../OnBoardingSport/images/SvgScLogo';
import { useHistory } from 'react-router';
import { keypadOutline } from 'ionicons/icons';

export interface props { }

const ForgotPassword: React.FC<props> = () => {

  const history = useHistory();

  const [email, setEmail] = useState<any>("");
  const [forgotPasswordSent, setForgotPasswordSent] = useState<any>("");

  const doForgotPassword = async () => {

    const forgotPasswordResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/auth/forgot-password", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        url: (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/admin/plugins/users-permissions/auth/reset-password',
      }),

    });

    const forgotPasswordInfo = await forgotPasswordResp.json();

    if (forgotPasswordInfo?.statusCode) {

      alert("Error: " + forgotPasswordInfo.data[0].messages[0].message);

    } else {

      setForgotPasswordSent("Reset password link sent. Please check your inbox.")

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
            {!forgotPasswordSent ? 
              <div className="login-form">
                <IonItem className="ion-no-padding">
                  <IonLabel position="stacked">Email Address</IonLabel>
                  <IonInput type="email" onKeyUp={(e: any) => keyUp(e)} onIonChange={(e: any) => setEmail(e.detail.value)} />
                </IonItem>
                <div style={{ paddingTop: 8 }}><IonButton type="submit" onClick={() => doForgotPassword()} expand="block">Submit</IonButton></div>
                <div className="form-secondary-buttons">
                  <p className="cancel-button text-center" onClick={() => history.push("/login")}>Back to login</p>
                </div>
              </div>
            :
              <div className="forgot-password-sent-message ion-text-center">
                <p>{ forgotPasswordSent }</p>
                <div className="form-secondary-buttons">
                  <p className="cancel-button text-center" onClick={() => history.push("/login")}>Back to login</p>
                </div>
              </div>
              
            }
            </IonCol>
          </IonRow>
        </IonGrid>



      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
