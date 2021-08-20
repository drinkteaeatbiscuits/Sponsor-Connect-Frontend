import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { useState } from 'react';
import useAddImagePost from '../../hooks/useAddImagePost';
// import './Home.css';
import './create-account.scss';

import { useHistory } from 'react-router';
import { AuthContext } from '../../App';
import React from 'react';
import OnBoardingProgress from '../../components/OnBoardingProgress/OnBoardingProgress';
import SvgScLogo from '../Landing/images/SvgScLogo';
import Arrow from './images/Arrow';

const CreateAccount: React.FC = () => {

  const history = useHistory();
  // const [dtebText, setDTEBText] = useState("");
  // const {isLoading, error, mutateAsync: addPhotoMutation} = useAddImagePost();

  // console.log(error);

  const total_steps = 3;

  const [stepNumber, setStepNumber] = useState(1);
  const [onBoardingPercentage, setOnBoardingPercentage] = useState(5);

  const { state: authState } = React.useContext(AuthContext);

  const { dispatch } = React.useContext( AuthContext );

    const [username, setUsername] = useState<any>("");
    const [yourName, setYourName] = useState<any>("");
    const [password, setPassword] = useState<any>("");
    const [selectedOption, setSelectedOption] = useState<string>("Individual");

    const doCreateAccount = async () => {
        console.log(username, password);

        const URL = "http://localhost:1337";
  
      const createAccountResp = await fetch(URL + "/auth/local/register", {
          headers: {
              "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({ 
              username: username,
              email: username,
              password: password 
            }),
            credentials: "include",
        });

        
        const createAccountInfo = await createAccountResp.json();

        if(createAccountInfo?.statusCode) {

            alert( "Error: " + createAccountInfo.data[0].messages[0].message );

        }else{

            console.log( "User account created" );
            console.log(createAccountInfo);

            dispatch && dispatch({
              type: "setUser",
              payload: createAccountInfo
            });
            
            
            const createProfileResp = await fetch(process.env.REACT_APP_API_URL + "/profiles/me", {
              headers: {
                  "Content-Type": "application/json"
              },
              method: "POST",
              body: JSON.stringify({ 
                  user: createAccountInfo.user,
                }),
              credentials: "include",
            });

            const createProfileInfo = await createProfileResp.json();

            if(createProfileInfo?.statusCode) {
              alert( "Error: " + createProfileInfo.data[0].messages[0].message );
            }else{
              console.log(createProfileInfo);
            }

            
             
        }
    }

    const doNextStep = () => {
      setStepNumber(stepNumber + 1);

      setOnBoardingPercentage((stepNumber / total_steps ) * 100 + 5);
    }

    const doPreviousStep = () => {

      setStepNumber(stepNumber - 1);

      setOnBoardingPercentage(((stepNumber - 2) / total_steps ) * 100 + 5);

    }

  return (
    <IonPage>
      
      <IonContent fullscreen scrollY={true} className="ion-padding-start ion-padding-end ion-padding-bottom">

      <IonGrid className="flex-direction-column ion-padding-top">
          <IonRow className="">
            
            <IonCol className="login-image">


              <OnBoardingProgress percentage={onBoardingPercentage} />
              
            
            </IonCol>
            <IonCol className="" size="auto">

              <div className="create-account-steps">

                { stepNumber === 1 &&

                <div className="create-account-step create-account">
                  
                  <h1 className="ion-text-center">CREATE <span className="ion-color-primary">ACCOUNT</span></h1>
                  <div className="login-form">
                    <IonItem className="ion-no-padding">
                      <IonLabel position="stacked">Your Name</IonLabel>
                      <IonInput placeholder="Your Name" autofocus={true} enterkeyhint="next" type="text" autocapitalize="words" onIonChange={ (e:any) => setYourName(e.detail.value) } />
                    </IonItem>
                    
                    <IonItem className="ion-no-padding">
                      <IonLabel position="stacked">Email Address</IonLabel>
                      <IonInput placeholder="your@email.com" type="email" enterkeyhint="next" onIonChange={ (e:any) => setUsername(e.detail.value) } />
                    </IonItem>
                    <IonItem className="ion-no-padding">
                      <IonLabel position="stacked">Password</IonLabel>
                      <IonInput enterkeyhint="go" type="password" onIonChange={ (e:any) => setPassword(e.detail.value) } />
                    </IonItem>
                  </div>
                </div>

                }

                { stepNumber === 2 && 
                  <div className="create-account-step who-is-this-account-for">
                    <h1 className="ion-text-center">WHO IS THIS <span className="ion-color-primary">ACCOUNT FOR?</span></h1>

                    <div className="account-for-options">
                      <div className={ selectedOption === 'Individual' ? 'active account-for-option' : 'account-for-option' }
                      onClick={() => setSelectedOption('Individual')}>
                        <div className="icon"></div>
                        <div className="text">
                          <p>Individual</p>
                          <p>An individual sportsperson or athlete</p>
                        </div>
                      </div>
                      <div className={ selectedOption === 'Team or Club' ? 'active account-for-option' : 'account-for-option' }
                      onClick={() => setSelectedOption('Team or Club')}> 
                        <div className="icon"></div>
                        <div className="text">
                          <p>Team or Club</p>
                          <p>A group of sportspersons or club</p>
                        </div>
                      </div>
                      <div className={ selectedOption === 'Venue, Event or Competition' ? 'active account-for-option' : 'account-for-option' }
                      onClick={() => setSelectedOption('Venue, Event or Competition')}>
                        <div className="icon"></div>
                        <div className="text">
                          <p>Venue, Event or Competition</p>
                          <p>Where sports take place</p>
                        </div>
                      </div>
                      <div className={ selectedOption === 'Other' ? 'active account-for-option' : 'account-for-option' }
                      onClick={() => setSelectedOption('Other')}>
                        <div className="icon"></div>
                        <div className="text">
                          <p>Other</p>
                          <p>None of the above</p>
                        </div>
                      </div>


                    </div>
                    
                  </div>
                }

                { stepNumber === 3 && 
                  <div className="create-account-step">
                    <h1 className="ion-text-center">PROFILE INFORMATION</h1>
                    <div className="login-form">
                    <IonItem className="ion-no-padding">
                      <IonLabel position="stacked">Profile Name</IonLabel>
                      <IonInput placeholder="Name of Athlete, Team, Venue, Event etc." autofocus={true} enterkeyhint="next" type="text" autocapitalize="words" onIonChange={ (e:any) => setYourName(e.detail.value) } />
                    </IonItem>
                    
                    <IonItem className="ion-no-padding">
                      <IonLabel position="stacked">Your Sport</IonLabel>
                      <IonInput placeholder="Please select your sport" type="text" enterkeyhint="next" onIonChange={ (e:any) => setUsername(e.detail.value) } />
                    </IonItem>
                    <IonItem className="ion-no-padding">
                      <IonLabel position="stacked">Location</IonLabel>
                      <IonInput placeholder="Start typing to select location" enterkeyhint="go" type="text" onIonChange={ (e:any) => setPassword(e.detail.value) } />
                    </IonItem>
                  </div>
                  </div>
                }

              </div> 
              <div className="create-account-buttons">
              {/* {stepNumber}
              {onBoardingPercentage} */}
              { stepNumber < 3 ? 
                
                <div className="prev-next-buttons">

                { stepNumber === 1 && <IonButton className="arrow previous" onClick={() => history.push("/landing")} expand="block"><Arrow /></IonButton> }

                { stepNumber > 1 ? <IonButton className="arrow previous" onClick={()=> doPreviousStep()} expand="block"><Arrow /></IonButton> : <div></div>}

                  <IonButton className="arrow" onClick={()=> doNextStep()} expand="block"><Arrow className="next-arrow" /></IonButton>
                
               </div> 
                :
                <div className="create-account-button-group">
                  <IonButton className="arrow previous" onClick={()=> doPreviousStep()} expand="block"><Arrow /></IonButton>
               
                  <div><IonButton className="create-account" onClick={()=> doCreateAccount()} expand="block">Create Account</IonButton></div>
                  
                  {/* <IonButton button-type="link" size="small"  onClick={() => history.push("/landing")} >cancel</IonButton> */}
                </div>
                }
              </div>
              

            </IonCol>
          </IonRow>
        </IonGrid>

        

            
            
        
		    
	  </IonContent>

    </IonPage>
  );
};

export default CreateAccount;
