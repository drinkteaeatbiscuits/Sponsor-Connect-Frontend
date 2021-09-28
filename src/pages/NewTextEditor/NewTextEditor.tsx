import { IonButton, IonContent, IonPage } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import TextEditor from '../../components/TextEditor/TextEditor';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { stateToHTML } from "draft-js-export-html";

export interface props {}

const NewTextEditor: React.FC = () => {

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const [textEditorText, setTextEditorText] = useState();

  

// const contentState = convertFromRaw( JSON.parse( textEditorText ) );

  //textEditorText && console.log( stateToHTML(textEditorText) );


// const EditorState = textEditorText;

  return (
    <IonPage>
      <Header headerTitle="Notifications"/>
      <TabBar activeTab="settings"/>
      <IonContent fullscreen>

		<TextEditor placeholder="This is some text" textEditorText={textEditorText} setTextEditorText={setTextEditorText} />

	{textEditorText && stateToHTML(textEditorText)}
		
      </IonContent>
    </IonPage>
  );
};

export default NewTextEditor;

