import { IonButton, IonContent, IonPage, useIonViewDidEnter } from '@ionic/react';
// import Header from '../components/Header';
import { AuthContext } from '../App';
import React from 'react';
import { useHistory } from 'react-router';
// import TabBar from '../components/TabBar'; 

export interface props { }

const Home: React.FC = () => {

  const history = useHistory();

  const { state: authState } = React.useContext(AuthContext);

  const { dispatch } = React.useContext( AuthContext );

  console.log(authState);

  useIonViewDidEnter(() => {
    dispatch && dispatch({
      type: "setOnBoardingPercentage",
      payload: 0
    });
  });

  return (
    <IonPage>
      {/* <Header headerTitle="Home" /> */}
      {/* <TabBar/> */}
      <IonContent fullscreen>

        {authState.isAuthenticated ? <p>Hello {authState.user.id}</p> :
          <div>
            <IonButton color="primary" onClick={() => history.push("/landing")} expand="block">Let's Go</IonButton>
            
          </div>}

          
      </IonContent>
    </IonPage>
  );
};

export default Home;
