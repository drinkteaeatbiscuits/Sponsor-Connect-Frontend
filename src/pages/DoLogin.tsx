import { IonButton, IonContent, IonPage, useIonViewDidEnter } from '@ionic/react';
import Header from '../components/Header';
import { useHistory, useParams } from 'react-router';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';


export interface loginProps {
	test: 'test'
}



const DoLogin: React.FC<any> = ( { loginProps } ) => {

	let { id_token } = useParams();
	console.log(id_token);

	const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
	const [userMetadata, setUserMetadata] = useState(null);

	// useIonViewDidEnter(() => {
  
	// 	console.log(match);

	//   });



	

	// const { match: {params: { provider }}, location: { search } } = this.props;
	// const requestURL = `http://localhost:1337/auth/${provider}/callback${search}`;
 
	console.log(Cookies.get());

	const history = useHistory();

  return (
    <IonPage>
      <Header headerTitle="Do Login"/>
      <IonContent fullscreen>
	  	{/* isAuthenticated && (
		<div>
			<img src={user.picture} alt={user.name} />
			<h2>{user.name}</h2>
			<p>{user.email}</p>
			<h3>User Metadata</h3>
			{userMetadata ? (
			<pre>{JSON.stringify(userMetadata, null, 2)}</pre>
			) : (
			"No user metadata defined"
			)}
		</div>
		) */}
	  	<IonButton onClick={()=> history.push("/logout")}>Logout</IonButton>
       
      </IonContent>
    </IonPage>
  );
};

export default DoLogin;
