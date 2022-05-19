import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import React, { useState } from "react";
import { IonReactRouter } from '@ionic/react-router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import TagManager from 'react-gtm-module';

import Login from './pages/Login/Login';
import CreateAccount from './pages/CreateAccount/CreateAccount';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/app.scss';

import { useEffect } from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import Profiles from './pages/Profiles/Profiles';
import Profile from './pages/Profile/Profile';
import Opportunities from './pages/Opportunities/Opportunities';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile/EditProfile';
import Billing from './pages/Billing';
import Account from './pages/Account/Account';

import Subscription from './pages/Subscription/Subscription';
import Landing from './pages/Landing/Landing';
import Opportunity from './pages/Opportunity/Opportunity';
import OnBoardingSport from './pages/OnBoardingSport/OnBoardingSport';
import OnBoardingBusiness from './pages/OnBoardingBusiness/OnBoardingBusiness';
import AddOpportunity from './pages/Opportunity/AddOpportunity';
import EditOpportunity from './pages/Opportunity/EditOpportunity';
import CreateAccountBusiness from './pages/CreateAccountBusiness/CreateAccountBusiness';
import SearchOpportunities from './pages/SearchOpportunities/SearchOpportunities';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Subscribe from './pages/Subscribe/Subscribe';
import ProfileImages from './pages/ProfileImages/ProfileImages';
import EditProfileDescription from './pages/EditProfile/EditProfileDescription';

import Geocode from "react-geocode";
import NotificationSettings from './pages/NotificationSettings/NotificationSettings';
import Notifications from './components/Notifications/Notifications';
import BookConsultation from './pages/BookConsultation/BookConsultation';
import DashboardBusiness from './pages/DashboardBusiness/DashboardBusiness';
import Favourites from './pages/Favourites/Favourites';
import DugoutArticles from './pages/DugoutArticles/DugoutArticles';
import DugoutArticle from './pages/DugoutArticle/DugoutArticle';
import DugoutCategories from './pages/DugoutCategories/DugoutCategories';
import useMySubscription from './hooks/useMySubscription';
import PleaseSubscribe from './pages/PleaseSubscribe/PleaseSubscribe';
import ScrollToTop from './components/ScrollTop/ScrollTop';
import { HelmetProvider } from 'react-helmet-async';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import Subscriptions from './pages/Admin/Subscriptions/Subscriptions';
import Users from './pages/Admin/Users/Users';
import Discounts from './pages/Admin/Discounts/Discounts';
import BuildProfile from './pages/Build Profile/BuildProfile';
import AdminSettings from './pages/Admin/Settings/AdminSettings';
import ProfileExamples from './pages/ProfileExamples/ProfileExamples';
import useProfiles from './hooks/useProflies';
import Protected from './components/Protected/Protected';
import LoggedIn from './components/LoggedIn/LoggedIn';
import WhichDashboard from './components/WhichDashboard/WhichDashboard';
import WhichSettings from './components/WhichSettings/WhichSettings';
import LoggedInAdmin from './components/LoggedInAdmin/LoggedInAdmin';
import SubscriptionNeeded from './components/SubscriptionNeeded/SubscriptionNeeded';
 

const tagManagerArgs = {
  gtmId: 'GTM-K6H3NN8' 
}

process.env.NODE_ENV === "production" && TagManager.initialize(tagManagerArgs)


Geocode.setApiKey(process.env.REACT_APP_GEOCODE_API_KEY);

let stripePK = "";
process.env.REACT_APP_STRIPE_PK && (stripePK = process.env.REACT_APP_STRIPE_PK);
const stripePromise = loadStripe(stripePK);

export const AuthContext = React.createContext<{
  state?: any;
  dispatch?: React.Dispatch<any>;
}>({});

const initialState = {
  isAuthenticated: false,
  user: null,
  currentLocation: null,
  profile: null,
  mySubscription: {}
};

const reducer = (state: any, action: any) => {

  switch (action.type) {
    case "LOGIN":
      let isAuthenticated = false;
      action.payload.status = "Authenticated" ? isAuthenticated = true : isAuthenticated = false;
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "LOGOUT":
      // localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case "setUser": {
      let isAuthenticated = false;
      action.payload.status = "Authenticated" ? isAuthenticated = true : isAuthenticated = false;
      return {
        ...state,
        isAuthenticated: isAuthenticated,
        user: action.payload.user,
      }
    }
    case "setSubscription": {
      state.mySubscription.subscriptionStatus = action.payload
      return {
        ...state,
      }
    }
    case "setFavouriteProfiles": {
      state.user.favouriteProfiles = action.payload
      return {
        ...state 
      }
    }
    case "setFavouriteOpportunities": {
      state.user.favouriteOpportunities = action.payload
      return {
        ...state 
      }
    }
    case "setSavedSearches": {
      state.user.savedSearches = action.payload
      return {
        ...state 
      }
    }
    case "setSearchNow": {
      state.user.searchNow = action.payload
      return {
        ...state 
      }
    }
    case "setCurrentLocation": {
      state.currentLocation = action.payload
      return {
        ...state 
      }
    }
    case "viewedProfile": {
      state.user.viewedProfiles = action.payload
      return {
        ...state 
      }
    }
    case "updateProfileComplete": {
      // console.log(action.payload);
      state.user.profileComplete = action.payload.profileComplete
      state.user.profileCompletionList = action.payload.profileCompletionList
      return {
        ...state 
      }
    }

    default:

    return state;
  }
};



const checkIfAuthenticated = async () => {

  const loginResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/profiles/auth", {
    method: "GET",
    credentials: "include",
  });

  const profileInfo = await loginResp.json();

  return profileInfo?.statusCode ? false : profileInfo;

}



const App: React.FC = () => {

  const getLocationPlaceName = (lat, long) => {

    setCheckingLocationPlaceName(true);

		Geocode.fromLatLng(lat, long).then(
			(response) => {
			const address = response.results[0].formatted_address;
			let city, state, country;
			for (let i = 0; i < response.results[0].address_components.length; i++) {
				for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
				switch (response.results[0].address_components[i].types[j]) {
					case "locality":
					city = response.results[0].address_components[i].long_name;
					break;
					case "administrative_area_level_1":
					state = response.results[0].address_components[i].long_name;
					break;
					case "country":
					country = response.results[0].address_components[i].long_name;
					break;
				}
				}
			}

			setFromLocation({ ...fromLocation, "city": city});
			
			},
			(error) => {
				console.error(error);
			}
		);
	}

  const doesLocationCookieExist = () => {

    if (document.cookie.split(';').some((item) => item.trim().startsWith('user_location='))) {
      return true;
    }
    return false;

  }

  const {isLoading, data: profilesData, isSuccess, error} = useProfiles(true);

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [wasUserHere, setWasUserHere] = useState<any>("");
  const [currentLocation, setCurrentLocation] = useState<any>("");
  const [fromLocation, setFromLocation] = useState<any>({});
  const [checkUser, setCheckUser] = useState<any>(false);
  const [checkingLocation, setCheckingLocation] = useState<any>(false);
  const [checkingLocationPlaceName, setCheckingLocationPlaceName] = useState<any>(false);
  const { data: mySubscription, isSuccess: subscriptionSuccess, error: subscriptionError, refetch: refetchMySubscription } = useMySubscription();

  const [activeSubscription, setActiveSubscription] = useState(false);
  const [accountType, setAccountType] = useState('');

  // console.log(activeSubscription);

  const subscriptionActive = () => {
    if(state?.mySubscription?.subscriptionStatus === 'active'){
      setActiveSubscription(true);
    }else{
      setActiveSubscription(false);
    } 
  }
  
  const businessAccount = () => {
    if(state?.user?.accountType && state?.user?.accountType === 'Business'){
      setAccountType('Business');
    }else{
      setAccountType('');
    } 
  }

  

  useEffect(() => {

    !wasUserHere && checkIfAuthenticated().then( (data) => { 
      
      setWasUserHere(data); 
      setCheckUser(true); 
      refetchMySubscription();

    } );


    subscriptionSuccess && mySubscription.length > 0 && (state.mySubscription = mySubscription[0]);

    subscriptionActive();

    businessAccount();

    !doesLocationCookieExist() && !checkingLocation && currentLocation.length <= 0 && navigator.geolocation.getCurrentPosition(function(position) {
    
      setCurrentLocation([
        {"lat": position.coords.latitude, "long": position.coords.longitude}
      ]);
    
      setFromLocation( { lat: position.coords.latitude, long: position.coords.longitude } );

      setCheckingLocation(true);

    });

    !doesLocationCookieExist() && !checkingLocationPlaceName && Object.keys(fromLocation).length > 0 && !fromLocation.city && getLocationPlaceName(fromLocation.lat, fromLocation.long);

    !doesLocationCookieExist() && Object.keys(fromLocation).length > 0 && fromLocation.city && (initialState.currentLocation = fromLocation);

    !doesLocationCookieExist() && Object.keys(fromLocation).length > 0 && fromLocation.city && (document.cookie = "user_location=" + JSON.stringify({lat: fromLocation.lat, long: fromLocation.long, city: fromLocation.city }) + ";max-age=" + 60*60*24 );

    // doesLocationCookieExist() && Object.keys(fromLocation).length <= 0 && setFromLocation(JSON.parse( document.cookie.split('; ').find(row => row.startsWith('user_location='))?.split('=')[1] || "" ));
    
    doesLocationCookieExist() && (initialState.currentLocation = JSON.parse( document.cookie.split('; ').find(row => row.startsWith('user_location='))?.split('=')[1] || "" ));

  }, [currentLocation, fromLocation, state.isAuthenticated, doesLocationCookieExist(), mySubscription, state.mySubscription]);

  wasUserHere && (initialState.isAuthenticated = true);
  wasUserHere && (initialState.user = wasUserHere);

  // console.log(wasUserHere);
  // console.log(state?.user && state?.user?.role.type === 'admin' )
  // console.log(state.isAuthenticated )

  // console.log(location);
  // let location = useLocation();

  // console.log(location.pathname);

  // location?.pathname !== '' &&
// { console.log(profilesData && profilesData.map(a => a.slug) )}

  let profileSlugs: string[] = [];

  if(isSuccess){
    for( var i=0; i<profilesData?.length; i++ ){

      profilesData[i].slug && profileSlugs.push( profilesData[i].slug );
      
    }
  }

  // console.log(profileSlugs);

  // const location = useLocation();
 

  return (
    <HelmetProvider>  
    <IonApp>
      <Elements stripe={stripePromise}>

        <AuthContext.Provider
          value={{
            state,
            dispatch
          }}
        >
          
          <IonReactRouter>
           
            { state?.user?.profile && <Notifications /> }

            <ScrollToTop />

            <IonRouterOutlet animated={false}>

            <Switch>

            
              <Route exact path="/" component={() => <Landing />} />
              
              <Route exact path="/dashboard" component={() => <WhichDashboard isLoggedIn={state.isAuthenticated} hasProfile={ state?.user?.profile } isAdmin={state?.user?.role.type === 'admin'}  ></WhichDashboard>} />
              
             

              <Route exact path="/sports" component={() => <LoggedIn isLoggedIn={state.isAuthenticated}><OnBoardingSport /></LoggedIn>} />
              <Route exact path="/business" component={() => <LoggedIn isLoggedIn={state.isAuthenticated}><OnBoardingBusiness /></LoggedIn>} />
              <Route exact path="/landing" component={() => <LoggedIn isLoggedIn={state.isAuthenticated}><Landing /></LoggedIn>} />
              <Route exact path="/create-account-sports" component={() => <LoggedIn isLoggedIn={state.isAuthenticated}><CreateAccount /></LoggedIn>} />
              <Route exact path="/create-account-business" component={() => <LoggedIn isLoggedIn={state.isAuthenticated}><CreateAccountBusiness /></LoggedIn>} />
              <Route exact path="/login" component={() => <LoggedIn isLoggedIn={state.isAuthenticated}><Login /></LoggedIn>} />

              {
                // Unprotected Routes
              }

              <Route exact path="/profile/view/:id" component={() => <Profile />} />
              <Route exact path="/profile/:id" component={() => <Profile />} />
              <Route exact path="/opportunities/:id" component={() => <Opportunities />} />
              <Route exact path="/opportunity/:id" component={() => <Opportunity />} />
              <Route exact path="/reset-password" component={() => <ResetPassword/>} />
              <Route exact path="/forgot-password" component={() => <ForgotPassword/>} />
              
              {
                // Protected Routes
              }

              <Route exact path="/favourites" component={() => <Protected isLoggedIn={state.isAuthenticated}><Favourites /></Protected>} />
              <Route exact path="/profile/:id/edit" component={() => <Protected isLoggedIn={state.isAuthenticated}><EditProfile /></Protected>} />
              <Route exact path="/profile/:id/build" component={() => <Protected isLoggedIn={state.isAuthenticated}><BuildProfile /></Protected>} />
              <Route exact path="/manage-profile-images" component={() => <Protected isLoggedIn={state.isAuthenticated}><ProfileImages /></Protected>} />
              <Route exact path="/edit-profile-description" component={() => <Protected isLoggedIn={state.isAuthenticated}><EditProfileDescription /></Protected>} />
              <Route exact path="/add-opportunity/:id" component={() => <Protected isLoggedIn={state.isAuthenticated}><AddOpportunity /></Protected>} />
              <Route exact path="/edit-opportunity/:id" component={() => <Protected isLoggedIn={state.isAuthenticated}><EditOpportunity /></Protected>} />
              <Route exact path="/search-opportunities" component={() => <Protected isLoggedIn={state.isAuthenticated}><SearchOpportunities /></Protected>} />
              <Route exact path="/settings/billing" component={() => <Protected isLoggedIn={state.isAuthenticated}><Billing /></Protected>} />
              <Route exact path="/subscribe" component={() => <Protected isLoggedIn={state.isAuthenticated}><Subscribe /></Protected>} />
              <Route exact path="/settings/subscription" component={() => <Protected isLoggedIn={state.isAuthenticated}><Subscription /></Protected>} />
              <Route exact path="/settings/account" component={() => <Protected isLoggedIn={state.isAuthenticated}><Account /></Protected>} />
              <Route exact path="/settings/notifications" component={() => <Protected isLoggedIn={state.isAuthenticated}><NotificationSettings /></Protected>} />
              <Route exact path="/example-profiles" component={() => <Protected isLoggedIn={state.isAuthenticated} ><ProfileExamples /></Protected>} />
              <Route exact path="/profiles" component={() => <Protected isLoggedIn={state.isAuthenticated}><Profiles /></Protected>} />
              <Route exact path="/book-consultation" component={() => <Protected isLoggedIn={state.isAuthenticated}><BookConsultation /></Protected>} />
              
              <Route exact path="/settings" component={() => <WhichSettings isLoggedIn={state.isAuthenticated} isAdmin={state?.user?.role.type === 'admin'}><Settings /></WhichSettings>} />
              
              <Route exact path="/subscriptions" component={() => <LoggedInAdmin isLoggedIn={state.isAuthenticated} isAdmin={state?.user?.role.type === 'admin'}><Subscriptions /></LoggedInAdmin>} />
              <Route exact path="/dashboard/users" component={() => <LoggedInAdmin isLoggedIn={state.isAuthenticated} isAdmin={state?.user?.role.type === 'admin'}><Users /></LoggedInAdmin>} />
              <Route exact path="/discounts" component={() => <LoggedInAdmin isLoggedIn={state.isAuthenticated} isAdmin={state?.user?.role.type === 'admin'}><Discounts /></LoggedInAdmin>} />
              
              
              <Route exact path="/the-dugout" component={() => <SubscriptionNeeded 
              isLoggedIn={state.isAuthenticated} 
              isAdmin={state?.user?.role.type === 'admin'}
              isBusiness={ accountType === "Business" }
              activeSubscription={ activeSubscription }
              ><DugoutArticles /></SubscriptionNeeded>} />

              <Route exact path="/the-dugout-categories" component={() => <SubscriptionNeeded 
              isLoggedIn={state.isAuthenticated} 
              isAdmin={state?.user?.role.type === 'admin'}
              isBusiness={ accountType === "Business" }
              activeSubscription={ activeSubscription }
              ><DugoutCategories /></SubscriptionNeeded>} />


              <Route exact path="/the-dugout/:slug" component={() => <SubscriptionNeeded 
              isLoggedIn={state.isAuthenticated} 
              isAdmin={state?.user?.role.type === 'admin'}
              isBusiness={ accountType === "Business" }
              activeSubscription={ activeSubscription }
              ><DugoutArticle /></SubscriptionNeeded>} />
              
              
              <Route exact path="/:slug" component={() => <Profile />} />
              
              
              <Route>
                <ErrorPage />
              </Route>
              
              </Switch>

            </IonRouterOutlet>
          </IonReactRouter>

        </AuthContext.Provider>
        
      </Elements>
    </IonApp>
    </HelmetProvider>
  )
};

export default App;
