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

// import './billing.css';
import useMySubscription from '../../hooks/useMySubscription';
import { AnyARecord } from 'dns';
import useCancelMySubscription from '../../hooks/useCancelMySubscription';
import { useQueryClient, useMutation } from 'react-query';
import usePrices from '../../hooks/usePrices';
import getSymbolFromCurrency from 'currency-symbol-map';


export interface props {}

const Subscribe: React.FC = () => {

	// const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const history = useHistory();

  const mySubscription = useMySubscription();
    
  
  const [succeeded, setSucceeded] = useState<any>(false);
  const [error, setError] = useState<any>(null);
  const [processing, setProcessing] = useState<any>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const [clientSecret, setClientSecret] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState('');
  // const [customerId, setCustomerId] = useState('');


  const [selectedPrice, setSelectedPrice] = useState();


  const stripe = useStripe();
  const elements = useElements();

  
  
  const {isLoading: isLoadingPrices, data: dataPrices, isSuccess: isSuccessPrices, error: errorPrices} = usePrices();

  // console.log(selectedSubscription)

  // console.log();

  useEffect(() => {

       if(selectedPrice) { window
          .fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/subscriptions/create-customer", {
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
              
                // setClientSecret(data.subscription.latest_invoice.payment_intent.client_secret);

              }

            });
          
        });
    }

  }, [selectedPrice]);


  
  const CARD_OPTIONS = {
    // iconStyle: "solid",
    style: {
      base: {
        iconColor: "#c4f0ff",
        color: "#000",
        fontWeight: 500,
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": {
          color: "#fce883"
        },
        "::placeholder": {
          color: "#87bbfd"
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

          setError(`Payment failed ${result.error.message}`);
          setProcessing(false);

        } else {

          setError(null);
          setProcessing(false);
          setSucceeded(true);

          setSubscriptionStatus('active');

        }
      });
    }
  }


  const HandleCancelSubscription = async (event: any) => {

    event.preventDefault();

      const subscriptionResponse = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/subscriptions/cancel-subscription", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST", 
      });
        
        setSubscriptionStatus('cancelled');
        setSucceeded(false);
        setClientSecret('');

        history.push("/settings");

        return await subscriptionResponse.json();
    
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

        {isSuccessPrices &&

        <div className="select-plan ion-padding-bottom">

          {dataPrices?.data.map((element:any) => {

            return <div className={ selectedPrice === element.id ? "plan active" : "plan" } key={element.id} onClick={() => setSelectedPrice(element.id)}>
              
              <p><strong>Pay {element.recurring.interval === 'year' ? 'Annually' : 'Monthly'}</strong></p>
              
              <p>{getPrice(element.unit_amount, element.currency )} per {element.recurring.interval}</p>
            
              {element.metadata?.discount && <div className="discount"><small>{ element.metadata?.discount }</small></div>}

            </div>

          })}

        </div>

        }


        { selectedPrice &&  

         mySubscription.status === "success" && subscriptionStatus !== 'active' ?

        <form id="payment-form" onSubmit={handleSubmit}>

          <CardElement id="card-element" options={CARD_OPTIONS} onChange={handleChange} />

          <button
            disabled={processing || disabled || succeeded}
            id="submit"
          >
            <span id="button-text">
              {processing ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Pay now"
              )}
            </span>
          </button>

          {/* Show any error that happens when processing the payment */}
          {error && (
            <div className="card-error" role="alert">
              {error}
            </div>
          )}
          {/* Show a success message upon completion */}
          
          {succeeded && <p className={succeeded ? "result-message" : "result-message hidden"}>
            Payment succeeded, see the result in your
            <a
              href={`https://dashboard.stripe.com/test/payments`}
            >
              {" "}
              Stripe dashboard.
            </a> Refresh the page to pay again.
          </p> }

          
        </form>
        : 
        <div>
          <h2>Subscription Active</h2>
          
          <IonButton fill="clear" expand="full" onClick={ HandleCancelSubscription }>Cancel Subscription</IonButton>
          <IonButton fill="clear" expand="full" onClick={()=> history.push( "/settings/" )}>Back to Settings</IonButton>

        </div>
        }
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Subscribe;
