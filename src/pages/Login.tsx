import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage } from '@ionic/react';

import React, { useState } from 'react';
import Header from '../components/Header';
import Cookies from 'js-cookie';

import { AuthContext } from "../App";

export interface props {}

const Login: React.FC<props> = () => {

    const [username, setUsername] = useState<any>("");
    const [password, setPassword] = useState<any>("");
    
    const { state: authState } = React.useContext(AuthContext);

    const { dispatch } = React.useContext( AuthContext );

    const doLogin = async () => {
      
      console.log(username, password);

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
            
            console.log(loginInfo);

            // Cookies.set('strapi_user_jwt', loginInfo.jwt);

            dispatch && dispatch({
              type: "setUser",
              payload: loginInfo
            });
            
        }
    }

    const doLogoutFunction = () => {
      dispatch && dispatch({
        type: "LOGOUT"
      });
    }

  return (
    <IonPage>
      <Header headerTitle={ !authState.isAuthenticated ? 'Login' : 'Logout'}/>
      <IonContent fullscreen className="ion-padding">
     
        <div className="login-form">
          <IonItem>
            <IonLabel position="stacked">Username</IonLabel>
            <IonInput type="text" onIonChange={ (e:any) => setUsername(e.detail.value) } />
          </IonItem>
              <IonItem>
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput type="password" onIonChange={ (e:any) => setPassword(e.detail.value) } />
          </IonItem> 
          <div style={{paddingTop: 8}}><IonButton onClick={()=> doLogin()} expand="block">Login</IonButton></div>
        </div>
      
      
       {/* <div style={{paddingTop: 8}}><IonButton onClick={()=> doLogoutFunction()} expand="block">Logout</IonButton></div>
         */}
      </IonContent>
    </IonPage>
  );
};

export default Login;
