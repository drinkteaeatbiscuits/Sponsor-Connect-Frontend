import { IonButton, IonInput, IonLabel, IonSelect, IonSelectOption, IonTextarea } from "@ionic/react";
import React, { useState } from "react";
import useOpportunities from "../../hooks/useOpportunities";

import Select from 'react-select';

import './ContactProfile.scss';

interface ContactProfileProps {
	profileId?: any;
	label?: any;
}
 
const ContactProfile: React.FC<ContactProfileProps> = (ContactProfileProps) => {

	const { profileId, label} = ContactProfileProps;

	const {isLoading, data, error} = useOpportunities( profileId );

	const [yourName, setYourName] = useState();
	const [yourPhone, setYourPhone] = useState();
	const [yourEmail, setYourEmail] = useState();
	const [message, setMessage] = useState("");
	const [sponsorshipOpportunities, setSponsorshipOpportunities] = useState("");

	const options = data.map((opportunity:any) => (
		{ 
		value: opportunity.id, 
		label: opportunity.title + " - " + (opportunity.profile.currency === "GBP" ? String.fromCharCode(163) : opportunity.profile.currency === "EUR" ? String.fromCharCode(8364) : String.fromCharCode(163))  + opportunity.price }
		
		));

	return <div className="contact-form">

		{ label && <p style={{fontWeight: 700, fontSize: "1.4em", color: "var(--ion-color-dark)"}}>{ label }</p> }

		<div className="contact-form-group">
			<IonLabel>Name</IonLabel>
			<IonInput value={yourName} placeholder="Your Name" onIonChange={(e:any) => setYourName(e.detail.value!)}></IonInput>
		</div>

		<div className="contact-form-group">
			<IonLabel>Phone</IonLabel>
			<IonInput value={yourPhone} type="tel" placeholder="Your Phone Number" onIonChange={(e:any) => setYourPhone(e.detail.value!)}></IonInput>
		</div>
		<div className="contact-form-group">
			<IonLabel>Email</IonLabel>
			<IonInput value={yourEmail} type="email" placeholder="Your Email Address" onIonChange={(e:any) => setYourEmail(e.detail.value!)}></IonInput>
		</div>
		<div className="contact-form-group">
			<IonLabel>Sponsorship Opportunities Interested In</IonLabel>
			<Select options={options} isMulti onChange={(e:any) => setSponsorshipOpportunities(e)} />
		</div>
		<div className="contact-form-group">
			<IonLabel>Message</IonLabel>
			<IonTextarea value={message} onIonChange={(e:any) => setMessage(e.detail.value!)}></IonTextarea>
		</div>


		

		<IonButton expand="block">Send Message</IonButton>
      
	</div>
}
 
export default ContactProfile;