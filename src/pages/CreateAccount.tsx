import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import useAddImagePost from '../hooks/useAddImagePost';
// import './Home.css';
import { useHistory } from 'react-router';
import { AuthContext } from '../App';
import React from 'react';

const CreateAccount: React.FC = () => {

  const history = useHistory();
  // const [dtebText, setDTEBText] = useState("");
  // const {isLoading, error, mutateAsync: addPhotoMutation} = useAddImagePost();

  // console.log(error);

  const { state: authState } = React.useContext(AuthContext);

  const { dispatch } = React.useContext( AuthContext );


    const [username, setUsername] = useState<any>("");
    const [password, setPassword] = useState<any>("");

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


            
            const createProfileResp = await fetch(URL + "/profiles/me", {
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

            dispatch && dispatch({
              type: "setUser",
              payload: createAccountInfo
            });
             
        }
    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Account</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={()=> history.goBack()}>Cancel</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">

            <IonItem>
			    <IonLabel position="stacked">Username</IonLabel>
			    <IonInput type="text" onIonChange={ (e:any) => setUsername(e.detail.value) } />
		    </IonItem>
            <IonItem>
			    <IonLabel position="stacked">Password</IonLabel>
			    <IonInput type="password" onIonChange={ (e:any) => setPassword(e.detail.value) } />
		    </IonItem>
        
		    <div style={{paddingTop: 8}}><IonButton onClick={()=> doCreateAccount()} expand="block">Create Account</IonButton></div>
	  </IonContent>

    </IonPage>
  );
};

export default CreateAccount;
