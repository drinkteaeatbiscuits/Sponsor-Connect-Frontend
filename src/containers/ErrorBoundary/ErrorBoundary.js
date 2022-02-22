import React from 'react';
import {IonButton, IonIcon} from "@ionic/react";
import { constructOutline, thumbsUpOutline } from 'ionicons/icons';

class ErrorBoundary extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = { hasError: false, error: null, errorInfo: null, errorReported: false, hoverColor: 'var(--ion-color-dark)' };
	}
  
	static getDerivedStateFromError(error) {
	  // Update state so the next render will show the fallback UI.
	  return { hasError: true, error: error };
	}
  
	componentDidCatch(error, errorInfo) {
	  // You can also log the error to an error reporting service
	//   console.log(error, errorInfo);
	  
	}


	render() {


		const reportError = async () => {

			
			const sendSharedOpportunitiesResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/send-error-report', {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
				  error: this.state.error?.stack?.toString(),
				  location: window.location.href
				})
			  }).then((response) => {
				if (response.ok) {
				  return response.json();
				}
				return Promise.reject(response);
			  })
				.then((result) => {
					this.setState({errorReported: true});
				  // console.log(result);
				})
				.catch((error) => {
					this.setState({errorReported: false});
				  	this.setState({errorInfo: 'Unable to send report. If problem persists, please contact support@sponsor-connect.com'});
				  // console.log('Something went wrong.', error);
				});

		}

	  if (this.state.hasError) {
		// You can render any custom fallback UI
		// console.log(this.state.error, this.state.errorInfo);

		return <div className="error-boundary-message" style={{
			textAlign: "center",
			background: "repeating-linear-gradient( 45deg, #f1fbf8, #f1fbf8 10px, #FFFFFF 10px, #FFFFFF 25px )",
			padding: "32px 16px",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"

		}}>
			<div>
				<IonIcon icon={this.state.errorReported ? thumbsUpOutline : constructOutline} style={{fontSize: "4em", opacity: this.state.errorReported ? 0.8 : 0.3}} color="primary" />
				<p style={{fontSize: "1.4em", fontWeight: 700, color: "var(--ion-color-dark)", padding: 0, margin: 0}}>{this.state.errorReported ? "Thank You. Error Reported." : "Something went wrong."}</p>
				
				{this.state.errorReported ? <p style={{ padding: 0, margin: 0, fontSize: "0.9em"}}>If problem persists, please contact<br /> support@sponsor-connect.com</p> : <p onMouseEnter={() => {this.setState({ hoverColor: 'var(--ion-color-primary)' })}} onMouseLeave={() => {this.setState({ hoverColor: 'var(--ion-color-dark)' })}} onClick={() => reportError()} style={{ padding: 0, margin: 0, fontSize: "0.9em", cursor: 'pointer', color: this.state.hoverColor}}>Report this problem</p> }
			
				{ this.state.errorInfo && <p style={{fontSize: '0.9em', maxWidth: '360px'}}>{this.state.errorInfo}</p> }
			</div>
		</div>
		
	  }
  
	  return this.props.children; 
	}
  }

  export default ErrorBoundary;