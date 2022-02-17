import { IonButton, IonContent, IonIcon, IonInput, IonPage, IonTextarea } from '@ionic/react';

import { useHistory, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ErrorBoundary from '../../containers/ErrorBoundary/ErrorBoundary';

import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';

import Scrollbar from "react-scrollbars-custom";


import '../Dashboard/dashboard.scss';
import './Favourites.scss';
import { NewsFeed } from '../../components/NewsFeed/NewsFeed';
import Sidebar from '../Profiles/Sidebar/Sidebar';
import useProfiles from '../../hooks/useProflies';
import ProfilesContacted from '../../components/ProfilesContacted/ProfilesContacted';
import ProfileMatches from '../../components/ProfileMatches/ProfileMatches';
import SavedProfiles from '../../components/SavedProfiles/SavedProfiles';
import SavedOpportunities from '../../components/SavedOpportunities/SavedOpportunities';
import SavedSearches from '../../components/SavedSearches/SavedSearches';
import { shareSocial, trashOutline } from 'ionicons/icons';



export interface props {}


const Favourites: React.FC = () => {

  const history = useHistory();
  const { state: authState, dispatch } = React.useContext(AuthContext);
  const [copied, setCopied] = useState(false);

  const [selectEnabled, setSelectEnabled] = useState(false);
  const [selectedOpportunities, setSelectedOpportunities] = useState<Array<number>>([]);
  
  const [shareOpportunitiesModalOpen, setShareOpportunitiesModalOpen ] = useState(false);

  const [shareOpportunitiesErrors, setShareOpportunitiesErrors] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [text, setText] = useState<string>();

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

  const openShareOpportunitiesModal = () => {

    setShareOpportunitiesModalOpen(true);
    
  }

  const sendSharedOpportunities = async () => {
    if(emails.length <= 0){
      setShareOpportunitiesErrors('Please enter an email address.');
      return
    }

    const sendSharedOpportunitiesResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/share-opportunities", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({
				to: emails.join(", "),
        replyTo: authState?.user?.email,
        subject: 'Sponsor Connect Opportunities from ' + authState?.user?.yourName,
        text: text,
        name: authState?.user?.yourName
			})
		});
		
		const sendSharedOpportunitiesInfo = await sendSharedOpportunitiesResp.json();

    return sendSharedOpportunitiesInfo;
    // to, replyTo, subject, text
  }

  
  const deleteSelectedOpportunities = async () => {

		const favouriteOpportunityResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/favourite-opportunity", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({
				opportunityId: selectedOpportunities
			})
		});
		
		const favouriteOpportunityInfo = await favouriteOpportunityResp.json();

		// favouriteOpportunityInfo?.favouriteOpportunities?.length > 0 && favouriteOpportunityInfo.favouriteOpportunities.includes(opportunityData?.id) ? setIsFavourite(true) : setIsFavourite(false);

		dispatch && dispatch({
			type: "setFavouriteOpportunities",
			payload: favouriteOpportunityInfo
		  });

      setSelectEnabled(false);
      setSelectedOpportunities([]);
		  
		return favouriteOpportunityInfo?.statusCode ? false : favouriteOpportunityInfo;  


	}


  return (
    <IonPage> 
      <TabBar activeTab="favourites" />
      
      <IonContent fullscreen className="ion-padding dashboard favourites">

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
              <ErrorBoundary>
                <SavedProfiles />
              </ErrorBoundary>
            
          </div>
        </div>

        <div className="dashboard-content-column-2">
          
          <div className="" style={{borderRadius: "5px 5px 0 0",
                                      backgroundColor: "#fff",
                                      display: 'flex', }}>
              <p className="dashboard-section-title" style={{padding: "12px 0px 8px 12px", flexGrow: 1, lineHeight: '1.2', wordBreak: 'break-word'}}>Saved Opportunities</p>

              <div className="" style={{padding: '8px 12px 8px 0', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap'}}>
                
                
               {!selectEnabled && <p style={{cursor: 'pointer', margin: 0, padding: '8px',}} onClick={() => { setSelectEnabled(true) } }>Select</p> }
               { selectEnabled && <p style={{cursor: 'pointer', fontSize: '1em', padding: '8px', margin: 0}} onClick={() => { setSelectEnabled(false); setSelectedOpportunities([])} }>Cancel</p> }
               <div className="">
               { selectEnabled && selectedOpportunities.length > 0 && <IonIcon icon={shareSocial} color="primary" onClick={() => { openShareOpportunitiesModal() }} style={{fontSize: '24px', cursor: 'pointer', padding: '8px 4px 4px 4px', marginLeft: '4px'}} /> } 
               
               { selectEnabled && selectedOpportunities.length > 0 && <IonIcon icon={trashOutline} color="danger" onClick={() => { deleteSelectedOpportunities() }}  style={{fontSize: '24px', cursor: 'pointer', padding: '8px 0px 4px 8px'}} /> }
               
               </div>
               
              </div>
              

        	</div>

          <div className="" style={{ 
            backgroundColor: "#fff", 
            borderRadius: "0 0  5px 5px", 
            marginBottom: "8px",
            flexGrow: 1,
            flexShrink: 1,
            overflow: "scroll"  }}>
              <ErrorBoundary>
                <SavedOpportunities 
                selectEnabled={selectEnabled} 
                selectedOpportunities={selectedOpportunities} 
                setSelectedOpportunities={setSelectedOpportunities} />
              </ErrorBoundary>
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
        <ErrorBoundary>
          <SavedSearches />
          </ErrorBoundary>
         
          </div>
            

            <div className="profiles-contacted" style={{backgroundColor: "#fff", 
            borderRadius: "5px", 
            marginBottom: "8px",}}>
              <p className="dashboard-section-title" style={{padding: "12px"}}>Profiles Contacted</p>
              <ErrorBoundary>
                <ProfilesContacted />
                </ErrorBoundary>
            </div>


           
		   </div>

        </div>

      </IonContent>

     { shareOpportunitiesModalOpen && 
        <div className="share-opportunities-modal fade-in" 
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 0 20px'
          
        }}
        onClick={() => setShareOpportunitiesModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation() } className="share-opportunities fade-in"
          style={{
            background: '#fff',
            width: '100%',
            maxWidth: '600px',
            height: 'auto',
            padding: '16px',
            color: 'var(--ion-color-dark)',
            borderRadius: '5px'
          }}>
            <p style={{fontWeight: 600, fontSize: '2em', margin: '0.25em 0 1em'}}>Share Selected Opportunities</p>
            <p>This will send an email with the selected opportunities.</p>
            
            <label style={{fontSize: '0.9em', margin: '0 0 5px', display: 'block'}}>Email Address(es)</label>
            <ReactMultiEmail
              placeholder="Please enter the email address(es) you wish to send to"
              emails={emails}
              onChange={(_emails: string[]) => {
                setShareOpportunitiesErrors("");
                setEmails( _emails );
              }}
              validateEmail={email => {
                return isEmail(email); // return boolean
              }}
              getLabel={(
                email: string,
                index: number,
                removeEmail: (index: number) => void,
              ) => {
                return (
                  <div data-tag key={index}>
                    {email}
                    <span data-tag-handle onClick={() => removeEmail(index)}>
                      ×
                    </span>
                  </div>
                );
              }}
            />
            {shareOpportunitiesErrors && <div className="error-messages">
              <p style={{fontSize: '0.9em', fontWeight: 500, color: 'var(--ion-color-danger)', margin: '0.25em 0 1em'}}>{shareOpportunitiesErrors}</p>
            </div>}

            <IonTextarea autocapitalize="on" style={{border: '1px solid rgba(34, 36, 38, 0.15)', borderRadius: '3px' }} className="share-note" placeholder="Enter more information here..."  value={text} onIonChange={e => setText(e.detail.value!)} />

           

            <div className="buttons" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '16px 0 0'}}>
              <div className=""style={{padding: '16px', cursor: 'pointer'}} onClick={() => setShareOpportunitiesModalOpen(false)}>
                <span style={{padding: '3px 0 0', color: 'var(--ion-color-tertiary)'}}>Cancel</span>
              </div>
              
              <IonButton style={{margin: '0'}} size="small" color="primary" onClick={() => sendSharedOpportunities() }>Share Opportunities</IonButton>
            </div>
            
          </div>
      </div> }
      
    </IonPage>
  );
};

export default Favourites;
