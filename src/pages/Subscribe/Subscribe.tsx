import { IonButton, IonContent, IonIcon, IonPage, IonSpinner, IonToast } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import { loadStripe } from "@stripe/stripe-js";
import {CardElement, useStripe, Elements, useElements} from '@stripe/react-stripe-js';

import './Subscribe.scss';
import useMySubscription from '../../hooks/useMySubscription';
import usePrices from '../../hooks/usePrices';
import getSymbolFromCurrency from 'currency-symbol-map';
import { newspaper, personCircle, settings, trailSign } from 'ionicons/icons';


export interface props {} 

const Subscribe: React.FC = () => {

	// const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const history = useHistory();

//   const mySubscription = useMySubscription();
    
  const [succeeded, setSucceeded] = useState<any>(false);
  const [error, setError] = useState<any>(null);
  const [processing, setProcessing] = useState<any>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const [clientSecret, setClientSecret] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [selectedCost, setSelectedCost] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [activatingSubscription, setActivatingSubscription] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  // const [customerId, setCustomerId] = useState('');

  const [selectedPrice, setSelectedPrice] = useState();
  const stripe = useStripe();
  const elements = useElements();

  const [refetchInterval, setRefetchInterval] = useState<any>(false);
//   const [expectedStatus, setExpectedStatus] = useState("");
  
  const {isLoading: isLoadingPrices, data: dataPrices, isSuccess: isSuccessPrices, error: errorPrices} = usePrices(authState?.user?.currency.toLowerCase());

  const {isLoading, data: mySubscription, isSuccess, error: errorMySubscription, refetch: refetchMySubscription } = useMySubscription(refetchInterval);
  // console.log(selectedSubscription)

  // console.log();

  useEffect(() => {

        if(isSuccess && mySubscription[0]?.subscriptionStatus === 'active'){
            
            setRefetchInterval(false) 
            setSucceeded(false);
            setSelectedPrice(undefined);

        } 
        isSuccess && setSubscriptionStatus(mySubscription[0]?.subscriptionStatus);

       if(isSuccess && subscriptionStatus !== 'active' && selectedPrice && !subscriptionId) { 

         window.fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/subscriptions/create-customer", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
              email: authState.user.email,
            })
          })

          .then(res => {
            
            return res.json();

          })
          .then(data => {

            fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/subscriptions/create-subscription", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                customerId: data.customer?.id,
                priceId: selectedPrice
              })
            })
            .then(res => {

              return res.json();

            })
            .then(data => {
              
              if(data.subscription?.status === "succeeded"){
                
                setSucceeded(true);
              
              }else{

                console.log('not succeeded');
                console.log(data);
                setSubscriptionId(data.subscription.id);
                setClientSecret(data.subscription.latest_invoice.payment_intent.client_secret);

              }

            });
          
        });
    }

  }, [authState.user.email, mySubscription, isSuccess, selectedPrice, subscriptionId]);


  
  const CARD_OPTIONS = {
    // iconStyle: "solid",
    style: {
      base: {
        iconColor: "#c4f0ff",
        backgroundColor: '#fff',
        padding: "10px",
        color: "#3A3939",
        fontWeight: 500,
        fontFamily: 'neue-haas-unica, sans-serif',
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": {
          color: "#fce883"
        },
        "::placeholder": {
          color: "#B1B1B1"
        }
      },
      invalid: {
        iconColor: "#ffc7ee",
        color: "#ffc7ee"
      }
    }
  };

  const handleChange = async (event: any) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };


  const handleSubmit = async (event: any) => {
    
    event.preventDefault();
    // const nameInput = document.getElementById('name');

    setProcessing(true);
    setError("");

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
  
    const cardElement = elements.getElement(CardElement);

    if(cardElement){
      // Create payment method and confirm payment intent.
      stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      }).then((result) => { 
        if(result.error) {

          setError(`Payment failed - ${result.error.message}`);
          setProcessing(false);

        } else {

          setError(null);
          setProcessing(false);
          setSucceeded(true);

          setActivatingSubscription(true);
          
        //   setSubscriptionStatus('active');

          setRefetchInterval(2000);
          refetchMySubscription();

        }
      });
    }
  }




    const getPrice = (price:any, currency:any) => {

      return getSymbolFromCurrency(currency) + (Math.round(price) / 100).toFixed(2);
    }

    // console.log(processing);
    // console.log(disabled);
    // console.log(succeeded);

  return (
    <IonPage>
      <TabBar activeTab="settings"/>
      <IonContent className="ion-padding" fullscreen >

      <IonToast
        isOpen={error ? true : false}
        color="danger"
        translucent={true}
        onDidDismiss={() => console.log('test')}
        message={error}
        duration={0}
      />
        <div className="content subscribe-content"> 

        
        <h1 className="" style={{color: 'var(--ion-color-dark)'}}>{subscriptionStatus === 'active' ? "SUBSCRIBED" : "SUBSCRIBE" }</h1>

        { refetchInterval && <div className=""><IonSpinner name="dots" color="primary" /><p>Setting up subscription</p></div> }
        
        {isSuccess && isSuccessPrices && subscriptionStatus !== 'active' && !refetchInterval &&

        <div className="select-plan">

          <p style={{fontSize: '1.2em', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--ion-color-dark)'}}>Choose your billing frequency</p>

            <div className="price-plans">
          {dataPrices?.data.map((element:any) => {

            return <div className={ selectedPrice === element.id ? "plan active" : "plan" } key={element.id} 
                        onClick={(e) => { 
                          
                          !(e.currentTarget as Element).classList.contains("active") && 
                            
                            setSelectedPrice(element.id); 
                            setSubscriptionId(""); 
                            setClientSecret("");
                            setSelectedCost( getPrice(element.unit_amount, element.currency ) );
                            setSelectedFrequency( element.recurring.interval );
                        
                        }}>
              
              <div className="selected-circle"></div>

              <div className="plan-cost">
                <p style={{margin: 0, padding: 0, fontSize: '1.1em', lineHeight: 1, letterSpacing: '-0.01em', color: 'var(--ion-color-dark)'}}><strong>{getPrice(element.unit_amount, element.currency )} per {element.recurring.interval}</strong></p>
                <p style={{margin: 0, padding: '5px 0 0', lineHeight: 1, fontSize: '0.95em', fontWeight: 500, color: 'var(--ion-color-medium)'}}>Pay {element.recurring.interval === 'year' ? 'Annually' : 'Monthly'}</p>
              </div>
              
            
              {element.metadata?.discount && <div className="discount"><small>{ element.metadata?.discount }</small></div>}

            </div>

          })}

          </div>

        </div>

        }

        {isSuccess && subscriptionStatus !== 'active' && isSuccessPrices && selectedPrice && !refetchInterval &&
        <div className="billing-details">
          <p style={{fontSize: '1.2em', fontWeight: 700, letterSpacing: '-0.01em', paddingTop: '15px', color: 'var(--ion-color-dark)'}}>Billing details</p>
          <div className="billing-details-table">
            <div className="billing-row billing-item">
              <div className="billing-columm quantity">1 x</div>
              <div className="billing-columm description" style={{letterSpacing: '-0.01em'}}>Sponsor Connect Subscription</div>
              <div className="billing-columm price"><p>{selectedCost}</p><p className="frequency">every { selectedFrequency }</p></div>
            </div>
            <div className="billing-row tax">
              <div className="billing-columm tax">VAT</div>
              <div className="billing-columm tax-price">£0.00</div>
            </div>
            <div className="billing-row total">
              <div className="billing-columm total">Total</div>
              <div className="billing-columm total-price">{selectedCost}</div>
            </div>
          </div>
        </div> }
        {/* {console.log(selectedPrice)}
        {console.log(mySubscription?.status)}
        {console.log(subscriptionStatus)} */}

        { isSuccess && mySubscription[0]?.subscriptionStatus !== 'active' && selectedPrice && subscriptionStatus !== 'active' && subscriptionId && clientSecret && !refetchInterval &&
        <div className="payment-details">
          <p style={{fontSize: '1.2em', fontWeight: 700, letterSpacing: '-0.01em', paddingTop: '15px', color: 'var(--ion-color-dark)'}}>Payment details</p>
          
          <form id="payment-form" onSubmit={handleSubmit}>

            <CardElement id="card-element" options={CARD_OPTIONS} onChange={handleChange} />


            {/* <IonButton buttonType="submit" id="submit" className="primary-button" color="primary" disabled={processing || disabled || succeeded} expand="block">Pay and Subscribe</IonButton> */}
                
            <button
              className="pay-button primary-button ion-color-primary button-block"
              disabled={processing || disabled || succeeded}
              id="submit"
            >
              <span id="button-text">
                {processing ? (
                  <IonSpinner name="dots" color="light" />
                ) : (
                  "Pay and Subscribe"
                )}
              </span>
            </button>

            {/* Show any error that happens when processing the payment */}
            {/* {error && (
              <div className="card-error" role="alert">
                {error}
              </div>
            )} */}
            
          </form>
        </div>
        }

         {isSuccess && mySubscription[0]?.subscriptionStatus === 'active' && <div className="subscription-active">
         
         <p style={{fontSize: '1.2em', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--ion-color-dark)'}}>Thank you for subscribing!</p>

         <div className="menu-list ion-padding-top ion-margin-top ion-margin-bottom ion-padding-bottom">
          
            <div className="menu-list-option ion-margin-top"
              onClick={() => history.push("/profile/" + authState?.user?.profile)}>
              <div className="icon">
                <IonIcon color="primary" icon={personCircle} />
              </div>
              <div className="text">
                <p className="main-text">Your Profile</p>
                <p className="sub-text">View and edit your profile</p>
              </div>
            </div>

            <div className='menu-list-option'
              onClick={() => history.push("/opportunities/" + authState?.user?.profile)}>
              <div className="icon">
                <IonIcon color="primary" icon={trailSign} />
              </div>
              <div className="text">
                <p className="main-text">Your Opportunities</p>
                <p className="sub-text">Manage your sponsorship opportunities </p>
              </div>
            </div>

            <div className='menu-list-option'
              onClick={() => history.push("/the-dugout/")}>
              <div className="icon">
                <IonIcon color="primary" icon={newspaper} />
              </div>
              <div className="text">
                <p className="main-text">The Dugout</p>
                <p className="sub-text">Tips and information about sponsorship</p>
              </div>
            </div>

            <div className='menu-list-option'
              onClick={() => history.push("/settings/")}>
              <div className="icon">
                <IonIcon color="primary" icon={settings} />
              </div>
              <div className="text">
                <p className="main-text">Settings</p>
                <p className="sub-text">Update account, billing &amp; notifications</p>
              </div>
            </div>

            <LogoutButton className="logout-button button-tertiary ion-margin-bottom" expand="block" size="small" />

          </div>

          

        </div>

        }
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Subscribe;
