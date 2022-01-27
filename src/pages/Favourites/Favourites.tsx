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
import ProfilesContacted from '../../components/ProfilesContacted/ProfilesContacted';
import ProfileMatches from '../../components/ProfileMatches/ProfileMatches';



export interface props {}

const Favourites: React.FC = () => {

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
      <TabBar activeTab="favourites" />
      
      <IonContent fullscreen className="ion-padding dashboard">

        <div className="dashboard-content">

        <div className="dashboard-content-column-1">

			<div className="" style={{borderRadius: "5px 5px 0 0",
                                      backgroundColor: "#fff",}}>
              <p className="dashboard-section-title" style={{padding: "12px 12px 0",}}>Saved Profiles</p>
            </div>
			<div className="" style={{ 
            backgroundColor: "#fff", 
            borderRadius: "0 0  5px 5px", 
            marginBottom: "8px",
            flexGrow: 1,
            flexShrink: 1,
            overflow: "scroll"  }}>
            
          </div>
        </div>

        <div className="dashboard-content-column-2">
          
          <div className="" style={{borderRadius: "5px 5px 0 0",
                                      backgroundColor: "#fff",}}>
              <p className="dashboard-section-title" style={{padding: "12px 12px 0",}}>Saved Opportunities</p>
        	</div>

          <div className="" style={{ 
            backgroundColor: "#fff", 
            borderRadius: "0 0  5px 5px", 
            marginBottom: "8px",
            flexGrow: 1,
            flexShrink: 1,
            overflow: "scroll"  }}>
            
          </div>


        </div>

        <div className="dashboard-content-column-3">

			<div className="saved-searches" style={{borderRadius: "5px 5px 0 0",
                                      backgroundColor: "#fff",}}>
              <p className="dashboard-section-title" style={{padding: "12px 12px 0",}}>Saved Searches</p>
            </div>

          <div className="" style={{ 
            backgroundColor: "#fff", 
            borderRadius: "0 0  5px 5px", 
            flexGrow: 1,
            flexShrink: 1,
            overflow: "scroll",
			margin: "0 0 8px"  }}>
         
          </div>
            

            <div className="profiles-contacted" style={{backgroundColor: "#fff", 
            borderRadius: "5px", 
            marginBottom: "8px",}}>
              <p className="dashboard-section-title" style={{padding: "12px"}}>Profiles Contacted</p>
              <ProfilesContacted />
            </div>


           
		   </div>

        </div>

      </IonContent>
      
    </IonPage>
  );
};

export default Favourites;
