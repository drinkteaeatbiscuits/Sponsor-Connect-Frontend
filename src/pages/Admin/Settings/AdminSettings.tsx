import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';

import { useHistory } from 'react-router';
import { AuthContext } from "../../../App";
import React, { useEffect, useState } from 'react';
import TabBar from '../../../components/TabBar';


import './AdminSettings.scss';

import MetaTags from '../../../components/MetaTags/MetaTags';
import ExampleProfiles from './components/ExampleProfiles';
import TestProfiles from './components/TestProfiles';



export interface props { }

const AdminSettings: React.FC = () => {

	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);
	// const { isLoading, data: profiles, isSuccess, error } = useProfiles(true);

	useEffect(() => {

	}, [])


	return (
		<IonPage>

			<MetaTags title={'Admin Dashboard | Sponsor Connect'} path={'/dashboard'} description={'Sponsor Connect admin dashboard.'} image={"https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg"} />

			<TabBar activeTab="settings" />
			<IonContent className="editor-content" fullscreen>
				<div className="content">
					<div className="edit-profile">
						<h1 style={{ color: "var(--ion-color-dark)", lineHeight: 0.8, fontSize: "4em", padding: "15px" }}>ADMIN <br /><span style={{ color: "var(--ion-color-primary)" }}>SETTINGS</span></h1>

						<div className="editor-wrap">

							<ExampleProfiles />
							<TestProfiles />

						</div>

					</div>
				</div>
			</IonContent>

		</IonPage>
	);
};

export default AdminSettings;
