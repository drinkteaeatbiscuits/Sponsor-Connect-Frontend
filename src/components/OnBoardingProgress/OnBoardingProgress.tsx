import { IonImg } from "@ionic/react";
import { CircularProgressbar } from "react-circular-progressbar";

import fooballer from './images/footballer@2x.png';

interface OnBoardingProgressProps {
	percentage: number;
}

const OnBoardingProgress: React.FC<OnBoardingProgressProps> = ({ percentage = 0 }: OnBoardingProgressProps ) => {

	// const history = useHistory();

	return <div className="progress-circle" style={{ 
		// width: 250, 
		// height: 250,
		// backgroundColor: "#fff",
		borderRadius: "150px",
		padding: "10px" }}>
		<CircularProgressbar value={percentage}
		background={true}
		styles={{
		  root: {},
		  path: {
			stroke: `#10B59B`,

		  },
		  trail: {
			stroke: '#F5F5F5',
			strokeWidth: '2px',
		  },
		  background: {
			fill: '#fff',
		  },
		}}
		 />
		 <IonImg src={fooballer} />
		 
	  </div>;

}


export default OnBoardingProgress;
