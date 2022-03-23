import { IonButton, IonContent, IonInput, IonPage, IonSpinner } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';

import "./Account.scss"
import MetaTags from '../../components/MetaTags/MetaTags';

export interface props { }

const Account: React.FC = () => {

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [currentValue, setCurrentValue] = useState(authState.user.email);
  const [emailSet, setEmailSet] = useState(false);
  
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [yourName, setYourName] = useState("");
  const [currentValueYourName, setCurrentValueYourName] = useState(authState.user.yourName);
  const [nameSet, setNameSet] = useState(false);

  const [isLoadingPasswordReset, setIsLoadingPasswordReset] = useState(false);

  const [sectionData, setSectionData] = useState({});

  const fieldRef = "";

  const saveField = (sectionData) => {
    console.log(sectionData)
  }


  const [forgotPasswordSent, setForgotPasswordSent] = useState<any>("");

  const doForgotPassword = async () => {

    setIsLoadingPasswordReset(true);

    const forgotPasswordResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/auth/forgot-password", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email: authState.user.email,
        url: (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/admin/plugins/users-permissions/auth/reset-password',
      }),

    });

    const forgotPasswordInfo = await forgotPasswordResp.json();

    if (forgotPasswordInfo?.statusCode) {

      alert("Error: " + forgotPasswordInfo.data[0].messages[0].message);

    } else {
 
      setForgotPasswordSent("Reset password link sent. Please check your inbox.")

    }

    setIsLoadingPasswordReset(false);

    
  }

  useEffect(() => {
    
    !emailSet && !emailAddress && currentValue && setEmailAddress(currentValue); setEmailSet(true);
    !nameSet && !yourName && currentValueYourName && setYourName(currentValueYourName); setNameSet(true);

  });

  console.log(authState.user.email)

  return (
    <IonPage>

      <MetaTags title={'Account | Sponsor Connect'} path={'/settings/account'} description={'Sponsor Connect account settings.'} image={ "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />

      <TabBar activeTab="settings" />

      <IonContent className="editor-content" fullscreen>
        <div className="content">
          <div className="account-settings">
            <h1 style={{ color: "var(--ion-color-dark)", lineHeight: 0.8, fontSize: "4em", padding: "15px" }}>ACCOUNT <br /><span style={{ color: "var(--ion-color-primary)" }}>SETTINGS</span></h1>
            <div className="editor-wrap">

              <div className=" editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Your Name</label>

                  <div className="editor-section-top-buttons">

                    {!showNameEdit ? <div className="editor-section-button" onClick={() => setShowNameEdit(true)}>{emailAddress ? "Edit" : "Add"}</div> :

                      <div className="editor-section-button secondary" onClick={() => { setShowNameEdit(false); currentValueYourName && setYourName(currentValueYourName); }}>Cancel</div>}

                    {showNameEdit && <div className="editor-section-button" onClick={() => saveField({ yourName })} >Save</div>}

                  </div>

                </div>

                <div className={"editor-section-bottom " + (showNameEdit ? "show-editor" : "")}>

                  {showNameEdit &&  <IonInput autocomplete="off"
                    autocapitalize="on"
                    type="text"
                    value={yourName}
                    onIonChange={(e: any) => {
                      setYourName(e.detail.value);
                    }} /> }

                  {!showNameEdit && <p style={{margin: '12px 0 8px'}}>{yourName}</p>}

                </div>

              </div>

              <div className=" editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Email Address</label>

                  <div className="editor-section-top-buttons">

                    {!showEmailEdit ? <div className="editor-section-button" onClick={() => setShowEmailEdit(true)}>{emailAddress ? "Edit" : "Add"}</div> :

                      <div className="editor-section-button secondary" onClick={() => { setShowEmailEdit(false); currentValue && setEmailAddress(currentValue); }}>Cancel</div>}

                    {showEmailEdit && <div className="editor-section-button" onClick={() => saveField({ emailAddress })} >Save</div>}

                  </div>

                </div>

                <div className={"editor-section-bottom " + (showEmailEdit ? "show-editor" : "")}>

                {showEmailEdit &&  <IonInput autocomplete="off"
                    autocapitalize="on"
                    type="text"
                    value={emailAddress}
                    onIonChange={(e: any) => {
                      setEmailAddress(e.detail.value);
                    }} /> }

                  {!showEmailEdit && <p style={{margin: '12px 0 8px'}}>{emailAddress}</p>}

                </div>

              </div>
              
              <div className=" editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Password Reset</label>

                  <div className="editor-section-top-buttons">

                    <div className="editor-section-button" onClick={() => doForgotPassword()}>Reset Password</div>
                  
                  </div>

                </div>

                <div className={"editor-section-bottom " + (showEmailEdit ? "show-editor" : "")}>

                  { forgotPasswordSent && forgotPasswordSent }

                  { isLoadingPasswordReset && <IonSpinner /> }

                  { !forgotPasswordSent && !isLoadingPasswordReset && <p>Send password reset email.</p> }

                </div>

              </div>

            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>


  );
};

export default Account;
