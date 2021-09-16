import { IonButton, IonContent, IonPage } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import { loadStripe } from "@stripe/stripe-js";
import {CardElement, useStripe, Elements, useElements} from '@stripe/react-stripe-js';

// import './subscription.css';
import useMySubscription from '../../hooks/useMySubscription';


export interface props {}

const Subscription: React.FC = () => {

	// const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  const {isLoading, data, isSuccess, error} = useMySubscription();

  console.log(data);
  useEffect(() => {
  });

  return (
    <IonPage>
      <Header headerTitle="Billing"/>
      <TabBar activeTab="settings"/>
      <IonContent className="ion-padding" fullscreen >
        <div className="content">
          
          {!isLoading && 
          <div className="subscription-info">
            <h2>Subscription Info</h2>
            <p>Customer ID: { data[0].stripeCustomerId }</p>
            
          </div>
          }
          

        </div>

      </IonContent>
    </IonPage>
  );
};

export default Subscription;
