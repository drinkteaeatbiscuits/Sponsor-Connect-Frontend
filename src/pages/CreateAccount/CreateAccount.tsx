import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonModal, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar, useIonAlert, useIonViewDidEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
import useAddImagePost from '../../hooks/useAddImagePost';
import PasswordStrengthBar from 'react-password-strength-bar';


// import './Home.css';
import './create-account.scss';

import { useHistory } from 'react-router';
import { AuthContext } from '../../App';
import React from 'react';
import OnBoardingProgress from '../../components/OnBoardingProgress/OnBoardingProgress';
import SvgScLogo from '../OnBoardingSport/images/SvgScLogo';
import Arrow from './images/Arrow';

import sports from './sports.json';
// import SearchLocationInput from '../../components/SearchLocationInput';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import IndividualSVG from './images/IndividualSVG';
import VenueSVG from './images/VenueSVG';
import TeamSVG from './images/TeamSVG';
import OtherSVG from './images/OtherSVG';
import EyeSVG from './images/EyeSVG';
import { logoEuro } from 'ionicons/icons';
import Pound from './images/Pound';


const CreateAccount: React.FC = () => {

  const history = useHistory();
  // const [dtebText, setDTEBText] = useState("");
  // const {isLoading, error, mutateAsync: addPhotoMutation} = useAddImagePost();

  // console.log(error);

  const total_steps = 3;

  const [stepNumber, setStepNumber] = useState(1);
  const [onBoardingPercentage, setOnBoardingPercentage] = useState(5);

  const { state: authState } = React.useContext(AuthContext);

  const { dispatch } = React.useContext(AuthContext);

  const [username, setUsername] = useState<any>("");
  const [yourName, setYourName] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordStrongEnough, setPasswordStrongEnough] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("Individual");
  const [profileName, setProfileName] = useState<string>("");
  
  const [selectedCurrency, setSelectedCurrency] = useState<string>("GBP");

  const [searchText, setSearchText] = useState<string>("");

  const [yourSport, setYourSport] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);


  const [validForm, setValidForm] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<any>({
    yourName: "",
    username: "",
    password: ""
  });


  const [location, setLocation] = useState<any>({});
  const [latLong, setLatLong] = useState<any>({});

  const [filteredSports, setFilteredSports] = useState<any>(sports);


  // console.log(location);

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
        currency: selectedCurrency
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

      // dispatch && dispatch({
      //   type: "setUser",
      //   payload: createAccountInfo
      // });

  
      const createProfileResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/profiles/me", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          user: createAccountInfo.user,
          accountFor: selectedOption,
          profileName: profileName,
          sport: yourSport,
          location: location,
          latLong: latLong,
          currency: selectedCurrency
          
        }),
        
      });

      const createProfileInfo = await createProfileResp.json();

      if (createProfileInfo?.statusCode) {
        // alert( "Error: " + createProfileInfo.data[0].messages[0].message );

        present({
          cssClass: 'profile-error',
          header: 'Profile Error',
          message: createProfileInfo.data[0].messages[0].message,
          buttons: [
            'Cancel',
            { text: 'Ok', handler: () => console.log('ok pressed') },
          ],
          onDidDismiss: () => console.log('did dismiss'),
        })

      } else {

        createAccountInfo.user.profile = createProfileInfo.id;

        // console.log(createAccountInfo);

        dispatch && dispatch({
          type: "setUser",
          payload: createAccountInfo
        });
      
      }

    }
  }


  const doNextStep = () => {

    // Validate Form
    if (stepNumber === 1) {

      let hasErrorMessages = !Object.values(errorMessages).every(o => o === null);

      if (hasErrorMessages) {
        console.log(errorMessages);
        document.querySelectorAll('.error-message').forEach(x => x.classList.add('show'));
      } else {
        setStepNumber(stepNumber + 1);
        setOnBoardingPercentage((stepNumber / total_steps) * 100 + 5);
      }

    } else {

      setStepNumber(stepNumber + 1);
      setOnBoardingPercentage((stepNumber / total_steps) * 100 + 5);

    }

  }


  const doPreviousStep = () => {

    setStepNumber(stepNumber - 1);
    setOnBoardingPercentage(((stepNumber - 2) / total_steps) * 100 + 5);

  }

  const doLocationSelected = (event: any) => {

    setLocation(event);
    geocodeByAddress(event.label)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        // console.log('Successfully got latitude and longitude', { lat, lng });
        setLatLong({ lat, lng });
      }
      );
  }


  let showSports;

  if (filteredSports.length > 0) {

    showSports = filteredSports.map((data: any) => {
      return (
        <IonItem className="sport" onClick={() => { setYourSport(data); setShowModal(false); }} key={data}>{data}</IonItem>
      )
    });

  } else {

    showSports = <div><IonItem key="other">Other</IonItem><div className="ion-text-center ion-padding-top" ><p>Can't find your sport?</p><p className="ion-no-margin">Please let us know here:</p><p className="ion-no-margin"><a href="mailto:info@sponsor-connect.co.uk">info@sponsor-connect.co.uk</a></p> </div></div>;

  }


  const handleFilter = (event: any) => {

    setSearchText(event.target.value);

    const query = event.target.value.toLowerCase();

    requestAnimationFrame(() => {

      let filteredSports: any = [];

      sports.forEach(item => {

        const shouldShow = item.toLowerCase().indexOf(query) > -1;

        shouldShow && filteredSports.push(item);

      });

      setFilteredSports(filteredSports);

    });

  }

  const [present] = useIonAlert();


  const validateYourName = (event: any) => {

    if (event) {

      let newArray = { ...errorMessages, "yourName": null };

      setErrorMessages(newArray);

    } else {
     
      let newArray = { ...errorMessages, yourName: "Please enter your name" };

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

  const focusOnSport = () => {
    
    document.addEventListener('ionModalDidPresent', () => { document.querySelector('ion-searchbar')?.setFocus(); });

  }


  

  return (
    <IonPage>

      <IonContent fullscreen scrollY={true} className="on-boarding create-account">

        <IonGrid className="on-boarding-grid">
          <IonRow className="">

            <IonCol className="login-image app-sidebar">

              <div className="sc-logo" onClick={() => history.push("/")}><SvgScLogo /></div>
              <OnBoardingProgress percentage={onBoardingPercentage} />

            </IonCol>

            <IonCol className="on-boarding-fields">

              <div className="create-account-steps">

                {stepNumber === 1 &&

                  <div className="create-account-step create-account">

                    <h1 className="ion-text-center">CREATE <span className="ion-color-primary">ACCOUNT</span></h1>
                    <div className="login-form">
                      <IonItem className="ion-no-padding">
                        <IonLabel position="stacked">Your Name</IonLabel>
                        <IonInput id="your-name" placeholder="Your Name" value={yourName} autocomplete="name" required={true} autofocus={true} enterkeyhint="next" type="text" autocapitalize="words" onIonInput={(e: any) => { setYourName(e.target.value); validateYourName(e.target.value); }} onIonChange={(e: any) => { setYourName(e.detail.value); validateYourName(e.detail.value); }} />
                        {errorMessages.yourName && <p className="error-message ion-no-margin"><small>{errorMessages.yourName}</small></p>}
                      </IonItem>

                      <IonItem className="ion-no-padding">
                        <IonLabel position="stacked">Email Address</IonLabel>
                        <IonInput id="your-email" placeholder="your@email.com" value={username} autocomplete="email" required={true} pattern="email" type="email" enterkeyhint="next" inputmode="email" onIonInput={(e: any) => { setUsername(e.target.value); validateUsername(e.target.value); }} onIonChange={(e: any) => { setUsername(e.detail.value); validateUsername(e.detail.value); }} />
                        {errorMessages.username && <p className="error-message ion-no-margin"><small>{errorMessages.username}</small></p> }
                      </IonItem>
                      <IonItem className="ion-no-padding password-item">
                        <IonLabel position="stacked">Password</IonLabel>
                        <EyeSVG className={ showPassword ? "password-show active" : "password-show"}  onClick={() => { showPassword ? setShowPassword(false) : setShowPassword(true) } } />
                        <IonInput id="your-password" className="password-input" value={password} enterkeyhint="go" type={ showPassword ? "text" : "password" } autocomplete="off" required={true} minlength={6} onIonInput={(e: any) => { setPassword(e.target.value); validatePassword(e.target.value); }} onIonChange={(e: any) => { setPassword(e.detail.value); validatePassword(e.detail.value); }} />
                        <PasswordStrengthBar className="password-strength" onChangeScore={(score) => { score >= 3 ? setPasswordStrongEnough(true) : setPasswordStrongEnough(false) }} password={password} barColors={['#ddd', '#ef4836', '#ff5722', '#0eb567', '#0EB59A']} />
                        {errorMessages.password && <p className="error-message ion-no-margin"><small>{errorMessages.password}</small></p> }
                      </IonItem>
                    </div>
                  </div>

                }

                {stepNumber === 2 &&
                  <div className="create-account-step select-currency">
                    <h1 className="ion-text-center" style={{textTransform: "uppercase"}}>Please Select <span className="ion-color-primary">A Currency</span></h1>
                    <div className="step-details account-for-options">
                      <div className={"option account-for-option" + (selectedCurrency === "GBP" ? " active" : "") }
                      onClick={() => setSelectedCurrency("GBP")}>
                        <div className="icon">
                          <Pound className="pound-icon" />
                        </div>
                        <div className="text">
                          <p>Pound Sterling</p>
                        </div>
                      </div>
                      <div className={"option account-for-option" + (selectedCurrency === "EUR" ? " active" : "") }
                      onClick={() => setSelectedCurrency("EUR")}>
                        <div className="icon">
                          <IonIcon color="primary" icon={logoEuro} style={{marginLeft: "-1px"}} />
                        </div>
                        <div className="text">
                          <p>Euro</p>
                        </div>
                      </div>
                    </div>

                  </div>
                }

                {stepNumber === 3 &&
                  <div className="create-account-step who-is-this-account-for">
                    <h1 className="ion-text-center">WHO IS THIS <span className="ion-color-primary">ACCOUNT FOR?</span></h1>

                    <div className="account-for-options">
                      <div className={selectedOption === 'Individual' ? 'active account-for-option' : 'account-for-option'}
                        onClick={() => setSelectedOption('Individual')}>
                        <div className="icon"><IndividualSVG /></div>
                        <div className="text">
                          <p>Individual</p>
                          <p>An individual sportsperson or athlete</p>
                        </div>
                      </div>
                      <div className={selectedOption === 'Team or Club' ? 'active account-for-option' : 'account-for-option'}
                        onClick={() => setSelectedOption('Team or Club')}>
                        <div className="icon"><TeamSVG /></div>
                        <div className="text">
                          <p>Team or Club</p>
                          <p>A group of sportspersons or club</p>
                        </div>
                      </div>
                      <div className={selectedOption === 'Venue, Event or Competition' ? 'active account-for-option' : 'account-for-option'}
                        onClick={() => setSelectedOption('Venue, Event or Competition')}>
                        <div className="icon"><VenueSVG /></div>
                        <div className="text">
                          <p>Venue, Event or Competition</p>
                          <p>Where sports take place</p>
                        </div>
                      </div>
                      <div className={selectedOption === 'Associations' ? 'active account-for-option' : 'account-for-option'}
                        onClick={() => setSelectedOption('Associations')}>
                        <div className="icon"><OtherSVG /></div>
                        <div className="text">
                          <p>Associations</p>
                          <p>Governing body or sports organization</p>
                        </div>
                      </div>

                    </div>
                  </div>
                }

                {stepNumber === 4 &&

                  <div className="create-account-step">
                    <h1 className="ion-text-center">PROFILE<br /> <span className="ion-color-primary">INFORMATION</span></h1>
                    <div className="login-form">
                      <IonItem className="ion-no-padding">
                        <IonLabel position="stacked">Profile Name</IonLabel>
                        <IonInput placeholder="Name of Athlete, Team, Venue, Event etc." value={profileName} autofocus={true} enterkeyhint="next" type="text" autocapitalize="words" onIonChange={(e: any) => setProfileName(e.detail.value)} />
                      </IonItem>

                      <IonItem className="ion-no-padding">
                        <IonLabel position="stacked">Your Sport</IonLabel>
                        <IonInput placeholder="Please select your sport" value={yourSport} readonly={true} type="text" onClick={() => { setShowModal(true); focusOnSport(); }} onFocus={() => {setShowModal(true); focusOnSport(); }} />
                      </IonItem>

                      <IonItem className="location-item ion-no-padding">

                        <IonLabel className="location-label" position="stacked" >Location</IonLabel>
              
                        <GooglePlacesAutocomplete
                          apiKey="AIzaSyBVk9Y4B2ZJG1_ldwkfUPfgcy48YzNTa4Q"

                          selectProps={{
                            location,
                            onChange: doLocationSelected,
                            placeholder: "Start typing to select location",
                            menuPlacement: "auto",
                            className: "google-places"
                          }}
                          autocompletionRequest={{
                            componentRestrictions: {
                              country: ['uk', 'ie'],
                            }
                          }}
                        />

                      </IonItem>

                    </div>
                  </div>
                }

              </div>
              <div className="create-account-buttons">

                {stepNumber < 4 ?

                  <div className="prev-next-buttons">

                    {stepNumber === 1 && <IonButton className="arrow previous" onClick={() => history.push("/sports")} expand="block"><Arrow /></IonButton>}

                    {stepNumber > 1 ? <IonButton className="arrow previous" onClick={() => doPreviousStep()} expand="block"><Arrow /></IonButton> : <div></div>}

                    <IonButton className="arrow primary-button" onClick={() => doNextStep()} expand="block"><Arrow className="next-arrow" /></IonButton>

                  </div>
                  :
                  <div className="create-account-button-group">
                    <IonButton className="arrow previous" onClick={() => doPreviousStep()} expand="block"><Arrow /></IonButton>

                    <div><IonButton className="create-account primary-button" onClick={() => doCreateAccount()} expand="block">Create Account</IonButton></div>

                    {/* <IonButton button-type="link" size="small"  onClick={() => history.push("/landing")} >cancel</IonButton> */}
                  </div>
                }
              </div>


            </IonCol>
          </IonRow>
        </IonGrid>




        <IonModal isOpen={showModal} animated={true} cssClass='select-sport-modal' backdropDismiss={false} >


          <IonToolbar className="ion-text-start">

            <IonButton className="ion-no-padding ion-color-tertiary" button-type="link" onClick={() => setShowModal(false)}>Close Search</IonButton>

            <IonSearchbar value={searchText} onIonChange={e => handleFilter(e)} placeholder="Please select your sport"></IonSearchbar>

          </IonToolbar>
          <IonContent className="ion-padding-bottom">
            <IonList className="sports-list">

              {showSports}



            </IonList>

            <IonButton className="ion-padding-top ion-padding-bottom ion-margin-bottom" button-type="link" onClick={() => setShowModal(false)}>Close Search</IonButton>

          </IonContent>

        </IonModal>


      </IonContent>



    </IonPage>
  );
};

export default CreateAccount;


function ionModalDidPresent() {
  throw new Error('Function not implemented.');
}

