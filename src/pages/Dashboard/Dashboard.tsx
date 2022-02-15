import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Scrollbar from "react-scrollbars-custom";


import './dashboard.scss';
import { personCircle, trailSign, settings, linkOutline, link, chatbubbles, home } from 'ionicons/icons';
import Notifications from '../../components/Notifications/Notifications';
import useProfile from '../../hooks/useProfile';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import OpportunitiesList from '../../components/OpportunitiesList/OpportunitiesList';
import useNewsFeed from '../../hooks/useNewsFeed';
import { NewsFeed } from '../../components/NewsFeed/NewsFeed';


export interface props {}

const Dashboard: React.FC = () => {

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

  const {isLoading: isLoadingProfile, data: dataProfile, error: errorProfile, isSuccess: isSuccessProfile} = useProfile( profileId );
  // console.log(authState.user.profile); 
  // console.log(dataProfile); 

  // { !authState.user && history.push('/'); }
  // console.log(dataNews);

  const linkCopied = () => {

    
    setTimeout(function() {
			setCopied(true);
		  }, 200);

		setTimeout(function() {
			setCopied(false);
		  }, 1500);

  }
  

  return (
    <IonPage> 
      <TabBar activeTab="dashboard" />
      
      <IonContent fullscreen className="ion-padding dashboard">

        <div className="dashboard-content">

          <div className="dashboard-content-column-1">

          <div className="hello-user mobile">
              <div className="avatar">
                <div className="avatar-image">
                  
                { dataProfile?.profilePicture ? 
                  
                    <picture>
                        <source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  dataProfile?.profilePicture?.hash + ".webp" } />
                        <source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  dataProfile?.profilePicture?.hash + dataProfile?.profilePicture?.ext } />
                        <img className="profile-picture" alt={ "Profile Image " + dataProfile?.profilePicture.id } src={ process.env.REACT_APP_S3_URL + "/images/profile/" +  dataProfile?.profilePicture?.hash + dataProfile?.profilePicture?.ext } /> 
                    </picture>
                  
                  : <IonIcon color="medium" icon={personCircle} /> }
                  
                </div>
              </div>

              <div className="hello-message">
                <p className="hello ion-no-margin"><strong>Hello{authState.user?.yourName && (" " + authState.user?.yourName?.split(" ")[0])},</strong></p>
                <p className="greeting ion-no-margin">{greeting()}</p>
              </div>

            </div>


            { isSuccessProfile && <ProfileCard profileData={dataProfile} className="narrow" /> }

            <div className="dashboard-actions">
              <div className="menu-list ion-padding-top ion-margin-top ion-margin-bottom ion-padding-bottom">
                
                <div className="menu-list-option"
                  onClick={() => history.push("/profile/" + authState?.user?.profile + "/edit")}>
                  <div className="icon">
                    <IonIcon color="primary" icon={personCircle} />
                  </div>
                  <div className="text">
                    <p className="main-text">Edit Profile</p>
                    <p className="sub-text">Update your profile</p>
                  </div>
                </div>

                <CopyToClipboard text={"app.sponsor-connect.com/profile/" + authState?.user?.profile}
                  onCopy={() => { linkCopied()}}>
                  <div className='menu-list-option'>
                    <div className="icon">
                      <IonIcon color="primary" icon={link} />
                    </div>
                    <div className="text">
                      <p className={copied ? "main-text fade-in" : "main-text"}>{ copied ? <span style={{color: "var(--ion-color-primary)"}}>Link Copied</span> : "Your Unique Link" }</p>
                      <p className="sub-text">{ "app.sponsor-connect.com/profile/" + authState?.user?.profile }</p>
                    </div>
                  </div>
                </CopyToClipboard>

                

                <div className='menu-list-option'
                  onClick={() => history.push("/book-consultation/")}>
                  <div className="icon">
                    <IonIcon color="primary" icon={chatbubbles} />
                  </div>
                  <div className="text">
                    <p className="main-text">Book Consultation</p>
                    <p className="sub-text">Get advice about sponsorship</p>
                  </div>
                </div>
                
                <a href="https://sponsor-connect.com">
                  <div className='menu-list-option'>
                    <div className="icon">
                      <IonIcon color="primary" icon={home} />
                    </div>
                    <div className="text">
                      <p className="main-text">Home</p>
                      <p className="sub-text">Go to our homepage</p>
                    </div>
                  </div>
                </a>

                {/* <LogoutButton className="logout-button button-tertiary ion-margin-bottom" expand="block" size="small" /> */}

              </div>
            </div>
 
          </div>
          <div className="dashboard-content-column-2">

            <div className="hello-user">
              <div className="avatar">
                <div className="avatar-image">
                  
                { dataProfile?.profilePicture ? 
                  
                    <picture>
                        <source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  dataProfile?.profilePicture?.hash + ".webp" } />
                        <source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  dataProfile?.profilePicture?.hash + dataProfile?.profilePicture?.ext } />
                        <img className="profile-picture" alt={ "Profile Image " + dataProfile?.profilePicture.id } src={ process.env.REACT_APP_S3_URL + "/images/profile/" +  dataProfile?.profilePicture?.hash + dataProfile?.profilePicture?.ext } /> 
                    </picture>
                  
                  : <IonIcon color="medium" icon={personCircle} /> }
                  
                </div>
              </div>

              <div className="hello-message">
                <p className="hello ion-no-margin"><strong>Hello{authState.user?.yourName && (" " + authState.user?.yourName?.split(" ")[0])},</strong></p>
                <p className="greeting ion-no-margin">{greeting()}</p>
              </div>

            </div>

            <div className="" style={{order: 2, borderRadius: "5px 5px 0 0",
                                      backgroundColor: "#fff", margin: "12px 0 0", padding: "12px"}}>
            <p className="dashboard-section-title">Your Opportunities</p>

            <div className="opportunity-counts">
              <div className="active">
                <h2>10</h2>
                <p>Active</p>
              </div>
              <div className="drafts">
                <h2>03</h2>
                <p>Drafts</p>
              </div>
              <div className="expired">
                <h2>05</h2>
                <p>Expired</p>
              </div>
              <div className="successful">
                <h2>01</h2>
                <p>Successful</p>
              </div>
            </div>
            </div>
            <div className="user-opportunities">

              <OpportunitiesList profileId={ profileId } />
            
            </div>
            

          </div>

          <div className="dashboard-content-column-3">
                  
            <div className="dashboard-notifications">
              <p className="dashboard-section-title">Notifications</p>
              
              <div className="dashboard-notification">
                  <div className="icon">
                    <IonIcon color="primary" icon={chatbubbles} />
                  </div>
                  <div className="text">
                    <p className="main-text">Start finding sponsors today</p>
                    <p className="sub-text">Your subscription is currently inactive. In order to start finding potential sponsors, please click here to start your subscription.</p>
                  </div>
                </div>

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

                {/* <div className="" style={{
                  height: "100%", 
                  flexGrow: 1, 
                  display: "flex", 
                  flexDirection: "column", 
                  backgroundColor: "#fff", 
                  borderRadius: "5px"
                  }}>
                  
                 
                    <div style={{flexShrink: 1, overflow: "scroll"}}>
                      
                    </div>
                    
                 
                 
                  
                </div> */}
            


          </div>
        
        </div>

      </IonContent>
      
    </IonPage>
  );
};

export default Dashboard;
