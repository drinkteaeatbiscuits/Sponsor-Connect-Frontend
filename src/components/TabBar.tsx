import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, IonButton } from '@ionic/react';
import { calendar, personCircle, map, informationCircle, settings, trailSign, speedometer } from 'ionicons/icons';
import { useHistory } from "react-router";


const TabBar: React.FC = () => {
	const history = useHistory();

	return <div className="tab-bar">
			
                <div className={ ( history.location.pathname === '/dashboard' && "active " ) + " tab-button"} onClick={()=> history.push("/dashboard")}>
                    <IonIcon icon={speedometer} />
                    <IonLabel>Dashboard</IonLabel>
                    <IonBadge>2</IonBadge>
                </div>

                <div className={ ( history.location.pathname === '/profile' && "active " ) + " tab-button"} onClick={()=> history.push("/profile")}>
                    <IonIcon icon={personCircle} />
                    <IonLabel>Profile</IonLabel>
                </div>

                <div className={ ( history.location.pathname === '/opportunities' && "active " ) + " tab-button"} onClick={()=> history.push("/opportunities")}>
                    <IonIcon icon={trailSign} />
                    <IonLabel>Opportunities</IonLabel>
                </div>

                <div className={ ( history.location.pathname === '/settings' && "active " ) + " tab-button"} onClick={()=> history.push("/settings")}>
                    <IonIcon icon={settings} />
                    <IonLabel>Settings</IonLabel>
                </div>
           
			
		</div>;

}

export default TabBar;
