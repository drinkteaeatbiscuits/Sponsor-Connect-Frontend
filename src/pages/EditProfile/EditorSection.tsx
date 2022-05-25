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

const EditorSection: React.FC<EditorSectionProps> = (EditorSectionProps) => {


	const { title, initialEditorContent, editorContent, setEditorContent, saveContent } = EditorSectionProps;

	const [showEditor, setShowEditor] = useState(false);


	return <div className={(showEditor ? "show-editor" : "") + " editor-section ion-padding"}>

		<div className="editor-section-top" style={{padding: '0 8px'}}>

			<label className="editor-section-title">{title}</label>

			<div className="editor-section-top-buttons">

				{!showEditor ? <div className="editor-section-button" onClick={() => {setShowEditor(true); }}>{initialEditorContent ? "Edit" : "Add"}</div> :

					<div className="editor-section-button secondary" onClick={() => { setShowEditor(false); setEditorContent(initialEditorContent); }}>Cancel</div>}

				{showEditor && <div className="editor-section-button" onClick={() => {saveContent(); setShowEditor(false);}} >Save</div>}

			</div>

		</div>

		<div className={"editor-section-bottom " + (showEditor ? "show-editor" : "")}>
			<div className="editor-section-content">

				<TextEditorContent editorContent={ initialEditorContent && initialEditorContent } />

				{/* <div className="edit" onClick={() => setShowEditor(true)}>{initialEditorContent ? "Edit" : "Add"}</div> */}

			</div>

			<div className="edit-content">
				<TextEditor
					autoCapitalize="Sentences"
					placeholder="Enter your description here."
					initialText={ initialEditorContent && convertFromRaw(initialEditorContent) }
					textEditorText={ editorContent }
					setTextEditorText={ setEditorContent } />
				
			</div>
		</div>




	</div>

}

export default EditorSection;

