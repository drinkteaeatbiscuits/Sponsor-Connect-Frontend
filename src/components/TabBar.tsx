import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, IonButton } from '@ionic/react';
import { calendar, personCircle, map, informationCircle, settings, trailSign, speedometer, newspaper, logOut, starOutline, cashOutline, pricetagsOutline } from 'ionicons/icons';
import { useHistory, useLocation } from "react-router";
import { AuthContext } from '../App';
import SvgScLogo from '../pages/OnBoardingSport/images/SvgScLogo';
import SvgScLogoHorizontal from './SvgScLogoHorizontal';

interface TabBarProps {
	activeTab?: string;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab }: TabBarProps ) => {
	const history = useHistory();


    const { state: authState, dispatch } = React.useContext(AuthContext);

    const location = useLocation();

	const doLogout = async () => {
	
		const logoutResp = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/logout", {
			method: "POST",
			credentials: "include",
		  });
	
		  const logoutInfo = await logoutResp.json();
  
		  if(logoutInfo?.statusCode) {
  
			  alert( "Error: " + logoutInfo.data[0].messages[0].message );
  
		  }else{

              history.push('/');

			  dispatch && dispatch({
				type: "LOGOUT"
			  });

			  window.location.reload();

		  }

	  }

      
      const isBusinessAccount = () => {
        return authState.user?.accountType === "Business" ? true : false;
      }

      const isAdminUser = () => {
        return authState.user?.role?.type === 'admin' ? true : false;
      }
     

	return <div className="tab-bar">
        

            {  
            // Logged in Sport
            authState.isAuthenticated && !isBusinessAccount() && !isAdminUser() && <>
                <div className="logo-header">
                    <div className="" onClick={()=> history.push("/dashboard")}><SvgScLogoHorizontal /></div>
                </div>
                <div className={ ( activeTab === 'dashboard' && "active " ) + " tab-button"} onClick={()=> history.push("/dashboard")}>
                   <IonIcon icon={speedometer} /> 
                    <IonLabel>Dashboard</IonLabel> 
                    {/* <IonBadge>2</IonBadge>  */}
                </div>

                <div className={ ( activeTab === 'profile' && "active " ) + " tab-button"} onClick={()=> history.push(authState?.user.profileSlug ? "/" + authState?.user.profileSlug : "/profile/" + authState?.user.profile )}>
                    <IonIcon icon={personCircle} />
                    <IonLabel>Profile</IonLabel>
                </div>

                <div className={ ( activeTab === 'opportunities' && "active " ) + " tab-button"} onClick={()=> history.push("/opportunities/"  + authState?.user.profile )}>
                    <IonIcon icon={trailSign} />
                    <IonLabel>Opportunities</IonLabel>
                </div>

                <div className={ ( activeTab === 'the-dugout' && "active " ) + " tab-button"} onClick={()=> history.push("/the-dugout-categories")}>
                    <IonIcon icon={newspaper} />
                    <IonLabel>The Dugout</IonLabel>
                </div>

                <div className={ ( activeTab === 'settings' && "active " ) + " tab-button"} onClick={()=> history.push("/settings")}>
                    <IonIcon icon={settings} />
                    <IonLabel>Settings</IonLabel>
                </div>


                <div className="logout tab-button" onClick={()=> doLogout()}>
                    <IonIcon icon={logOut} />
                    <IonLabel>Log Out</IonLabel>
                </div>
            
            </>}

           { // Logged in Business
            authState.isAuthenticated && isBusinessAccount() && !isAdminUser() && <> 
                <div className="logo-header">
                    <div className="" onClick={()=> history.push("/dashboard")}><SvgScLogoHorizontal /></div>
                </div>
                <div className={ ( activeTab === 'dashboard' && "active " ) + " tab-button"} onClick={()=> history.push("/dashboard")}>
                   <IonIcon icon={speedometer} /> 
                    <IonLabel>Dashboard</IonLabel> 
                    {/* <IonBadge>2</IonBadge>  */}
                </div>

                <div className={ ( activeTab === 'profiles' && "active " ) + " tab-button"} onClick={()=> history.push("/profiles")}>
                    <IonIcon icon={personCircle} />
                    <IonLabel>Profiles</IonLabel>
                </div>
                
                <div className={ ( activeTab === 'favourites' && "active " ) + " tab-button"} onClick={()=> history.push("/favourites/" )}>
                    <IonIcon icon={starOutline} />
                    <IonLabel>Favourites</IonLabel>
                </div>

                <div className={ ( activeTab === 'the-dugout' && "active " ) + " tab-button"} onClick={()=> history.push("/the-dugout-categories")}>
                    <IonIcon icon={newspaper} />
                    <IonLabel>The Dugout</IonLabel>
                </div>

                <div className={ ( activeTab === 'settings' && "active " ) + " tab-button"} onClick={()=> history.push("/settings")}>
                    <IonIcon icon={settings} />
                    <IonLabel>Settings</IonLabel>
                </div>

                <div className="logout tab-button" onClick={()=> doLogout()}>
                    <IonIcon icon={logOut} />
                    <IonLabel>Log Out</IonLabel>
                </div>
                

            </>}


            { // Logged in Admin
            authState.isAuthenticated && !isBusinessAccount() && isAdminUser() && <> 
                <div className="logo-header">
                    <div className="" onClick={()=> history.push("/dashboard")}><SvgScLogoHorizontal /></div>
                </div>
                <div className={ ( activeTab === 'dashboard' && "active " ) + " tab-button"} onClick={() => history.push("/dashboard")}>
                   <IonIcon icon={speedometer} /> 
                    <IonLabel>Dashboard</IonLabel> 
                    {/* <IonBadge>2</IonBadge>  */}
                </div>
                <div className={ ( activeTab === 'users' && "active " ) + " tab-button"} onClick={() => history.push("/dashboard/users")}>
                   <IonIcon icon={personCircle} /> 
                    <IonLabel>Users</IonLabel> 
                    {/* <IonBadge>2</IonBadge>  */}
                </div>
                <div className={ ( activeTab === 'settings' && "active " ) + " tab-button"} onClick={() => history.push("/settings")}>
                    <IonIcon icon={settings} />
                    <IonLabel>Settings</IonLabel>
                </div>
                <div className="logout tab-button" onClick={() => doLogout()}>
                    <IonIcon icon={logOut} />
                    <IonLabel>Log Out</IonLabel>
                </div>
            </>
            }

            { // Not logged in
                !authState.isAuthenticated && !isBusinessAccount() && !isAdminUser() && <>
                    <div className="logo-header">
                        <div className="" onClick={()=> history.push("/")}><SvgScLogoHorizontal /></div>
                    </div>
                   
                    <div className="signup tab-button" onClick={() => history.push("/")}>
                        <IonButton style={{margin: '0 8px', minWidth: '150px', '--ripple-color': 'transparent'}} size='small' >Sign Up</IonButton>
                    </div>
                     <div className="login tab-button" onClick={() => history.push("/login")}>
                        <IonButton style={{margin: '0 8px', '--ripple-color': 'transparent', color: 'var(--ion-color-dark)', fontSize: '1em'}} buttonType='link' >Login</IonButton>
                    </div>
                    
                </>
            }


			
		</div>;

}

export default TabBar;
