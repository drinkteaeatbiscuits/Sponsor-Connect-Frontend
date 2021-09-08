import React from "react";
import { isConstructorDeclaration } from "typescript";

interface ImageProps {
	image: Array<any>,
	alt?: string
}

const Image: React.FC<ImageProps> = ( ImageProps ) => {

	return <img src={(process.env.NODE_ENV === "development" ? 'http://localhost:1337' : '') + ImageProps.image[0]?.url} alt={ImageProps.alt} />;

}

export default Image;

