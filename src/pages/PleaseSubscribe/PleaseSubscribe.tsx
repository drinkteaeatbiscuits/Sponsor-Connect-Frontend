import { IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
// import React from 'react';
import { useHistory } from 'react-router';
import React, { useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import TabBar from '../../components/TabBar';


export interface props { }

const PleaseSubscribe: React.FC = () => {

	const history = useHistory();

	const { state: authState } = React.useContext(AuthContext);

	return <IonPage>
		<TabBar activeTab="" />

		<IonContent fullscreen className="ion-padding please-subscribe">

			
			<div className="" style={{ 
				padding: '16px 24px', 
				margin: "180px auto", 
				maxWidth: '920px', 
				background: '#fff',
				borderRadius: '5px' }}>
				<h1 style={{ marginBottom: 0,  textTransform: "uppercase" }}>Please <span style={{color: 'var(--ion-color-primary'}}>subscribe</span></h1>
				<p>In order to use this part of Sponsor Connect, you must have an active subscription.</p>
				
				<IonButton onClick={() => history.push('/settings/subscription')} style={{marginTop: '80px'}} size='small' expand='block' color='primary' >Subscribe Here</IonButton>
			
			</div>
		</IonContent>
	</IonPage>

};

export default PleaseSubscribe;


