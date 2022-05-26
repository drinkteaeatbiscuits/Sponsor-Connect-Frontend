import { IonButton, IonCheckbox, IonContent, IonInput, IonPage, IonSpinner } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';

import "./MarketingPreferences.scss"
import MetaTags from '../../components/MetaTags/MetaTags';
import useEditMarketingPreferences from '../../hooks/useEditMarketingPreferences';

export interface props { }

const MarketingPreferences: React.FC = () => {

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const {isSuccess, data, mutateAsync} = useEditMarketingPreferences();

  const [marketingOptOut, setMarketingOptOut] = useState();
  const [marketingOptOutSet, setMarketingOptOutSet] = useState(false);

  useEffect(() => {

    if(!marketingOptOutSet && authState.user){
     
      setMarketingOptOut( authState.user.marketingOptOut );
      setMarketingOptOutSet(true);

    }

  }, [authState]);

  const setMarketing = (value) => {

    console.log(value);
    setMarketingOptOut(value);
   
    let marketingOptOut;
    marketingOptOut = {};
    marketingOptOut["marketingOptOut"] = value ? true : false;
    mutateAsync( marketingOptOut );

  }

  return (
    <IonPage>

      <MetaTags title={'Account | Sponsor Connect'} path={'/settings/account'} description={'Sponsor Connect account settings.'} image={ "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />

      <TabBar activeTab="settings" />

      <IonContent className="editor-content" fullscreen>
        <div className="content">
          <div className="account-settings">
            <h1 style={{ color: "var(--ion-color-dark)", lineHeight: 0.8, fontSize: "4em", padding: "15px" }}>MARKETING <br /><span style={{ color: "var(--ion-color-primary)" }}>PREFENCES</span></h1>
            <div className="editor-wrap">

              <div className=" editor-section">

                <div className="editor-section-top">
                  <div className="">
                  <label style={{display: 'block', marginBottom: '10px'}} className="editor-section-title">Marketing</label>
                  <label className=""><IonCheckbox style={{margin: '5px 7px -2px 3px'}} checked={ marketingOptOut } onIonChange={(e) => setMarketing(e.detail.checked ) } /> Opt out of marketing from Sponsor Connect</label>
                  </div>
                  
                </div>

              </div>

            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>


  );
};

export default MarketingPreferences;
