import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonItem, IonContent, IonList, IonMenu } from "@ionic/react";
import { useHistory } from "react-router";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";


interface MenuProps {
	MenuProps?: string;
}

const MainMenu: React.FC<MenuProps> = ({ MenuProps }: MenuProps ) => {


	const history = useHistory();

	return <IonMenu side="start" menuId="first">
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>Start Menu</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        <IonItem>Menu Item</IonItem>
        <IonItem>Menu Item</IonItem>
        <IonItem>Menu Item</IonItem>
        <IonItem>Menu Item</IonItem>
        <IonItem>Menu Item</IonItem>
      </IonList>
    </IonContent>
  </IonMenu>;

}

export default MainMenu;


