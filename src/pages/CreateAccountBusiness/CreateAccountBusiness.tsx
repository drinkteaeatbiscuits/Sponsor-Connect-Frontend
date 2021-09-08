import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonModal, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar, useIonAlert, useIonViewDidEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
import useAddImagePost from '../../hooks/useAddImagePost';
import PasswordStrengthBar from 'react-password-strength-bar';


// import './Home.css';
import './CreateAccountBusiness.scss';

import { useHistory } from 'react-router';
import { AuthContext } from '../../App';
import React from 'react';
import OnBoardingProgress from '../../components/OnBoardingProgress/OnBoardingProgress';
import SvgScLogo from '../OnBoardingSport/images/SvgScLogo';
import Arrow from '../CreateAccount/images/Arrow';

// import SearchLocationInput from '../../components/SearchLocationInput';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import IndividualSVG from '../CreateAccount/images/IndividualSVG';
import VenueSVG from '../CreateAccount/images/VenueSVG';
import TeamSVG from '../CreateAccount/images/TeamSVG';
import OtherSVG from '../CreateAccount/images/OtherSVG';
import EyeSVG from '../CreateAccount/images/EyeSVG';


const CreateAccountBusiness: React.FC = () => {

  const history = useHistory();

  const { state: authState } = React.useContext(AuthContext);

  const { dispatch } = React.useContext(AuthContext);

  const [username, setUsername] = useState<any>("");
  const [yourName, setYourName] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordStrongEnough, setPasswordStrongEnough] = useState<boolean>(false);

  const [validForm, setValidForm] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<any>({
    "yourName": "Please enter your name",
    "username": "Please enter an email address",
    "password": "Please enter a password"
  });


  const doCreateAccount = async () => {
    // console.log(username, password, yourName);

    const createAccountResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/auth/local/register", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ 
        username: username,
        email: username,
        password: password,
        yourName: yourName,
        accountType: "Business",
      }),
      credentials: "include",
    });


    const createAccountInfo = await createAccountResp.json();

    if (createAccountInfo?.statusCode) {

      present({
        cssClass: 'account-error',
        header: 'Account Error',
        message: createAccountInfo?.data[0].messages[0].message,
        buttons: [
          'Cancel',
          { text: 'Ok', handler: () => console.log('ok pressed') },
        ],
        onDidDismiss: () => console.log('did dismiss'),
      })
    } else {

        dispatch && dispatch({
          type: "setUser",
          payload: createAccountInfo
        });
      
      }

    }

  const [present] = useIonAlert();


  const validateYourName = (event: any) => {

    if (event) {

      let newArray = { ...errorMessages, "yourName": null };

      setErrorMessages(newArray);

    } else {

      let newArray = { ...errorMessages, "yourName": "Please enter your name" };

      setErrorMessages(newArray);

    }

  }

  const ValidateEmail = (inputText: any) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.match(mailformat)) {
      return true;
    } else {
      return false;
    }
  }


  const validateUsername = (event: any) => {

    // console.log(event);

    let newArray = {};

    if (event) {

      newArray = { ...errorMessages, "username": null };

      if (ValidateEmail(event)) {
        newArray = { ...errorMessages, "username": null };
      } else {
        newArray = { ...errorMessages, "username": "Please enter a valid email address" };
      }

    } else {

      newArray = { ...errorMessages, "username": "Please enter an email address" };

    }

    setErrorMessages(newArray);

  }


  const validatePassword = (event: any) => {

    if (event) {

      let newArray = { ...errorMessages, "password": null };

      if (!passwordStrongEnough) {
        let newArray = { ...errorMessages, "password": "Please enter a stronger password" };
        setErrorMessages(newArray);
      } else {
        setErrorMessages(newArray);
      }

    } else {

      let newArray = { ...errorMessages, "password": "Please enter a password" };

      setErrorMessages(newArray);

    }

  }
  

  return (
    <IonPage>

      <IonContent fullscreen scrollY={true} className="on-boarding create-account">

        <IonGrid className="on-boarding-grid">
          <IonRow className="">

            <IonCol className="login-image app-sidebar">

              <div className="sc-logo" onClick={() => history.push("/")}><SvgScLogo /></div>
              
            </IonCol>

            <IonCol className="on-boarding-fields">

              <div className="create-account-steps">

                  <div className="create-account-step create-account">

                    <h1 className="ion-text-center">CREATE ACCOUNT</h1>
      
                    <div className="login-form">
                      <IonItem className="ion-no-padding">
                        <IonLabel position="stacked">Your Name</IonLabel>
                        <IonInput id="your-name" placeholder="Your Name" value={yourName} autocomplete="name" required={true} autofocus={true} enterkeyhint="next" type="text" autocapitalize="words" onIonChange={(e: any) => { setYourName(e.detail.value); validateYourName(e.detail.value); }} />
                        {errorMessages.yourName && <p className="error-message ion-no-margin"><small>{errorMessages.yourName}</small></p>}
                      </IonItem>

                      <IonItem className="ion-no-padding">
                        <IonLabel position="stacked">Email Address</IonLabel>
                        <IonInput id="your-email" placeholder="your@email.com" value={username} autocomplete="email" required={true} pattern="email" type="email" enterkeyhint="next" inputmode="email" onIonChange={(e: any) => { setUsername(e.detail.value); validateUsername(e.detail.value); }} />
                        {errorMessages.username && <p className="error-message ion-no-margin"><small>{errorMessages.username}</small></p> }
                      </IonItem>
                      <IonItem className="ion-no-padding password-item">
                        <IonLabel position="stacked">Password</IonLabel>
                        <EyeSVG className={ showPassword ? "password-show active" : "password-show"}  onClick={() => { showPassword ? setShowPassword(false) : setShowPassword(true) } } />
                        <IonInput id="your-password" className="password-input" value={password} enterkeyhint="go" type={ showPassword ? "text" : "password" } autocomplete="off" required={true} minlength={6} onIonChange={(e: any) => { setPassword(e.detail.value); validatePassword(e.detail.value); }} />
                        <PasswordStrengthBar className="password-strength" onChangeScore={(score) => { score >= 3 ? setPasswordStrongEnough(true) : setPasswordStrongEnough(false) }} password={password} barColors={['#ddd', '#ef4836', '#ff5722', '#0eb567', '#0EB59A']} />
                        {errorMessages.password && <p className="error-message ion-no-margin"><small>{errorMessages.password}</small></p> }
                      </IonItem>
                    </div>
                  </div>

              </div>
              <div className="create-account-buttons">

                
                  <div className="create-account-button-group">
                    <IonButton className="arrow previous" onClick={() => history.push('/')} expand="block"><Arrow /></IonButton>

                    <div><IonButton className="create-account primary-button" onClick={() => doCreateAccount()} expand="block">Create Account</IonButton></div>

                  </div>
             
              </div>


            </IonCol>
          </IonRow>
        </IonGrid>




  


      </IonContent>



    </IonPage>
  );
};

export default CreateAccountBusiness;


function ionModalDidPresent() {
  throw new Error('Function not implemented.');
}

