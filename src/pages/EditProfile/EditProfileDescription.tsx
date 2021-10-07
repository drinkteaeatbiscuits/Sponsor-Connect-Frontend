import { IonButton, IonContent, IonPage } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import TextEditor from '../../components/TextEditor/TextEditor';
import useMyProfile from '../../hooks/useMyProfile';
import { convertFromRaw, convertToRaw } from 'draft-js';
import useUpdateProfile from '../../hooks/useUpdateProfile';
import useUpdateProfileDescriptions from '../../hooks/useUpdateProfileDescriptions';

import './EditProfileDescription.scss';
import TextEditorContent from '../../components/TextEditorContent/TextEditorContent';
import EditorSection from './EditorSection';

export interface props {}

const EditProfileDescription: React.FC = () => {

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const profileData = useMyProfile();
  const {isLoading, error, mutateAsync: addProfileDescriptionMutation} = useUpdateProfileDescriptions();

  const [informationAboutYou, setInformationAboutYou] : any = useState();
  const [competitionInformation, setCompetitionInformation] : any = useState();
  const [supportersInformation, setSupportersInformation] : any = useState();
  const [anyOtherInfo, setAnyOtherInfo] : any = useState();

  const [showInformationAboutYouEditor, setShowInformationAboutYouEditor] = useState(false);
  const [showCompetitionInformationEditor, setShowCompetitionInformationEditor] = useState(false);
  const [showSupportersInformationEditor, setShowSupportersInformationEditor] = useState(false);
  const [showAnyOtherInfoEditor, setShowAnyOtherInfoEditor] = useState(false);

  useEffect(() => {

    if (profileData.status === "success") {

      setInformationAboutYou(profileData.data[0]?.informationAboutYou && convertFromRaw( profileData.data[0]?.informationAboutYou ));

      setCompetitionInformation(profileData.data[0]?.competitionInformation && convertFromRaw( profileData.data[0]?.competitionInformation ));

      setSupportersInformation(profileData.data[0]?.supportersInformation && convertFromRaw( profileData.data[0]?.supportersInformation ));

      setAnyOtherInfo(profileData.data[0]?.anyOtherInfo && convertFromRaw( profileData.data[0]?.anyOtherInfo ));

    }

  }, [profileData.status, profileData.data]);

  const updateProfile = async () => {
    
    await addProfileDescriptionMutation({
      informationAboutYou: informationAboutYou && convertToRaw( informationAboutYou ),
      competitionInformation: competitionInformation && convertToRaw( competitionInformation ),
      supportersInformation: supportersInformation && convertToRaw( supportersInformation ),
      anyOtherInfo: anyOtherInfo && convertToRaw( anyOtherInfo ),

    });

    profileData.refetch();
    
    // history.goBack();
  }



  return (

    <IonPage>
      <TabBar activeTab="profile"/>
      <IonContent fullscreen>

          <div className="content edit-profile-description-content">

            <h1 className="text-uppercase">Edit Profile Description</h1>

    

            { profileData.status === "success" && <EditorSection title="Information About You" initialEditorContent={ profileData?.data[0]?.informationAboutYou } editorContent={ informationAboutYou } setEditorContent={ setInformationAboutYou } saveContent={() => updateProfile()} /> }
            
            { profileData.status === "success" && <EditorSection title="Competition Information" initialEditorContent={ profileData?.data[0]?.competitionInformation } editorContent={ competitionInformation } setEditorContent={ setCompetitionInformation } saveContent={() => updateProfile()} /> }
            
            { profileData.status === "success" && <EditorSection title="Supporters Information" initialEditorContent={ profileData?.data[0]?.supportersInformation } editorContent={ supportersInformation } setEditorContent={ setSupportersInformation } saveContent={() => updateProfile()} /> }
            
            { profileData.status === "success" && <EditorSection title="Any Other Information" initialEditorContent={ profileData?.data[0]?.anyOtherInfo } editorContent={ anyOtherInfo } setEditorContent={ setAnyOtherInfo } saveContent={() => updateProfile()} /> }

            
           <IonButton className="button-tertiary" size="small" onClick={ () => history.push('/profile/' + profileData.data[0]?.id ) } >Back to profile</IonButton>


          </div>

      </IonContent>
    </IonPage>
  );
};

export default EditProfileDescription;
