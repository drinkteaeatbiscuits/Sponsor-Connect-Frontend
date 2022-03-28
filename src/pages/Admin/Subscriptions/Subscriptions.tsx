import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';

import { useHistory, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../../components/LogoutButton';
import TabBar from '../../../components/TabBar';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Scrollbar from "react-scrollbars-custom";

import ErrorBoundary from '../../../containers/ErrorBoundary/ErrorBoundary';

import './Subscriptions.scss';
import { NewsFeed } from '../../../components/NewsFeed/NewsFeed';
import Sidebar from '../../Profiles/Sidebar/Sidebar';
import useProfiles from '../../../hooks/useProflies';
import ProfilesContacted from '../../../components/ProfilesContacted/ProfilesContacted';
import ProfileMatches from '../../../components/ProfileMatches/ProfileMatches';
import MetaTags from '../../../components/MetaTags/MetaTags';
import { caretDown, caretUp, personCircle } from 'ionicons/icons';
import { Link } from 'react-router-dom';



export interface props { }

const Subscriptions: React.FC = () => {

	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);
	// const { isLoading, data: profiles, isSuccess, error } = useProfiles(true);

	useEffect(() => {
		
	}, [])
	



	return (
		<IonPage>

			<MetaTags title={'Admin Dashboard | Sponsor Connect'} path={'/dashboard'} description={'Sponsor Connect admin dashboard.'} image={"https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg"} />

			<TabBar activeTab="subscriptions" />

			<IonContent fullscreen scroll-y="false" className="ion-padding dashboard">

				<div className="" style={{marginTop: '100px'}}>Subscriptions</div>
			</IonContent>

		</IonPage>
	);
};

export default Subscriptions;
