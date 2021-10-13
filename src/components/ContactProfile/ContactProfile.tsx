import { IonButton, IonInput, IonLabel, IonSelect, IonSelectOption, IonTextarea } from "@ionic/react";
import React, { useState } from "react";
import useOpportunities from "../../hooks/useOpportunities";

import Select from 'react-select';

import './ContactProfile.scss';
import { phonePortraitSharp } from "ionicons/icons";

interface ContactProfileProps {
	profileId?: any;
	label?: any;
	profileData?: any;
}
 
const ContactProfile: React.FC<ContactProfileProps> = (ContactProfileProps) => {

	const { profileId, label, profileData } = ContactProfileProps;

	const {isLoading, data, error} = useOpportunities( profileId );

	const [yourName, setYourName] = useState();
	const [yourPhone, setYourPhone] = useState();
	const [yourEmail, setYourEmail] = useState();
	const [message, setMessage] = useState("");
	const [sponsorshipOpportunities, setSponsorshipOpportunities] = useState("");

	const [sendingMail, setSendingMail] = useState(false);

	const options = data.map((opportunity:any) => (
		{ 
		value: opportunity.id, 
		label: opportunity.title + " - " + (opportunity.profile.currency === "GBP" ? String.fromCharCode(163) : opportunity.profile.currency === "EUR" ? String.fromCharCode(8364) : String.fromCharCode(163))  + opportunity.price }
		
		));

		
		// console.log(yourEmail)

		const sendMessage = async () => {
			// console.log('favourite opportunity');

			setSendingMail(true);
	
			const sendMessageResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/sponsor-contact", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
					to: profileData.user.email,
					replyTo: yourEmail,
					subject: "Sponsorship Enquiry from Sponsor Connect",
					phone: yourPhone,
					email: yourEmail,
					yourName: yourName,
					text: message,
					sponsorshipOpportunities: sponsorshipOpportunities
				})
			});
			
			const sendMessageInfo = await sendMessageResp.json();

			// console.log(sendMessageInfo);

			setSendingMail(false);
	
			
			return sendMessageInfo?.statusCode ? false : sendMessageInfo;  
	
		}

	return <div className="contact-form">

		{ label && <p style={{fontWeight: 700, fontSize: "1.4em", color: "var(--ion-color-dark)"}}>{ label }</p> }

		<div className="contact-form-group">
			<IonLabel>Name*</IonLabel>
			<IonInput value={yourName} placeholder="Your Name" onIonInput={(e:any) => setYourName(e.target.value)} onIonChange={(e:any) => setYourName(e.detail.value!)}></IonInput>
		</div>

		<div className="contact-form-group">
			<IonLabel>Phone</IonLabel>
			<IonInput value={yourPhone} type="tel" placeholder="Your Phone Number" onIonInput={(e:any) => setYourPhone(e.target.value)} onIonChange={(e:any) => setYourPhone(e.detail.value!)}></IonInput>
		</div>
		<div className="contact-form-group">
			<IonLabel>Email*</IonLabel>
			<IonInput value={yourEmail} type="email" autocomplete="email" placeholder="Your Email Address" onIonInput={(e:any) => setYourEmail(e.target.value)} onIonChange={(e:any) => setYourEmail(e.target.value!)}></IonInput>
		</div>
		<div className="contact-form-group interested-in">
			<IonLabel>Sponsorship Opportunities Interested In</IonLabel>
			<Select placeholder="All Opportunities" options={options} isMulti onChange={(e:any) => setSponsorshipOpportunities(e)} />
		</div>
		<div className="contact-form-group">
			<IonLabel>Message</IonLabel>
			<IonTextarea autoGrow={true} autocapitalize="true" spellcheck={true} value={ message } onIonChange={(e:any) => setMessage(e.detail.value!)}></IonTextarea>
		</div>
		

		{ sendingMail ? <p>Sending Email</p> : <IonButton style={{marginTop: "20px", marginBottom: "30px"}} onClick={() => sendMessage()} expand="block">Send Message</IonButton> }
      
	</div>
}
 
export default ContactProfile;