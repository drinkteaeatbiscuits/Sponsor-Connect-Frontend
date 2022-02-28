import { IonInput, IonLabel, IonTextarea } from "@ionic/react";
import { convertFromRaw, convertToRaw } from "draft-js";
import React, { useEffect, useState } from "react";
import { AuthContext } from "../../App";
import useEditOpportunity from "../../hooks/useEditOpportunity";
import useEditOpportunityField from "../../hooks/useEditOpportunityField";
import useEditProfileField from "../../hooks/useEditProfileField";
import TextEditor from "../TextEditor/TextEditor";
import TextEditorContent from "../TextEditorContent/TextEditorContent";

interface EditorSectionProps {
	label?: string;
	currentValue?: any;
	fieldType?: any;
	className?: string;
	profileId?: any;
	fieldRef?: any;
	autocapitalize?: string;
}
 
const EditorSectionProfile: React.FC<EditorSectionProps> = (EditorSectionProps) => {

	const { label, currentValue, fieldType, className, profileId, fieldRef, autocapitalize } = EditorSectionProps;
	const { state: authState } = React.useContext(AuthContext);
	const [ showEdit, setShowEdit ] = useState(false);
	const [ value, setValue ] = useState(currentValue);
	const [ sectionData, setSectionData ] = useState<object>([]);
	const [ editorContent, setEditorContent ] = useState(null);
	const {isLoading: isEditingOpportunity, error: editOpportunityError, isSuccess, mutateAsync: editProfileMutation} = useEditProfileField( profileId );

	useEffect(() => {
		
		// setValue(currentValue);
		let newSectionData = {};
		currentValue && ( newSectionData[ fieldRef ] = currentValue );
		currentValue && setSectionData(newSectionData);
		currentValue && setEditorContent(currentValue);
		isSuccess && setShowEdit(false);

	}, [ currentValue, isSuccess ]);


	const saveField = async ( sectionData ) => {
		
		console.log('save field', sectionData);

		await editProfileMutation( sectionData.sectionData );
	}

	const saveEditor = async ( editorContent ) => {

		let newEditorContent;
		newEditorContent = {};
		newEditorContent[fieldRef] = editorContent.editorContent && convertToRaw(editorContent.editorContent);

		await editProfileMutation( newEditorContent );

	}

	console.log(sectionData);

	return <div className={( className ? className : "" ) + " editor-section"}>

			<div className="editor-section-top">

				<label className="editor-section-title">{ label }</label>
			
				<div className="editor-section-top-buttons">

					{ !showEdit ? <div className="editor-section-button" onClick={() => setShowEdit(true)}>{ value ? "Edit" : "Add"}</div> :

					<div className="editor-section-button secondary" onClick={() => {setShowEdit(false); currentValue && setValue(currentValue); }}>Cancel</div> }

					
					{ showEdit && fieldType !== 'TextEditor' && <div className="editor-section-button" onClick={() => {console.log(sectionData); saveField({ sectionData })}} >Save</div> }
					
					{ showEdit && fieldType === 'TextEditor' && <div className="editor-section-button" onClick={() => saveEditor({ editorContent })} >Save</div> }

				</div>	

			</div>

			<div className={"editor-section-bottom " + (showEdit ? "show-editor" : "") }>

				{ label === "Price" && <div className="currency-display">{authState && authState.user.currency === "GBP" ? String.fromCharCode(163) : authState.user.currency === "EUR" ? String.fromCharCode(8364) : String.fromCharCode(163) }</div> }
		
				{ fieldType !== 'TextEditor' && !showEdit ? value && value : 
				 fieldType !== 'TextEditor' && fieldType !== 'IonTextarea' ? <IonInput autocomplete="off" 
					autocapitalize={autocapitalize} 
					type={fieldType ? fieldType : "text"} 
					value={ value } 
					onIonChange={ (e:any) => {
						setValue( e.detail.value ); 
						let newSectionData = {};
						newSectionData[ fieldRef ] = e.detail.value;
						setSectionData( newSectionData );  

					} } /> : fieldType === 'IonTextarea' && 
					<IonTextarea value={ value } autocapitalize={autocapitalize} onIonChange={ (e:any) => {

						console.log(e.detail.value);

						setValue( e.detail.value ); 
						let newSectionData = {};
						newSectionData[ fieldRef ] = e.detail.value;
						setSectionData( newSectionData );
						 

					}} />
            
					  }


				{ fieldType === 'TextEditor' && !showEdit && <TextEditorContent editorContent={ currentValue && convertToRaw(currentValue) } /> }


				{ fieldType === 'TextEditor' && <TextEditor 
					  autoCapitalize={autocapitalize}
                      placeholder="Enter your description here." 
                      initialText={ currentValue } 
                      textEditorText={ editorContent } 
                      setTextEditorText={ setEditorContent } />	  
				}

			</div>

	</div>

}
 
export default EditorSectionProfile;