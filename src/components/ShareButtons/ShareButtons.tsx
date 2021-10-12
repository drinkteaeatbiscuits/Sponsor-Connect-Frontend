import React from "react";

import {FacebookShareButton, FacebookIcon, 
	FacebookMessengerShareButton, FacebookMessengerIcon, 
	EmailShareButton, EmailIcon, 
	TwitterShareButton, TwitterIcon, 
	WhatsappShareButton, WhatsappIcon, 
	LinkedinShareButton, LinkedinIcon} from "react-share";

import './ShareButtons.scss';

interface ShareButtonsProps {
	url?: any;
}
 
const ShareButtons: React.FC<ShareButtonsProps> = (ShareButtonsProps) => {

	const { url } = ShareButtonsProps;

	return <div className="share-buttons" style={{display: "flex", justifyContent: "flex-end"}}>

		<FacebookShareButton 
			url={ url }
			quote={"CampersTribe - World is yours to explore"}
			hashtag="#camperstribe"
			className="">
			<FacebookIcon size={36} round={true} />
		</FacebookShareButton>

		<FacebookMessengerShareButton 
			url={ url }
			className="" appId={""}>
				<FacebookMessengerIcon size={36} round={true} />
			</FacebookMessengerShareButton>
			
		<WhatsappShareButton url={ url } >
			<WhatsappIcon size={36} round={true} /> 
		</WhatsappShareButton>

		<TwitterShareButton url={ url }>
			<TwitterIcon size={36} round={true} />
		</TwitterShareButton>

		<LinkedinShareButton url={ url } >
			<LinkedinIcon size={36} round={true} /> 
		</LinkedinShareButton>

		<EmailShareButton url={ url }>
			<EmailIcon size={36} round={true} />
		</EmailShareButton>

	</div>

}
 
export default ShareButtons;