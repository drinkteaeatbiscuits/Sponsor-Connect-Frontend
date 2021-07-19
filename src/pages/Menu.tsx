import { IonButton, IonContent, IonItem, IonList, IonPage } from '@ionic/react';

import Header from '../components/Header';
import { useHistory } from 'react-router';
import { AuthContext } from '../App';
import React from 'react';
import LogoutButton from '../components/LogoutButton';

const backendUrl = process.env.REACT_APP_API_URL;

const LoginButton = (props: any) => <a href={`${backendUrl}/connect/${props.providerName}`}>
    <button style={{ width: '150px' }}>Connect to {props.providerName}</button>
  </a>;



export interface props {}

const Menu: React.FC = () => {

	const { state: authState } = React.useContext(AuthContext);

	const history = useHistory();

  return (
    <IonPage>
      <Header headerTitle="Menu"/>
      <IonContent fullscreen>
	  { authState.isAuthenticated ? 
		<IonList>
			<IonItem>
				<IonButton fill="clear" expand="full" onClick={()=> history.push("/home")}>Home</IonButton>
			</IonItem>
			
			<IonItem>
				<IonButton fill="clear" expand="full" onClick={()=> history.push("/dashboard")}>Dashboard</IonButton>
			</IonItem>
			
			<IonItem>
				<IonButton fill="clear" expand="full" onClick={()=> history.push("/profile")}>Profile</IonButton>
			</IonItem>

			<IonItem>
				<IonButton fill="clear" expand="full" onClick={()=> history.push("/opportunities")}>Opportunities</IonButton>
			</IonItem>
			
			<IonItem>
				<IonButton fill="clear" expand="full" onClick={()=> history.push("/settings")}>Settings</IonButton>
			</IonItem>

			<IonItem>
				{/* <IonButton fill="clear" expand="full" onClick={()=> history.push("/logout")}>Logout</IonButton> */}
				<LogoutButton/>
				
			</IonItem>
			
		</IonList>
		
		:

		<IonList>

			<IonItem>
				<IonButton fill="clear" expand="full" onClick={()=> history.push("/home")}>Home</IonButton>
			</IonItem>
			
			<IonItem>
				<IonButton fill="clear" expand="full" onClick={()=> history.push("/profiles")}>Profiles</IonButton>
			</IonItem>

			<IonItem>
				<IonButton fill="clear" expand="full" onClick={()=> history.push("/create-account")}>Create Account</IonButton>
			</IonItem>

			<IonItem>
				<IonButton fill="clear" expand="full" onClick={()=> history.push("/login")}>Login</IonButton>
			</IonItem>
			
		</IonList>
		
		
		}
       
      </IonContent>
    </IonPage>
  );
};

export default Menu;
