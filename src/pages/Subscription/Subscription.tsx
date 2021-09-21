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

import getSymbolFromCurrency from 'currency-symbol-map'


import './Subscription.scss';
import useMySubscription from '../../hooks/useMySubscription';
import usePrices from '../../hooks/usePrices';


export interface props {}

const Subscription: React.FC = () => {
  

	const history = useHistory();
  const { state: authState, dispatch } = React.useContext(AuthContext);


  const {isLoading, data, isSuccess, error} = useMySubscription();
  
  const {isLoading: isLoadingPrices, data: dataPrices, isSuccess: isSuccessPrices, error: errorPrices} = usePrices();

  const [selectedPrice, setSelectedPrice] = useState();
  
  
  useEffect(() => {
    
  });

   const switchBilling = (data: string) => {
     switch ( data ) 
            {
              case "month":
                return 'Billing Monthly'; 
              case "year":
                return 'Billing Annually';
              default:
                return 'Billing each ' + data;
            }
          }
        
        const getDate = (date:any) => {
          
          const newDate = new Date( date * 1000 ).toLocaleString('en-GB', { 
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          });
          return newDate;
        }

        const getPrice = (price:any, currency:any) => {

          return getSymbolFromCurrency(currency) + (Math.round(price) / 100).toFixed(2);
        }


  return (
    <IonPage>
      <Header headerTitle="Billing"/>
      <TabBar activeTab="settings"/>
      <IonContent className="ion-padding" fullscreen >
        <div className="content">

          { isSuccess && authState.user.subscription && data[0].subscriptionId ? 
          
          data[0]?.subscriptionStatus === 'active' ?


          <div className="subscription-info">
            <h2>Subscription</h2>
            <p>Sponsor Connect Subscription</p>
            <p>{ switchBilling(data[0]?.subscriptionObject?.plan?.interval) }</p>
            <p>Your next invoice is for <strong>{ getPrice(data[0]?.subscriptionObject?.plan?.amount, data[0]?.subscriptionObject?.plan?.currency ) }</strong> on <strong>{ getDate(data[0]?.currentPeriodEnd) }</strong></p>


            <p>Customer ID: { data[0]?.stripeCustomerId }</p>
            <p>Subscription ID: { data[0]?.subscriptionId }</p>
            <p>Subscription Status: { data[0]?.subscriptionStatus }</p>

          </div>
          
          : data[0]?.subscriptionStatus === 'active' ?
          
          <p>Subscription Active</p>
          
            : data[0]?.subscriptionStatus === 'canceled' ?
          
          <p>Subscription Canceled</p>
          
            : data[0]?.subscriptionStatus ?

            <p>Subscription { data[0]?.subscriptionStatus }</p>

          : <div className="please-subscribe">
              <h2>Subscription</h2>
              <p>Subscribe now to start displaying your profile and sponsorship opportunities to potential sponsors!</p>
              <p>Choose your billing frequency:</p>
              
                {isSuccessPrices && 

                  <div className="select-plan">

                    {dataPrices?.data.map((element:any) => {

                      return <div className={ selectedPrice === element.id ? "plan active" : "plan" } key={element.id} onClick={() => setSelectedPrice(element.id)}>
                        
                 

                        <p><strong>Pay {element.recurring.interval === 'year' ? 'Annually' : 'Monthly'}</strong></p>
                        
                        <p>{getPrice(element.unit_amount, element.currency )} per {element.recurring.interval}</p>
                      
                        {element.metadata?.discount && <div className="discount"><small>{ element.metadata?.discount }</small></div>}

                      </div>

                    })}

                  </div>

                }

              <IonButton>Make A Payment</IonButton>
                
              
            </div>
        : 

        <div className="not-subscribed">
          <p>You aren't yet subscribed.</p>
          <IonButton onClick={() => history.push('/settings/billing') }>Subscribe now</IonButton>
        </div>

        }
          

        </div>

      </IonContent>
    </IonPage>
  );
};

export default Subscription;
