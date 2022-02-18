import { convertFromRaw } from "draft-js";
import React, { useEffect, useState } from "react";
import TextEditor from "../../components/TextEditor/TextEditor";
import TextEditorContent from "../../components/TextEditorContent/TextEditorContent";

interface EditorSectionProps {
	title?: any,
	initialEditorContent?: any,
	editorContent?: any,
	setEditorContent?: any,
	saveContent?: any,
}

const EditorSection: React.FC<EditorSectionProps> = ( EditorSectionProps ) => {


	const { title, initialEditorContent, editorContent, setEditorContent, saveContent } = EditorSectionProps;

	const [showEditor, setShowEditor ] = useState(false);
	

	return <div className={ ( showEditor ? "show-editor" : "" ) + " editor-section ion-padding"}>

				{title && <p className="font-weight-700 editor-section-title">{ title }</p> }
				
				<div className="editor-section-content">

					<TextEditorContent editorContent={ initialEditorContent && initialEditorContent } />
				
					<div className="edit" onClick={() => setShowEditor(true)}>{initialEditorContent ? "Edit" : "Add" }</div>

				</div>

				<div className="edit-content">
					<TextEditor 
						autoCapitalize="Sentences"
						placeholder="Enter your description here." 
						initialText={ initialEditorContent && convertFromRaw( initialEditorContent )} 
						textEditorText={ editorContent } 
						setTextEditorText={ setEditorContent } />
					<div className="editor-options">
						<div className="cancel" onClick={() => { setShowEditor(false); setEditorContent(initialEditorContent);  }}>Cancel</div>
						<div className="save" onClick={ () => { saveContent(); setShowEditor(false);} }>Save</div> 
					</div>     
				</div>  
	
			</div>

}

export default EditorSection;

