import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';

import { useHistory, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Scrollbar from "react-scrollbars-custom";


import '../Dashboard/dashboard.scss';
import { NewsFeed } from '../../components/NewsFeed/NewsFeed';
import Sidebar from '../Profiles/Sidebar/Sidebar';
import useProfiles from '../../hooks/useProflies';



export interface props {}

const DashboardBusiness: React.FC = () => {

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  const [copied, setCopied] = useState(false);

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

  const profileId = authState.user.profile;

  const {isLoading, data, isSuccess, error} = useProfiles();

  // const {isLoading: isLoadingProfile, data: dataProfile, error: errorProfile, isSuccess: isSuccessProfile} = useProfile( profileId );
  // console.log(authState.user.profile); 
  // console.log(dataProfile); 

  // { !authState.user && history.push('/'); }
  // console.log(dataNews);

  return (
    <IonPage> 
      <TabBar activeTab="dashboard" />
      
      <IonContent fullscreen className="ion-padding dashboard">

        <div className="dashboard-content">

        <div className="dashboard-content-column-1">

          <Sidebar className="dashboard-search" isDashboard allProfileData={data} />

        </div>
        <div className="dashboard-content-column-2">
          <div className="profile-matches" style={{ 
            backgroundColor: "#fff", 
            borderRadius: "5px", 
            marginBottom: "8px",
            flexGrow: 1 }}>
            <p className="dashboard-section-title" style={{padding: "12px"}}>Latest Profile Matches</p>
          </div>
          <div className="profile-matches" style={{ 
            backgroundColor: "#fff", 
            borderRadius: "5px",
            flexGrow: 1 }}>
            <p className="dashboard-section-title" style={{padding: "12px"}}>Profile Matches</p>
          </div>
        </div>
        <div className="dashboard-content-column-3">
            <div className="profiles-contacted" style={{backgroundColor: "#fff", 
            borderRadius: "5px", 
            marginBottom: "8px",}}>
              <p className="dashboard-section-title" style={{padding: "12px"}}>Profiles Contacted</p>
            </div>
            <div className="" style={{borderRadius: "5px 5px 0 0",
                                      backgroundColor: "#fff",}}>
              <p className="dashboard-section-title" style={{padding: "12px",}}>Latest News</p>
            </div>
            <div className="" style={{ 
                  flexGrow: 1,  
                  backgroundColor: "#fff", 
                  borderRadius: "0 0 5px 5px",
                  overflow: "scroll"
                  }}>
                    <NewsFeed articleCount={6} style={{}} />

                  </div>
        </div>

        </div>

      </IonContent>
      
    </IonPage>
  );
};

export default DashboardBusiness;