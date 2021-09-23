import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';
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
import CardLogos from '../../components/CardLogos/CardLogos';
import usePayments from '../../hooks/usePayments';

import { document } from 'ionicons/icons';
import { useQueryClient } from 'react-query';

export interface props {}

const Subscription: React.FC = () => {
  
  const [refetchInterval, setRefetchInterval] = useState<any>(false);
  const [expectedStatus, setExpectedStatus] = useState("");
  const [expectedCancelling, setExpectedCancelling] = useState(false);

	const history = useHistory();
  const { state: authState, dispatch } = React.useContext(AuthContext);


  const {isLoading, data, isSuccess, error, refetch: refetchMySubscription } = useMySubscription(refetchInterval);
  const {isLoading: isLoadingPayments, data: dataPayments, isSuccess: isSuccessPayments, error: errorPayments} = usePayments();
  
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [subscriptionCancelling, setSubscriptionCancelling] = useState("");
  
  useEffect(() => {

    isSuccess && setSubscriptionStatus(data[0]?.subscriptionStatus);
    isSuccess && setSubscriptionCancelling(data[0]?.subscriptionObject?.cancel_at_period_end);

    isSuccess && expectedStatus === data[0]?.subscriptionStatus && expectedCancelling === data[0].subscriptionObject.cancel_at_period_end && setRefetchInterval(false);
  
  }, [data, expectedCancelling, expectedStatus, isSuccess]);


  


   const switchBilling = (data: string) => {
     switch ( data ) 
            {
              case "month":
                return 'Billing Monthly'; 
              case "year":
                return 'Billing Annually';
              default:
                return
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

        const HandleReactivateSubscription = async (event: any) => {

          event.preventDefault();

          setExpectedStatus('active');
          setExpectedCancelling(false);
          setRefetchInterval(2000);
      
            const subscriptionResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/subscriptions/reactivate-subscription", {
              credentials: "include",
              method: "POST", 
              headers: {
                "Content-Type": "application/json"
              },
              
            });
                        
            subscriptionResponse.ok && refetchMySubscription();
           
          return await subscriptionResponse.json();
          
        }

        const HandleCancelSubscription = async (event: any) => {

          event.preventDefault();

            setExpectedStatus('active');
            setExpectedCancelling(true);
            setRefetchInterval(2000);
      
            const subscriptionResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/subscriptions/cancel-subscription", {
              credentials: "include",
              headers: {
                "Content-Type": "application/json"
              },
              method: "POST", 
            });            
              
            subscriptionResponse.ok && refetchMySubscription();
              
      
          return await subscriptionResponse.json();
          
        }

  return (
    <IonPage>
      <TabBar activeTab="settings"/>
      <IonContent className="ion-padding" fullscreen >
        <div className="content">

          { isSuccess &&  
          

          <div className="subscription-info">

            <h2 style={{textTransform: "uppercase", fontSize:"3em"}}>Subscription</h2>
            <div className={"active-subscription " + data[0]?.subscriptionStatus + " " + ( subscriptionCancelling && " is-cancelling") }>
              
              {refetchInterval && <div className="updating-subscription-overlay"><IonSpinner name="dots" color="light" /></div>}

              {data[0]?.subscriptionStatus && <div className="subscription-status">{ subscriptionCancelling && subscriptionStatus === 'active' ? "Cancelling" : data[0]?.subscriptionStatus }</div> }
              <p className="" style={{ fontSize: "1.3em", lineHeight: 1.2, letterSpacing:"-0.015em", fontWeight: 700, margin: 0, padding: "12px 90px 0 0" }}>Sponsor Connect Subscription</p>
              
              <p style={{color: "var(--ion-color-medium)", fontWeight: 500, margin: 0, padding: "3px 0 0"}}>{ switchBilling(data[0]?.subscriptionObject?.plan?.interval) }</p>
              
              {data[0]?.subscriptionStatus === 'active' && !subscriptionCancelling && <p style={{padding: "12px 0"}}>Your next invoice is for <strong>{ getPrice(data[0]?.subscriptionObject?.plan?.amount, data[0]?.subscriptionObject?.plan?.currency ) }</strong> on <strong>{ getDate(data[0]?.currentPeriodEnd) }</strong></p> }
              
              {subscriptionCancelling && subscriptionStatus === 'active' && <p style={{padding: "12px 0"}}>Your subscription has been cancelled<br/> and will expire on <strong>{ getDate(data[0]?.currentPeriodEnd) }</strong></p> }
              
              {data[0]?.subscriptionStatus === 'canceled' && <p style={{padding: "12px 0"}}>Your subscription has been cancelled<br/> and expired on <strong>{ getDate(data[0]?.currentPeriodEnd) }</strong></p> }
              
              
              {!data[0]?.subscriptionStatus && <p style={{padding: "12px 0"}}>Subscribe now to start displaying your profile and sponsorship opportunities to potential sponsors!</p> }



            {data[0]?.paymentMethods &&
              <div className="payment-method">
                <div className="card-logo">
                  { React.createElement( CardLogos[data[0]?.paymentMethods.cardBrand] ) }
                </div>
                <div className="card-details">
                  <p style={{fontWeight: 700, margin:0, padding:0}}><span style={{textTransform:"capitalize"}}>{data[0].paymentMethods.cardBrand}</span> ending in {data[0].paymentMethods.last4}</p>
                  <p style={{margin:0, padding:0}}>Expires: {data[0].paymentMethods.expMonth.toLocaleString('en-GB', {minimumIntegerDigits: 2, useGrouping:false})}/{data[0].paymentMethods.expYear}</p>
                </div>
                <div className="card-update">
                  <IonButton buttonType="link" className="link">Update</IonButton>
                </div>
              </div> 
            }

              {subscriptionStatus === 'active' && subscriptionCancelling && <IonButton className="button-tertiary" expand="block" size="small" onClick={ (e) => HandleReactivateSubscription(e) }>Reactivate Subscription</IonButton> }
              {subscriptionStatus === 'active' && !subscriptionCancelling && <IonButton className="button-tertiary" expand="block" size="small" onClick={ (e) => HandleCancelSubscription(e) }>Cancel Subscription</IonButton> }
              {subscriptionStatus !== 'active' && <IonButton className="button-tertiary" color="danger" expand="block" size="small" onClick={ (e) => history.push('/subscribe') }>Subscribe Now</IonButton> }

            </div>


            
            {dataPayments?.data?.length > 0 &&
            <h2 style={{textTransform: "uppercase", fontSize:"3em", margin: "40px 0 0 0", padding: 0 }}>Payments</h2> }

           {dataPayments?.data?.length > 0 && 
           <div className="payments">
              <div className="payment-row header">
                <div className="payment-column amount">Amount</div>
                <div className="payment-column date">Date</div>
                <div className="payment-column payment-method">Method</div>
                <div className="payment-column download-receipt">Receipt</div>
                <div className="payment-column status">Status</div>
              </div>
              {dataPayments?.data.map((payment:any) => {
               
                    return <div className="payment-row" key={payment.id}>

                              <div className="payment-column amount">
                                {getPrice(payment.amount_captured, payment.currency ) }
                              </div>
                              
                              
                              <div className="payment-column date">
                                { getDate(payment?.created) }
                              </div>

                              <div className="payment-column payment-method" style={{marginTop: "-4px"}}>
                              
                                <div className="card-logo">
                                  { React.createElement( CardLogos[payment.payment_method_details.card.brand] ) }
                                </div>
                                <div className="card-details">
                                    **{payment.payment_method_details.card.last4}
                                </div>
                              </div>
                              
                              <div className="payment-column download-receipt" style={{paddingTop: "3px"}}>
                                <a href={payment.receipt_url} download><IonIcon size="small" icon={document} /></a>
                              </div>

                              <div className="payment-column status">
                                {payment.paid && <div className="payment-status">Paid</div>}
                              </div>
                      
                    </div>
                } )
                
                }

              </div>

            }
            
            {/* <p>Customer ID: { data[0]?.stripeCustomerId }</p>
            <p>Subscription ID: { data[0]?.subscriptionId }</p>
            <p>Subscription Status: { data[0]?.subscriptionStatus }</p> */}

          </div>
          
          // : data[0]?.subscriptionStatus === 'active' ?
          
          // <p>Subscription Active</p>
          
          //   : data[0]?.subscriptionStatus === 'canceled' ?
          
          // <p>Subscription Canceled</p>
          
          //   : data[0]?.subscriptionStatus ?

          //   <p>Subscription { data[0]?.subscriptionStatus }</p>

          // : <div className="please-subscribe">
          //     <h2>Subscription</h2>
          //     <p>Subscribe now to start displaying your profile and sponsorship opportunities to potential sponsors!</p>
          //     <p>Choose your billing frequency:</p>
              
          //     <IonButton onClick={() => history.push('/subscribe') }>Subscribe now</IonButton>
                
              
          //   </div>


        // : 

        // <div className="not-subscribed">
        //   <p>You aren't yet subscribed.</p>
        //   <IonButton onClick={() => history.push('/subscribe') }>Subscribe now</IonButton>
        // </div>

        }
          

        </div>

      </IonContent>
    </IonPage>
  );
};

export default Subscription;
