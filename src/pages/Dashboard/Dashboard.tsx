import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';


import './dashboard.scss';
import { personCircle, trailSign, settings } from 'ionicons/icons';

export interface props { }

const Dashboard: React.FC = () => {

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
      <TabBar activeTab="dashboard" />
      <IonContent fullscreen className="ion-padding dashboard">
        <div className="content">
          <div className="hello-message ion-padding-top ion-padding-bottom ion-margin-bottom">
            <p className="hello ion-no-margin"><strong>Hello{authState.user?.yourName && (" " + authState.user?.yourName?.split(" ")[0])},</strong></p>
            <p className="greeting ion-no-margin">{greeting()}</p>
          </div>
        {authState.user?.accountType !== "Business" ?
          <div className="menu-list ion-padding-top ion-margin-top ion-margin-bottom ion-padding-bottom">
          
            <div className="menu-list-option ion-margin-top"
              onClick={() => history.push("/profile/" + authState?.user?.profile)}>
              <div className="icon">
                <IonIcon color="primary" icon={personCircle} />
              </div>
              <div className="text">
                <p className="main-text">Your Profile</p>
                <p className="sub-text">View and edit your profile</p>
              </div>
            </div>

            <div className='menu-list-option'
              onClick={() => history.push("/opportunities/" + authState?.user?.profile)}>
              <div className="icon">
                <IonIcon color="primary" icon={trailSign} />
              </div>
              <div className="text">
                <p className="main-text">Your Opportunities</p>
                <p className="sub-text">Manage your sponsorship opportunities </p>
              </div>
            </div>

            <div className='menu-list-option'
              onClick={() => history.push("/settings/")}>
              <div className="icon">
                <IonIcon color="primary" icon={settings} />
              </div>
              <div className="text">
                <p className="main-text">Settings</p>
                <p className="sub-text">Update account, billing &amp; notifications</p>
              </div>
            </div>

            <LogoutButton className="logout-button button-tertiary ion-margin-bottom" expand="block" size="small" />

          </div>
      :
      <div className="menu-list ion-padding-top ion-margin-top ion-margin-bottom ion-padding-bottom">
          
            <div className="menu-list-option ion-margin-top"
              onClick={() => history.push("/profiles")}>
              <div className="icon">
                <IonIcon color="primary" icon={personCircle} />
              </div>
              <div className="text">
                <p className="main-text">Search Profiles</p>
                <p className="sub-text">Search and view profiles</p>
              </div>
            </div>

            <div className='menu-list-option'
              onClick={() => history.push("/search-opportunities")}>
              <div className="icon">
                <IonIcon color="primary" icon={trailSign} />
              </div>
              <div className="text">
                <p className="main-text">Search Opportunities</p>
                <p className="sub-text">Search the latest sponsorship opportunities </p>
              </div>
            </div>

            <div className='menu-list-option'
              onClick={() => history.push("/settings/")}>
              <div className="icon">
                <IonIcon color="primary" icon={settings} />
              </div>
              <div className="text">
                <p className="main-text">Settings</p>
                <p className="sub-text">Update account, billing &amp; notifications</p>
              </div>
            </div>

            <LogoutButton className="logout-button button-tertiary ion-margin-bottom" expand="block" size="small" />

          </div>

      }

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
