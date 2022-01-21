import { IonButton, IonContent, IonInput, IonPage } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';

import "./Account.scss"

export interface props { }

const Account: React.FC = () => {

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const [showEdit, setShowEdit] = useState(false);
  const [value, setValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [sectionData, setSectionData] = useState({});

  const fieldRef = "";

  const saveField = (sectionData) => {
    console.log(sectionData)
  }
  return (
    <IonPage>
      <Header headerTitle="Account" />
      <TabBar activeTab="settings" />

      <IonContent className="editor-content" fullscreen>
        <div className="content">
          <div className="account-settings">
            <h1 style={{ color: "var(--ion-color-dark)", lineHeight: 0.8, fontSize: "4em", padding: "15px" }}>ACCOUNT <br /><span style={{ color: "var(--ion-color-primary)" }}>SETTINGS</span></h1>
            <div className="editor-wrap">
              
            <div className=" editor-section">

<div className="editor-section-top">

  <label className="editor-section-title">Email Address</label>

  <div className="editor-section-top-buttons">

    { !showEdit ? <div className="editor-section-button" onClick={() => setShowEdit(true)}>{ value ? "Edit" : "Add"}</div> :

    <div className="editor-section-button secondary" onClick={() => {setShowEdit(false); currentValue && setValue(currentValue); }}>Cancel</div> }

    
    <div className="editor-section-button" onClick={() => saveField({ sectionData })} >Save</div>
    

  </div>	

</div>

<div className={"editor-section-bottom " + (showEdit ? "show-editor" : "") }>

  
  <IonInput autocomplete="off" 
    autocapitalize="on" 
    type="text" 
    value={ value } 
    onIonChange={ (e:any) => {
      setValue( e.detail.value ); 
      let newSectionData = {};
      newSectionData[ fieldRef ] = e.detail.value;
      setSectionData( newSectionData );  

    } } />
  




</div>

</div>


            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>


  );
};

export default Account;
