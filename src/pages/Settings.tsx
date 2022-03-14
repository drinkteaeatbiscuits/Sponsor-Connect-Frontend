import {  IonContent, IonIcon, IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import { AuthContext } from "../App";
import React from 'react';
import LogoutButton from '../components/LogoutButton';
import TabBar from '../components/TabBar';
import { card, key } from 'ionicons/icons';

export interface props {}

const Settings: React.FC = () => {

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const greeting = () => {
    const today = new Date()
    const currentHour = today.getHours()

    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }

  return (
    <IonPage>

      <TabBar activeTab="settings"/>
      <IonContent fullscreen className="ion-padding dashboard">
        <div className="content">
          <div className="hello-message ion-padding-top ion-padding-bottom ion-margin-bottom">
              <p className="hello ion-no-margin"><strong>Hello{authState.user?.yourName && (" " + authState.user?.yourName?.split(" ")[0])},</strong></p>
              <p className="greeting ion-no-margin">{greeting()}</p>
            </div>

            <div className="menu-list ion-padding-top ion-margin-top ion-margin-bottom ion-padding-bottom">
            
            {authState.user?.accountType !== "Business" &&
          
            <div className="menu-list-option ion-margin-top"
              onClick={() => history.push("/settings/subscription/")}>
              <div className="icon">
                <IonIcon color="primary" icon={card} />
              </div>
              <div className="text">
                <p className="main-text">Subscription/Billing</p>
                <p className="sub-text">Manage your payment settings</p>
              </div>
            </div>
            }

            <div className={authState.user?.accountType === "Business" ? "menu-list-option ion-margin-top" : "menu-list-option"}
              onClick={() => history.push("/settings/account/")}>
              <div className="icon">
                <IonIcon color="primary" icon={key} />
              </div>
              <div className="text">
                <p className="main-text">Account</p>
                <p className="sub-text">Manage your account settings</p>
              </div>
            </div>

            {/* <div className='menu-list-option'
              onClick={() => history.push("/settings/notifications/")}>
              <div className="icon">
                <IonIcon color="primary" icon={notifications} />
              </div>
              <div className="text">
                <p className="main-text">Notifications</p>
                <p className="sub-text">Manage your notifications</p>
              </div>
            </div> */} 

            <LogoutButton className="logout-button button-tertiary ion-margin-bottom" expand="block" size="small" />

          </div>
        </div>
          
      </IonContent>
    </IonPage>
  );
};

export default Settings;

