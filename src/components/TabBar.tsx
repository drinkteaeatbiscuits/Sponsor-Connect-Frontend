import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, IonButton } from '@ionic/react';
import { calendar, personCircle, map, informationCircle, settings, trailSign, speedometer, newspaper } from 'ionicons/icons';
import { useHistory } from "react-router";
import { AuthContext } from '../App';

interface TabBarProps {
	activeTab?: string;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab }: TabBarProps ) => {
	const history = useHistory();

    const { state: authState } = React.useContext(AuthContext);

	return <div className="tab-bar">
			
                <div className={ ( activeTab === 'dashboard' && "active " ) + " tab-button"} onClick={()=> history.push("/dashboard")}>
                    <IonIcon icon={speedometer} />
                    <IonLabel>Dashboard</IonLabel>
                    <IonBadge>2</IonBadge>
                </div>

                <div className={ ( activeTab === 'profile' && "active " ) + " tab-button"} onClick={()=> history.push("/profile/" + authState?.user.profile )}>
                    <IonIcon icon={personCircle} />
                    <IonLabel>Profile</IonLabel>
                </div>

                <div className={ ( activeTab === 'opportunities' && "active " ) + " tab-button"} onClick={()=> history.push("/opportunities/"  + authState?.user.profile )}>
                    <IonIcon icon={trailSign} />
                    <IonLabel>Opportunities</IonLabel>
                </div>

                <div className={ ( activeTab === 'the-dugout' && "active " ) + " tab-button"} onClick={()=> history.push("/the-dugout")}>
                    <IonIcon icon={newspaper} />
                    <IonLabel>The Dugout</IonLabel>
                </div>

                <div className={ ( activeTab === 'settings' && "active " ) + " tab-button"} onClick={()=> history.push("/settings")}>
                    <IonIcon icon={settings} />
                    <IonLabel>Settings</IonLabel>
                </div>
           
			
		</div>;

}

export default TabBar;
