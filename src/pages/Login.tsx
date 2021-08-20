import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow, useIonViewDidEnter } from '@ionic/react';

import React, { useEffect, useState } from 'react';

import { AuthContext } from "../App";
import OnBoardingProgress from '../components/OnBoardingProgress/OnBoardingProgress';
import SvgScLogo from './Landing/images/SvgScLogo';
import { useHistory } from 'react-router';
import { keypadOutline } from 'ionicons/icons';

export interface props {}

const Login: React.FC<props> = () => { 

    const history = useHistory();
 
    const [username, setUsername] = useState<any>("");
    const [password, setPassword] = useState<any>("");
    


    const { dispatch } = React.useContext( AuthContext );




    const doLogin = async () => {
      

      const URL = process.env.REACT_APP_API_URL;
  
      const loginResp = await fetch( URL + "/auth/local", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ 
              identifier: username,
              password: password 
            }), 
          credentials: "include",
        });
  
        const loginInfo = await loginResp.json();

        if(loginInfo?.statusCode) {

            alert( "Error: " + loginInfo.data[0].messages[0].message );

        }else{
            // alert( "User logged in" );
            
            // console.log(loginInfo);

            // Cookies.set('strapi_user_jwt', loginInfo.jwt);

            dispatch && dispatch({
              type: "setUser",
              payload: loginInfo
            });
            
        }
    }

    const keyUp = (event:any) => {
      if (event.keyCode === 13) {
        doLogin();
      }
    }
    
    

  return (
    <IonPage>
      {/* <Header headerTitle={ !authState.isAuthenticated ? 'Login' : 'Logout'}/> */}
      <IonContent fullscreen className="ion-padding">


      <IonGrid className="flex-direction-column ">
          <IonRow className="">
            <IonCol className="logo ion-text-center ion-padding" size="auto">
              <div onClick={() => history.push("/")}><SvgScLogo /></div>
            </IonCol>
            <IonCol className="login-image">


            <OnBoardingProgress percentage={10} />
              
            
            </IonCol>
            <IonCol className="" size="auto">

              <div className="login-form">
                <IonItem className="ion-no-padding">
                  <IonLabel position="stacked">Username</IonLabel>
                  <IonInput type="email" onKeyUp={ (e:any)=> keyUp(e) } onIonChange={ (e:any) => setUsername(e.detail.value) } />
                </IonItem>
                <IonItem className="ion-no-padding">
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput type="password" onKeyUp={ (e:any)=> keyUp(e) } onIonChange={ (e:any) => setPassword(e.detail.value) } />
                </IonItem> 
                <div style={{paddingTop: 8}}><IonButton onClick={()=> doLogin()} expand="block">Login</IonButton></div>

                <IonButton button-type="link"  onClick={() => history.push("/landing")} >cancel</IonButton>
              </div>

            </IonCol>
          </IonRow>
        </IonGrid>


    
      </IonContent>
    </IonPage>
  );
};

export default Login;
