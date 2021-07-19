import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonItem, IonMenuButton } from "@ionic/react";
import { useHistory } from "react-router";


interface HeaderProps {
	headerTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ headerTitle }: HeaderProps ) => {


	const history = useHistory();

	return <IonHeader>
			<IonToolbar>
			<IonTitle>{ headerTitle }  </IonTitle>
			
			<IonButtons slot="end">
				
			{ history.location.pathname === '/menu' ? <IonButton onClick={()=> history.goBack()}>Close Menu</IonButton> : <IonButton onClick={()=> history.push("/menu")}>Menu</IonButton>
 }
				
				

			</IonButtons>
			</IonToolbar>
			
		</IonHeader>;

}

export default Header;
