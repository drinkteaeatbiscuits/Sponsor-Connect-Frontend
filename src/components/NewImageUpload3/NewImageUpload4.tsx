import { IonButton, IonButtons, IonProgressBar } from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";
import {useDropzone} from 'react-dropzone';
import ReactCrop from "react-image-crop";
import { AuthContext } from "../../App";
import useDeleteImage from "../../hooks/useDeleteImage";
import useUploadImage from "../../hooks/useUploadImage";

// Import the editor styles
import 'pintura/pintura.css';

import {
    // editor
    openDefaultEditor,

	// The method used to register the plugins
    setPlugins,

    // The plugins we want to use
    plugin_crop,
    plugin_finetune,
    plugin_filter,
	plugin_filter_defaults,
	plugin_finetune_defaults,

    // Our factory method
    openEditor,
	locale_en_gb, 
	plugin_crop_locale_en_gb,
	plugin_finetune_locale_en_gb,
	plugin_filter_locale_en_gb,

	createDefaultImageReader,
	createDefaultImageWriter

} from 'pintura';


// Merge the locale objects
const myLocale = {
    ...locale_en_gb,
    ...plugin_crop_locale_en_gb,
	...plugin_filter_locale_en_gb,
	...plugin_finetune_locale_en_gb
};

setPlugins(plugin_crop, plugin_finetune, plugin_filter);


const NewImageUpload3: React.FC = () => {

	// This function is called when the user taps the edit button, it opens the editor and returns the modified file when done
const editImage = (image:any, done:any) => {
    const imageFile = image.pintura ? image.pintura.file : image;
    const imageState = image.pintura ? image.pintura.data : {};

    const editor = openEditor({
        src: imageFile,
        imageState,
		imageCropAspectRatio: 16 / 9,
		locale: myLocale,
		imageReader: createDefaultImageReader(),
		...plugin_filter_defaults,
		...plugin_finetune_defaults,
		imageWriter: createDefaultImageWriter(),
    }); 

    editor.on('close', () => {
        // nothing
    });

    editor.on('process', ({ dest, imageState }) => {
        Object.assign(dest, {
            pintura: { file: imageFile, data: imageState },
        });
        done(dest);
    });
};

const [files, setFiles] = useState([]);

const onDrop = useCallback((acceptedFiles) => {

	setFiles(
		acceptedFiles.map((file:any) =>
			Object.assign(file, {
				preview: URL.createObjectURL(file),
			})
		)
	);

}, []);

const {getRootProps, getInputProps, isDragActive} = useDropzone({accept: 'image/*', onDrop});

const thumbs = files.map((file: any, index: any) => (
	<div key={file.name}>
		<div>
			<img src={file.preview} alt="" />
		</div>
		<button
			
			onClick={() =>
				editImage(file, (output:any) => {
					const updatedFiles = [...files] as any;

					// replace original image with new image
					updatedFiles[index] = output;

					// revoke preview URL for old image
					if (file.preview) URL.revokeObjectURL(file.preview);

					// set new preview URL
					Object.assign(output, {
						preview: URL.createObjectURL(output),
					});

					// update view
					setFiles( updatedFiles );
				})
			}
		>
			Edit
		</button>
	</div>
));

useEffect(
	() => () => {
		// Make sure to revoke the data uris to avoid memory leaks
		files.forEach((file:any) => URL.revokeObjectURL(file.preview));
	},
	[files]
);



	const [file, setFile] = useState<any>("");
	const [total, setTotal] = useState<any>("");
	const [loaded, setLoaded] = useState<any>("");

	const handleEvent = (e:any) => {
		console.log(e);
		console.log(e.loaded);
		console.log(e.total);
		
		setLoaded(e.loaded);
		setTotal(e.total);
	}

	
	

	return <div className="new-image-upload">

		<section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>{thumbs}</aside>
        </section>

		
	</div>

}

export default NewImageUpload3;

