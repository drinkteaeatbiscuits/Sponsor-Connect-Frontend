import { IonButton, IonContent, IonPage } from '@ionic/react';
import Header from '../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import TabBar from '../components/TabBar';
import { loadStripe } from "@stripe/stripe-js";
import {CardElement, useStripe, Elements, useElements} from '@stripe/react-stripe-js';

// import './subscription.css';
import useMySubscription from '../hooks/useMySubscription';


export interface props {}

const Subscription: React.FC = () => {

	// const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  const {isLoading, data, error} = useMySubscription();

  console.log(data);
  useEffect(() => {
  }, []);

  return (
    <IonPage>
      <Header headerTitle="Billing"/>
      <TabBar activeTab="settings"/>
      <IonContent className="ion-padding" fullscreen >

		  { data && 
		   data[0].subscriptionStatus ? <p>Subscription Status: { data[0].subscriptionStatus }</p>
		  : <p>Subscription Status: Null</p> }

        

      </IonContent>
    </IonPage>
  );
};

export default Subscription;
