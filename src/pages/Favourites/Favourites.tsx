import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';

import { useHistory, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ErrorBoundary from '../../containers/ErrorBoundary/ErrorBoundary';

import Scrollbar from "react-scrollbars-custom";


import '../Dashboard/dashboard.scss';
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

  const shareSelectedOpportunities = () => {
    console.log('share opportunities');
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
              <ErrorBoundary>
                <SavedProfiles />
              </ErrorBoundary>
            
          </div>
        </div>

        <div className="dashboard-content-column-2">
          
          <div className="" style={{borderRadius: "5px 5px 0 0",
                                      backgroundColor: "#fff",
                                      display: 'flex', flexWrap: 'wrap'}}>
              <p className="dashboard-section-title" style={{padding: "12px 12px 0", flexGrow: 1}}>Saved Opportunities</p>

              <div className="" style={{padding: '8px 20px', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                
                
               {!selectEnabled && <p style={{cursor: 'pointer'}} onClick={() => { setSelectEnabled(true) } }>Select</p> }
               { selectEnabled && <p style={{cursor: 'pointer', fontSize: selectedOpportunities.length > 0 ? '1em' : '1em'}} onClick={() => { setSelectEnabled(false); setSelectedOpportunities([])} }>Cancel</p> }
               
               { selectEnabled && selectedOpportunities.length > 0 && <IonIcon icon={shareSocial} color="primary" onClick={() => { shareSelectedOpportunities() }} style={{fontSize: '24px', cursor: 'pointer', padding: '4px 4px 4px 4px', marginLeft: '8px'}} /> } 
               
               { selectEnabled && selectedOpportunities.length > 0 && <IonIcon icon={trashOutline} color="danger" onClick={() => { deleteSelectedOpportunities() }}  style={{fontSize: '24px', cursor: 'pointer', padding: '4px 0px 4px 8px'}} /> }
               
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
      
    </IonPage>
  );
};

export default Favourites;
