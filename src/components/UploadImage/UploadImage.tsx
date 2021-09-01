import React, { useCallback } from "react";
import {useDropzone} from 'react-dropzone';


interface SocialMediaTotalsProps {
	socialMediaData?: any,
	setImage: Function;
	setSrc: Function;
}

const UploadImage: React.FC<SocialMediaTotalsProps> = ( SocialMediaTotalsProps ) => {

	const onDrop = useCallback((acceptedFiles) => {

		const reader = new FileReader();
		reader.addEventListener('load', () => SocialMediaTotalsProps.setSrc(reader.result));
		
		reader.readAsDataURL(acceptedFiles[0]);

		SocialMediaTotalsProps.setImage(acceptedFiles[0]);
	  
	}, [SocialMediaTotalsProps])
 
	  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

	return <div className="upload-image">

		<div {...getRootProps()}>
		<input {...getInputProps()} />
		{
			isDragActive ?
			<p>Drop the files here ...</p> :
			<p>Drag 'n' drop some files here, or click to select files</p>
		}
		</div>
						
	</div>;

}

export default UploadImage;

