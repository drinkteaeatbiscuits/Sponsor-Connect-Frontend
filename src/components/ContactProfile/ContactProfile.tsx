import { IonButton, IonIcon, IonInput, IonLabel, IonSelect, IonSelectOption, IonSpinner, IonTextarea } from "@ionic/react";
import React, { useState } from "react";
import useOpportunities from "../../hooks/useOpportunities";

import Select from 'react-select';

import './ContactProfile.scss';
import { paperPlaneOutline, phonePortraitSharp } from "ionicons/icons";

interface ContactProfileProps {
	profileId?: any;
	label?: any;
	profileData?: any;
}
 
const ContactProfile: React.FC<ContactProfileProps> = (ContactProfileProps) => {

	const { profileId, label, profileData } = ContactProfileProps;

	const {isLoading, data, error} = useOpportunities( profileId );

	const [yourName, setYourName] = useState("");
	const [yourNameError, setYourNameError] = useState("");
	const [yourPhone, setYourPhone] = useState("");
	const [yourEmail, setYourEmail] = useState("");
	const [yourEmailError, setYourEmailError] = useState("");
	const [message, setMessage] = useState("");
	const [sponsorshipOpportunities, setSponsorshipOpportunities] = useState("");

	const [sendEmailErrors, setSendEmailErrors] = useState<string>("");
  	const [emailSuccess, setEmailSuccess] = useState<string>("");

	const [sendingMail, setSendingMail] = useState(false);

	const options = data?.map((opportunity:any) => (
		{ 
		value: opportunity.id, 
		label: opportunity.title + " - " + (opportunity.profile.currency === "GBP" ? String.fromCharCode(163) : opportunity.profile.currency === "EUR" ? String.fromCharCode(8364) : String.fromCharCode(163))  + opportunity.price }
		
		));

		
		// console.log(yourEmail)
		console.log(profileData)

		const sendMessage = async () => {
			// console.log('favourite opportunity');

			  setSendEmailErrors("");

			  if (yourName.length <= 0) {
				setYourNameError('Please enter your name.');
			  }
			  if (yourEmail.length <= 0) {
				setYourEmailError('Please enter your email address.');
			  }

			  if(yourName.length <= 0 || yourEmail.length <= 0){
				return
			  }

			setSendingMail(true);

			// html: emailTemplate(data.sportsName, data.name, data.email, data.phone, data.message, opportunitiesArray),
			const sendMessageResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/sponsor-contact", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
					to: profileData.user.email,
					replyTo: yourEmail,
					subject: "Sponsorship Enquiry from Sponsor Connect",
					phone: yourPhone,
					email: yourEmail,
					name: yourName,
					message: message,
					opportunitiesArray: sponsorshipOpportunities,
					profileId: profileData.id,
					sportsName: profileData.user.yourName
				})
			}).then((response) => {
				
				setSendingMail(false);

				if (response.ok) {
				  return response.json();
				}
				return Promise.reject(response);
			  })
				.then((result) => {
				  setSendEmailErrors("");
				  setEmailSuccess("Message sent successfully");
				  // console.log(result);
				})
				.catch((error) => {
				  setSendEmailErrors('Message unable to send. Please try again later. If problem persists, please contact support@sponsor-connect.com');
				  // console.log('Something went wrong.', error);
				});
		
	
		}

		const resetForm = () => {
			setEmailSuccess("");
			setYourName("");
			setYourPhone("");
			setYourEmail("");
			setMessage("");
			setSponsorshipOpportunities("");
		}

	return <div className="contact-form" style={{position: 'relative', padding: '8px'}}>

			{emailSuccess ? 
            
            <div className="" style={{
              textAlign: 'center',
              padding: '36px 16px 24px'

            }}>
              <IonIcon style={{fontSize: "60px"}} icon={paperPlaneOutline} color="primary" />
             <p style={{fontWeight: 600, fontSize: '2em', color: 'var(--ion-color-primary)', margin: '16px 0'}}>{ emailSuccess }</p>
             <p style={{fontSize:'0.95em', cursor: 'pointer', fontWeight: 500, color: 'var(--ion-color-tertiary-shade)'}} onClick={() => {resetForm()}}>Send another message</p>
            </div> : <div className="">

		{ label && <p style={{fontWeight: 700, fontSize: "1.4em", color: "var(--ion-color-dark)"}}>{ label }</p> }

		<div className="contact-form-group">
			<IonLabel>Name*</IonLabel>
			<IonInput value={yourName} placeholder="Your Name" onIonInput={(e:any) => {setYourName(e.target.value); setYourNameError(""); }} onIonChange={(e:any) => {setYourName(e.detail.value!); setYourNameError(""); }}></IonInput>
			{yourNameError && <div className="error-messages">
                  <p style={{ fontSize: '0.9em', fontWeight: 500, color: 'var(--ion-color-danger)', margin: '-1em 0 1em' }}>{yourNameError}</p>
                </div>}
		</div>

		<div className="contact-form-group">
			<IonLabel>Phone</IonLabel>
			<IonInput value={yourPhone} type="tel" placeholder="Your Phone Number" onIonInput={(e:any) => setYourPhone(e.target.value)} onIonChange={(e:any) => setYourPhone(e.detail.value!)}></IonInput>
		</div>
		<div className="contact-form-group">
			<IonLabel>Email*</IonLabel>
			<IonInput value={yourEmail} type="email" autocomplete="email" placeholder="Your Email Address" onIonInput={(e:any) => {setYourEmail(e.target.value); setYourEmailError("");}} onIonChange={(e:any) => {setYourEmail(e.target.value!); setYourEmailError("")}}></IonInput>
			{yourEmailError && <div className="error-messages">
                  <p style={{ fontSize: '0.9em', fontWeight: 500, color: 'var(--ion-color-danger)', margin: '-1em 0 1em' }}>{yourEmailError}</p>
                </div>}
		</div>
		<div className="contact-form-group interested-in">
			<IonLabel>Sponsorship Opportunities Interested In</IonLabel>
			<Select placeholder="All Opportunities" options={options} isMulti onChange={(e:any) => setSponsorshipOpportunities(e)} />
		</div>
		<div className="contact-form-group">
			<IonLabel>Message</IonLabel>
			<IonTextarea autoGrow={true} autocapitalize="true" spellcheck={true} value={ message } onIonChange={(e:any) => setMessage(e.detail.value!)}></IonTextarea>
		</div>
		

		{ sendingMail ? <div className="fade-in" style={{
			position: 'absolute',
			width: '100%',
			height: '100%',
			background: 'rgba(0,0,0,0.4)',
			left: 0,
			top: 0,
			zIndex: 99,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		}}><IonSpinner style={{color: '#fff'}} color="white"/></div> : <IonButton style={{marginTop: "20px", marginBottom: "30px"}} onClick={() => sendMessage()} expand="block">Send Message</IonButton> }
      
		{sendEmailErrors && <div className="error-messages">
			<p style={{ fontSize: '0.9em', fontWeight: 500, color: 'var(--ion-color-danger)', margin: '0.25em 0 1em' }}>{sendEmailErrors}</p>
		</div>}
		
		</div> 
		
		}
		
	</div>
}
 
export default ContactProfile;