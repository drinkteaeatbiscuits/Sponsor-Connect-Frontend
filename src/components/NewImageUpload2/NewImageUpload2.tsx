import { IonButton, IonButtons, IonProgressBar } from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";
import {useDropzone} from 'react-dropzone';
import ReactCrop from "react-image-crop";
import { AuthContext } from "../../App";
import useDeleteImage from "../../hooks/useDeleteImage";
import useUploadImage from "../../hooks/useUploadImage";


const NewImageUpload2: React.FC = () => {

	const [file, setFile] = useState<any>("");

	// console.log(file);

	const uploadFile = () => {

		const formData = new FormData();

		formData.append( "files", file[0], file[0].path );

		const request = new XMLHttpRequest();

		request.open('POST', (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/upload');

		request.send(formData);

	}

	return <div className="new-image-upload">
		<input type="file" name="image-1" onChange={(e) => setFile(e.target.files)} />

		<IonButton onClick={() => uploadFile()} >Upload Image</IonButton>
		
	</div>

}

export default NewImageUpload2;

