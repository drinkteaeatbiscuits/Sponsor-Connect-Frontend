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

import './Users.scss';
import MetaTags from '../../../components/MetaTags/MetaTags';
import { caretDown, caretUp, personCircle } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import useUsers from '../../../hooks/useUsers';



export interface props { }

const Users: React.FC = () => {

	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);
	const { isLoading, data: users, isSuccess, error } = useUsers();

	const [sortedUsers, setSortedUsers] = useState<any[]>([]);
	const [sortBy, setSortBy] = useState<any>();

	useEffect(() => {

		sortedUsers?.length === 0 && isSuccess && setSortedUsers(users.sort((a, b) => (a.id > b.id) ? -1 : ((b.id > a.id) ? 1 : 0)));

		if (!sortBy) {
			setSortBy({ sortBy: 'id', order: 'desc' });
			sortUsers('id', 'desc');
		}

	}, [users, sortBy, sortedUsers])

	// sortedUsers && console.log(sortedUsers);
	// sortBy && console.log(sortBy);

	const columnWidths = {
		id: '5%',
		userName: '12%',
		email: '17%',		
		sport: '8%',
		profileName: '14%',
		created: '10%',
		currency: '9%',
		subscription: '11%',
		location: '15%',
		
	}

	const sortUsers = (sortBy, order) => {

		if (sortBy === 'accountType') {

			order === 'asc' && setSortedUsers(sortedUsers.sort((a, b) => (a.accountType) ? 1 : (b.accountType ? -1 : 0)))
			order === 'desc' && setSortedUsers(sortedUsers.sort((a, b) => (a.accountType) ? -1 : (b.accountType ? 1 : 0)))

		} else if (sortBy === 'profileName') {

			order === 'asc' && setSortedUsers(sortedUsers.sort((a, b) => a.profile ? (a.profile?.profileName > b.profile?.profileName) ? 1 : ((b.profile?.profileName > a.profile?.profileName) ? -1 : 0) : -1))
			order === 'desc' && setSortedUsers(sortedUsers.sort((a, b) => !a.profile ? (a.profile?.profileName > b.profile?.profileName) ? -1 : ((b.profile?.profileName > a.profile?.profileName) ? 1 : 0) : -1))

		} else if (sortBy === 'subscriptionStatus') {

			// console.log(sortBy);
			order === 'asc' && setSortedUsers(sortedUsers.sort((a, b) => (a.subscriptionStatus) ? 1 : (b.subscriptionStatus ? -1 : 0)))
			order === 'desc' && setSortedUsers(sortedUsers.sort((a, b) => (a.subscriptionStatus) ? -1 : (b.subscriptionStatus ? 1 : 0)))


		} else if (sortBy === 'location') {

			order === 'asc' && setSortedUsers(sortedUsers.sort((a, b) => {
				
				if(!a.location?.label && b.location?.label === undefined && a.profile?.location?.label === undefined && b.profile?.location?.label === undefined){
					
					return -1;

				} else if(a.location?.label && b.location?.label){

					return a.location?.label ? (a.location.label > b.location.label) ? 1 : ((b.location.label > a.location.label) ? -1 : 0) : -1

				} else if(a.location?.label && b.location?.label === undefined && b.profile?.location.label ){

					return a.location.label ? (a.location.label > b.profile.location.label) ? 1 : ((b.profile.location.label > a.location.label) ? -1 : 0) : -1

				} else if(a.profile?.location?.label && b.location?.label === undefined && b.profile?.location.label ){

					return a.profile?.location?.label ? (a.profile?.location?.label > b.profile.location.label) ? 1 : ((b.profile.location.label > a.profile?.location?.label) ? -1 : 0) : -1

				} else if(a.profile?.location?.label && b.location?.label ){

					return a.profile?.location?.label ? (a.profile?.location?.label > b.location.label) ? 1 : ((b.location.label > a.profile?.location?.label) ? -1 : 0) : -1

				} else {
					return 0
				}
				
			}));

			order === 'desc' && setSortedUsers(sortedUsers.sort((a, b) => {

				// console.log(b.location?.label);
				
				if(!a.location?.label && b.location?.label === undefined && a.profile?.location?.label === undefined && b.profile?.location?.label  === undefined){
					
					return 1;

				} else if(a.location?.label && b.location?.label){

					return a.location?.label ? (a.location.label > b.location.label) ? -1 : ((b.location.label > a.location.label) ? 1 : 0) : 1

				} else if(a.location?.label && b.location?.label === undefined && b.profile?.location.label ){

					return a.location.label ? (a.location.label > b.profile.location.label) ? -1 : ((b.profile.location.label > a.location.label) ? 1 : 0) : 1

				} else if(a.profile?.location?.label && b.location?.label === undefined && b.profile?.location.label ){

					return a.profile?.location?.label ? (a.profile?.location?.label > b.profile.location.label) ? -1 : ((b.profile.location.label > a.profile?.location?.label) ? 1 : 0) : 1

				} else if(a.profile?.location?.label && b.location?.label ){

					return a.profile?.location?.label ? (a.profile?.location?.label > b.location.label) ? -1 : ((b.location.label > a.profile?.location?.label) ? 1 : 0) : 1

				} else {
					return 0
				}
				
			}));

			// order === 'desc' && setSortedUsers(sortedUsers.sort((a, b) => (a['user'][sortBy.slice(5)] > b['user'][sortBy.slice(5)]) ? -1 : ((b['user'][sortBy.slice(5)] > a['user'][sortBy.slice(5)]) ? 1 : 0)))

		} else if (sortBy.startsWith('opportunities')) {

			order === 'asc' && setSortedUsers(sortedUsers.sort((a, b) => (a['opportunities'].length > b['opportunities'].length) ? 1 : ((b['opportunities'].length > a['opportunities'].length) ? -1 : 0)))
			order === 'desc' && setSortedUsers(sortedUsers.sort((a, b) => (a['opportunities'].length > b['opportunities'].length) ? -1 : ((b['opportunities'].length > a['opportunities'].length) ? 1 : 0)))

		} else {
			order === 'asc' && setSortedUsers(sortedUsers.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0)))
			order === 'desc' && setSortedUsers(sortedUsers.sort((a, b) => (a[sortBy] > b[sortBy]) ? -1 : ((b[sortBy] > a[sortBy]) ? 1 : 0)))

		}
	}


	// console.log(sortBy?.order);
	// console.log(sortedUsers);

	return (
		<IonPage>

			<MetaTags title={'Admin Dashboard | Sponsor Connect'} path={'/dashboard'} description={'Sponsor Connect admin dashboard.'} image={"https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg"} />

			<TabBar activeTab="users" />

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

						<div className="profilesHeader" style={{
							position: 'relative',
							display: 'flex',
							width: '100%',
							alignItems: 'center',
							padding: '8px',
							fontSize: '1em',
							fontWeight: 500,
							borderBottom: '#daede8 1px solid'
						}}>
							
							<div className="id-col"
								onClick={() => {
									sortUsers('id', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({ sortBy: 'id', order: sortBy.order === 'asc' ? 'desc' : 'asc' });
								}}
								style={{ padding: '12px', cursor: 'pointer', textAlign: 'center', width: columnWidths.id
								}}>ID
								{sortBy?.sortBy === 'id' && <IonIcon style={{ fontSize: '12px', padding: '0px 4px 0' }} icon={sortBy?.order === 'asc' ? caretUp : caretDown} />}
							</div>

							<div className="user-name-col"
								onClick={() => {
									sortUsers('yourName', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({ sortBy: 'yourName', order: sortBy.order === 'asc' ? 'desc' : 'asc' });
								}}
								style={{ padding: '12px', cursor: 'pointer', width: columnWidths.userName }}>Name
								{sortBy?.sortBy === 'yourName' && <IonIcon style={{ fontSize: '12px', padding: '0px 4px 0' }} icon={sortBy?.order === 'asc' ? caretUp : caretDown} />}
							</div>
							<div className="email"
								onClick={() => {
									sortUsers('email', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({ sortBy: 'email', order: sortBy.order === 'asc' ? 'desc' : 'asc' });
								}}
								style={{ padding: '12px', cursor: 'pointer', width: columnWidths.email, textAlign: 'left' }}>Email
								{sortBy?.sortBy === 'email' && <IonIcon style={{ fontSize: '12px', padding: '0px 4px 0' }} icon={sortBy?.order === 'asc' ? caretUp : caretDown} />}
							</div>
							<div className="sport"
								onClick={() => {
									sortUsers('accountType', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({ sortBy: 'accountType', order: sortBy.order === 'asc' ? 'desc' : 'asc' });
								}}
								style={{ padding: '12px', cursor: 'pointer', width: columnWidths.sport, textAlign: 'center' }}>Type
								{sortBy?.sortBy === 'accountType' && <IonIcon style={{ fontSize: '12px', padding: '0px 4px 0' }} icon={sortBy?.order === 'asc' ? caretUp : caretDown} />}
							</div>
							<div className="profile-name-col"
								onClick={() => { 		
									sortUsers('profileName', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({sortBy: 'profileName', order: sortBy.order === 'asc' ? 'desc' : 'asc'});
								}}
								style={{padding: '12px', textAlign: 'center', cursor: 'pointer', width: columnWidths.profileName}}>Profile Name
								{sortBy?.sortBy === 'profileName' && <IonIcon style={{fontSize: '12px', padding: '0px 4px 0'}} icon={ sortBy?.order === 'asc' ? caretUp : caretDown } /> }
							</div>

							<div className="user-completion"
								onClick={() => {
									sortUsers('created_at', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({ sortBy: 'created_at', order: sortBy.order === 'asc' ? 'desc' : 'asc' });
								}}
								style={{ padding: '12px', cursor: 'pointer', textAlign: 'center', width: columnWidths.created 
								}}>Created
								{sortBy?.sortBy === 'created_at' && <IonIcon style={{ fontSize: '12px', padding: '0px 4px 0' }} icon={sortBy?.order === 'asc' ? caretUp : caretDown} />}
							</div>
							<div className="opportunities-count"
								onClick={() => {
									sortUsers('currency', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({ sortBy: 'currency', order: sortBy.order === 'asc' ? 'desc' : 'asc' });
								}}
								style={{ padding: '12px', textAlign: 'center', cursor: 'pointer', width: columnWidths.currency 
								}}>Currency
								{sortBy?.sortBy === 'currency' && <IonIcon style={{ fontSize: '12px', padding: '0px 4px 0' }} icon={sortBy?.order === 'asc' ? caretUp : caretDown} />}
							</div>
							<div className="subscription"
								onClick={() => {
									sortUsers('subscriptionStatus', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({ sortBy: 'subscriptionStatus', order: sortBy.order === 'asc' ? 'desc' : 'asc' });
								}}
								style={{ padding: '12px', textAlign: 'center', cursor: 'pointer', width: columnWidths.subscription }}>Subscription
								{sortBy?.sortBy === 'subscriptionStatus' && <IonIcon style={{ fontSize: '12px', padding: '0px 4px 0' }} icon={sortBy?.order === 'asc' ? caretUp : caretDown} />}
							</div>
							<div className="location"
								onClick={() => {
									sortUsers('location', sortBy.order === 'asc' ? 'desc' : 'asc')
									setSortBy({ sortBy: 'location', order: sortBy.order === 'asc' ? 'desc' : 'asc' });
								}}
								style={{ padding: '12px', width: columnWidths.location, textAlign: 'right' }}>Location
								{sortBy?.sortBy === 'location' && <IonIcon style={{ fontSize: '12px', padding: '0px 4px 0' }} icon={sortBy?.order === 'asc' ? caretUp : caretDown} />}
							</div>
							
						</div>

						<div className="users" style={{
							overflow: 'scroll',
							height: 'calc(100% - 78px)'
						}}>

							{sortedUsers && sortedUsers.map((user, index) => {

								// console.log(user);
								return user.accountType != 'Admin' && <div key={user.id} className="user" style={{
									position: 'relative',
									display: 'flex',
									width: '100%',
									alignItems: 'center',
									padding: '8px',
									backgroundColor: index % 2 ? "#f7f7f7" : "#fff",
									borderRadius: '3px'
								}}>

									<div className="" style={{ padding: '12px', textAlign: 'center', width: columnWidths.id }}>
										{user.id}
									</div>
									<div className="" style={{ padding: '12px', textAlign: 'left', width: columnWidths.userName }}>
										{user.yourName ? user.yourName : '-'}
									</div>
									<div className="" style={{ padding: '12px', textAlign: 'left', width: columnWidths.email }}>
										<Link
											className="email-link"
											to='#'
											onClick={(e) => {
												window.location.href = 'mailto:' + user.email;
												e.preventDefault();
											}}
										>{user.email}</Link>
									</div>
									<div className="" style={{ padding: '12px', textAlign: 'center', width: columnWidths.sport }}>
										{user.accountType ? user.accountType : 'Sport'}
									</div>
									<div className="" style={{ padding: '12px', textAlign: 'center', width: columnWidths.profileName }}>
										{user.profile?.profileName ? <div className="profile-link"
											style={{
												cursor: 'pointer',
												color: 'var(--ion-color-primary)',

											}}
											onClick={() => { history.push('/profile/' + user.profile.id) }}>{user.profile.profileName}</div> : '-'}
									</div>


									<div className="" style={{ padding: '12px', textAlign: 'center', width: columnWidths.created }}>
										{new Date(user.created_at).toLocaleString().split(',')[0]}
									</div>
									<div className="" style={{ padding: '12px', textAlign: 'center', width: columnWidths.currency }}>
										{user.currency}
									</div>
									<div className="" style={{ padding: '12px', textAlign: 'center', width: columnWidths.subscription }}>
										{user.subscriptionStatus ? user.subscriptionStatus : '-'}
									</div>

									<div className="" style={{ padding: '12px', textAlign: 'right', width: columnWidths.location }}>
										{user.location ? user.location?.label : (user.profile?.location?.label ? user.profile?.location?.label : '-')}

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

export default Users;
