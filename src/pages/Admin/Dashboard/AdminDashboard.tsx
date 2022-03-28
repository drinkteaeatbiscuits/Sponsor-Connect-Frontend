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

import './AdminDashboard.scss';
import { NewsFeed } from '../../../components/NewsFeed/NewsFeed';
import Sidebar from '../../Profiles/Sidebar/Sidebar';
import useProfiles from '../../../hooks/useProflies';
import ProfilesContacted from '../../../components/ProfilesContacted/ProfilesContacted';
import ProfileMatches from '../../../components/ProfileMatches/ProfileMatches';
import MetaTags from '../../../components/MetaTags/MetaTags';
import { caretDown, caretUp, personCircle } from 'ionicons/icons';
import { Link } from 'react-router-dom';



export interface props { }

const AdminDashboard: React.FC = () => {

	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);
	const { isLoading, data: profiles, isSuccess, error } = useProfiles(true);

	const [sortedProfiles, setSortedProfiles] = useState<any[]>([]);
	const [sortBy, setSortBy] = useState<any>();

	useEffect(() => {
		
		sortedProfiles?.length === 0 && isSuccess && setSortedProfiles(profiles.sort((a,b) => (a.id > b.id) ? -1 : ((b.id > a.id) ? 1 : 0)));

		if(!sortBy){
			setSortBy({sortBy: 'id', order: 'desc'});
			sortProfiles('id', 'desc');
		}
		
		

	}, [profiles, sortBy, sortedProfiles])
	
	// sortedProfiles && console.log(sortedProfiles);
	// sortBy && console.log(sortBy);

	const columnWidths = {
		avatar: '4%',
		id: '6%',
		profileName: '14%',
		sport: '12%',
		complete: '9%', 
		opportunities: '12%',
		subscription: '12%',
		name: '13%',
		email: '18%'
	}

	const sortProfiles = (sortBy, order) => {
		
		if(sortBy === 'user.subscriptionStatus') {

			console.log(sortBy);
			order === 'asc' && setSortedProfiles(sortedProfiles.sort((a,b) => ( a.user.subscriptionStatus ) ? 1 : ( b.user.subscriptionStatus ? -1 : 0)))
			order === 'desc' && setSortedProfiles(sortedProfiles.sort((a,b) => ( a.user.subscriptionStatus ) ? -1 : (b.user.subscriptionStatus ? 1 : 0) ))


		} else if(sortBy.startsWith('user')){

			order === 'asc' && setSortedProfiles(sortedProfiles.sort((a,b) => (a['user'][sortBy.slice(5)] > b['user'][sortBy.slice(5)]) ? 1 : ((b['user'][sortBy.slice(5)] > a['user'][sortBy.slice(5)]) ? -1 : 0)))
			order === 'desc' && setSortedProfiles(sortedProfiles.sort((a,b) => (a['user'][sortBy.slice(5)] > b['user'][sortBy.slice(5)]) ? -1 : ((b['user'][sortBy.slice(5)] > a['user'][sortBy.slice(5)]) ? 1 : 0)))
		
		} else if(sortBy.startsWith('opportunities')) {
			
			order === 'asc' && setSortedProfiles(sortedProfiles.sort((a,b) => (a['opportunities'].length > b['opportunities'].length) ? 1 : ((b['opportunities'].length > a['opportunities'].length) ? -1 : 0)))
			order === 'desc' && setSortedProfiles(sortedProfiles.sort((a,b) => (a['opportunities'].length > b['opportunities'].length) ? -1 : ((b['opportunities'].length > a['opportunities'].length) ? 1 : 0)))
		
		} else {
			order === 'asc' && setSortedProfiles(sortedProfiles.sort((a,b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0)))
			order === 'desc' && setSortedProfiles(sortedProfiles.sort((a,b) => (a[sortBy] > b[sortBy]) ? -1 : ((b[sortBy] > a[sortBy]) ? 1 : 0)))
		
		}
	}


	// console.log(sortBy?.order);
	// console.log(sortedProfiles);

	return (
		<IonPage>

			<MetaTags title={'Admin Dashboard | Sponsor Connect'} path={'/dashboard'} description={'Sponsor Connect admin dashboard.'} image={"https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg"} />

			<TabBar activeTab="dashboard" />

			<IonContent fullscreen scroll-y="false" className="ion-padding dashboard">

				<div className="dashboard-content" style={{
					height: '100%',
					maxHeight: '100%'
				}}>

					<div className="admin-dashboard-content-column-1" style={{
						width: '100%',
						height: 'calc(100% - 16px)',
						backgroundColor: '#fff',
						padding: '8px 16px 0px',
						borderRadius: '5px',
						fontSize: '0.9em',
						marginTop: '20px',
						letterSpacing: '-0.01em'
						}}>

							<div className="profilesHeader"style={{
										position: 'relative',
										display: 'flex',
										width: '100%',
										alignItems: 'center',
										padding: '8px',
										fontSize: '1em',
										fontWeight: 500,
										borderBottom: '#daede8 1px solid'
										}}>
								<div className="avatar-col" style={{width: columnWidths.avatar }}></div>
								<div className="id-col"
								onClick={() => { 
									
									sortProfiles('id', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({sortBy: 'id', order: sortBy.order === 'asc' ? 'desc' : 'asc'});

								}}
								style={{padding: '12px', cursor: 'pointer', textAlign: 'center', width: columnWidths.id}}>ID 
								{sortBy?.sortBy === 'id' && <IonIcon style={{fontSize: '12px', padding: '0px 4px 0'}} icon={ sortBy?.order === 'asc' ? caretUp : caretDown } /> }
								</div>

								<div className="profile-name-col"
								onClick={() => { 		
									sortProfiles('profileName', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({sortBy: 'profileName', order: sortBy.order === 'asc' ? 'desc' : 'asc'});
								}}
								style={{padding: '12px', cursor: 'pointer', width: columnWidths.profileName}}>Profile Name
								{sortBy?.sortBy === 'profileName' && <IonIcon style={{fontSize: '12px', padding: '0px 4px 0'}} icon={ sortBy?.order === 'asc' ? caretUp : caretDown } /> }
								</div>
								<div className="sport"
								onClick={() => { 		
									sortProfiles('sport', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({sortBy: 'sport', order: sortBy.order === 'asc' ? 'desc' : 'asc'});
								}}
								style={{padding: '12px', cursor: 'pointer', width: columnWidths.sport, textAlign: 'center'}}>Sport
								{sortBy?.sortBy === 'sport' && <IonIcon style={{fontSize: '12px', padding: '0px 4px 0'}} icon={ sortBy?.order === 'asc' ? caretUp : caretDown } /> }
								</div>
								<div className="profile-completion"
								onClick={() => { 		
									sortProfiles('profileComplete', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({sortBy: 'profileComplete', order: sortBy.order === 'asc' ? 'desc' : 'asc'});
								}} 
								style={{padding: '12px', cursor: 'pointer', textAlign: 'center', width: columnWidths.complete}}>Complete
								{sortBy?.sortBy === 'profileComplete' && <IonIcon style={{fontSize: '12px', padding: '0px 4px 0'}} icon={ sortBy?.order === 'asc' ? caretUp : caretDown } /> }
								</div>
								<div className="opportunities-count"
								onClick={() => { 		
									sortProfiles('opportunities?.length', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({sortBy: 'opportunities?.length', order: sortBy.order === 'asc' ? 'desc' : 'asc'});
								}} 
								style={{padding: '12px', textAlign: 'center', cursor: 'pointer', width: columnWidths.opportunities}}>Opportunities
								{sortBy?.sortBy === 'opportunities?.length' && <IonIcon style={{fontSize: '12px', padding: '0px 4px 0'}} icon={ sortBy?.order === 'asc' ? caretUp : caretDown } /> }
								</div>
								<div className="subscription"
								onClick={() => { 		
									sortProfiles('user.subscriptionStatus', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({sortBy: 'user.subscriptionStatus', order: sortBy.order === 'asc' ? 'desc' : 'asc'});
								}} 
								style={{padding: '12px', textAlign: 'center', cursor: 'pointer', width: columnWidths.subscription}}>Subscription
								{sortBy?.sortBy === 'user.subscriptionStatus' && <IonIcon style={{fontSize: '12px', padding: '0px 4px 0'}} icon={ sortBy?.order === 'asc' ? caretUp : caretDown } /> }
								</div>
								<div className="name"
								onClick={() => { 		
									sortProfiles('user.yourName', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({sortBy: 'user.yourName', order: sortBy.order === 'asc' ? 'desc' : 'asc'});
								}}
								style={{padding: '12px', width: columnWidths.name, textAlign: 'center'}}>Name
								{sortBy?.sortBy === 'user.yourName' && <IonIcon style={{fontSize: '12px', padding: '0px 4px 0'}} icon={ sortBy?.order === 'asc' ? caretUp : caretDown } /> }
								</div>
								<div className="email"
								onClick={() => { 		
									sortProfiles('user.email', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({sortBy: 'user.email', order: sortBy.order === 'asc' ? 'desc' : 'asc'});
								}} 
								style={{padding: '12px', width: columnWidths.email, textAlign: 'right'}}>Email
								{sortBy?.sortBy === 'user.email' && <IonIcon style={{fontSize: '12px', padding: '0px 4px 0'}} icon={ sortBy?.order === 'asc' ? caretUp : caretDown } /> }
								</div>
							</div>

							<div className="profiles" style={{
								overflow: 'scroll',
								height: 'calc(100% - 78px)'
							}}>

								{sortedProfiles && sortedProfiles.map((profile, index) => {

									return <div key={profile.id} className="profile" style={{
										position: 'relative',
										display: 'flex',
										width: '100%',
										alignItems: 'center',
										padding: '8px',
										backgroundColor: index % 2 ? "#f7f7f7" : "#fff",
										borderRadius: '3px'
										}}>
										<div className="avatar" style={{
											position: 'relative',
											margin: 0,
											left: 'auto',
											top: 'auto',
											width: columnWidths.avatar
											
										}}>
											<div className="avatar-image" style={{
												width: '50px',
												height: '50px'
											}}>
												
												{ profile?.profilePicture ? 
												
												<picture>
													<source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  profile?.profilePicture?.hash + ".webp" } />
													<source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  profile?.profilePicture?.hash + profile?.profilePicture?.ext } />
													<img className="profile-picture" alt={ "Profile Image " + profile?.profilePicture.id } src={ process.env.REACT_APP_S3_URL + "/images/profile/" +  profile?.profilePicture?.hash + profile?.profilePicture?.ext } /> 
												</picture>
												
												: <IonIcon color="medium" icon={personCircle} /> }
												
											</div>
										</div>
										<div className="" style={{padding: '12px', textAlign: 'center', width: columnWidths.id}}>
											{profile.id}
										</div>
										<div className="" style={{padding: '12px', width: columnWidths.profileName}}>
											<div className="profile-link"
											style={{
												cursor: 'pointer',
												color: 'var(--ion-color-primary)',
												
											}}
											onClick={() => {history.push('/profile/' + profile.id)}}>
												{profile.profileName}
											</div>
											
										</div>
										<div className="" style={{padding: '12px', textAlign: 'center', width: columnWidths.sport}}>
											{profile.sport}
										</div>
										
										<div className="" style={{padding: '12px', textAlign: 'center', width: columnWidths.complete}}>
											{profile.profileComplete ? profile.profileComplete + "%" : "-"}
										</div>
										<div className="" style={{padding: '12px', textAlign: 'center', width: columnWidths.opportunities}}>
											{profile.opportunities?.length}
										</div>
										<div className="" style={{padding: '12px', textAlign: 'center', width: columnWidths.subscription}}>
											{profile.user.subscriptionStatus ? profile.user.subscriptionStatus : '-'}
										</div>
										<div className="" style={{padding: '12px', textAlign: 'center', width: columnWidths.name}}>
											{profile.user.yourName}
										</div>
										<div className="" style={{padding: '12px', textAlign: 'right', width: columnWidths.email}}>
											<Link 
											className="email-link"
											to='#'
											onClick={(e) => {
												window.location.href = 'mailto:' + profile.user.email;
												e.preventDefault();
											}}
											 >{profile.user.email}</Link>
										</div>
										


									</div>

								})}

						</div>

					</div>

				</div>

			</IonContent>

		</IonPage>
	);
};

export default AdminDashboard;
