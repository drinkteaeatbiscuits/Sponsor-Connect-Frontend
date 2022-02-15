import React from 'react';
import {IonButton, IonIcon} from "@ionic/react";
import { constructOutline } from 'ionicons/icons';

class ErrorBoundary extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = { hasError: false, error: null, errorInfo: null, errorReported: false };
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
		const reportError = () => {
			this.setState({errorReported: true});

			console.log(this.state.error);

		}

	  if (this.state.hasError) {
		// You can render any custom fallback UI
		console.log(this.state.error, this.state.errorInfo);
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
				<IonIcon icon={constructOutline} style={{fontSize: "4em", opacity: 0.3}} color="primary" />
				<p style={{fontSize: "1.4em", fontWeight: 700, color: "var(--ion-color-dark)", padding: 0, margin: 0}}>Something went wrong.</p>
				{this.state.errorReported ? <p style={{ padding: 0, margin: 0, fontSize: "0.9em"}}>Error reported, thank you.</p> : <p onClick={() => reportError()} style={{ padding: 0, margin: 0, fontSize: "0.9em"}}>Report this problem</p> }
			</div>
		</div>
		
	  }
  
	  return this.props.children; 
	}
  }

  export default ErrorBoundary;