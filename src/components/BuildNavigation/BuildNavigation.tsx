import { IonButton } from "@ionic/react";

import useCheckProfileCompletion from "../../hooks/useCheckProfileCompletion";
import Arrow from "../../pages/CreateAccount/images/Arrow";

interface props {
	isFirst?: boolean, 
	isLast?: boolean,
	saveFieldName?: string, 
	saveFieldValue?: any, 
	className?: string,
	setStepNumber?: any,
	stepNumber?: any,
	saveField?: any,
}

const BuildNavigation: React.FC<props> = (props) => {

	const {mutateAsync: checkProfileCompletion} = useCheckProfileCompletion();
	
	const { isFirst, saveFieldName, saveFieldValue, className, setStepNumber, stepNumber, saveField, isLast } = props;

	return <div className={"build-navigation " + className} style={{display: 'flex', justifyContent: 'space-between', margin: '0 -12px'}}>

		{ !isFirst && <IonButton className="arrow previous" onClick={() => setStepNumber( stepNumber - 1 )} expand="block"><Arrow /></IonButton> }
		
		
		{ !isLast ? <IonButton button-type="link" size="small" onClick={() => setStepNumber( stepNumber + 1 )} expand="block">Skip</IonButton>
		
		: <IonButton className="restart" button-type="link" size="small" onClick={() => setStepNumber(0)} expand="block">Restart</IonButton>
		
		}
		
		<IonButton className="arrow primary-button" onClick={() => { 
				
				setStepNumber( stepNumber + 1 );
				saveField && saveField(saveFieldName, saveFieldValue); 

				!saveField && checkProfileCompletion();
			 
			 }} expand="block"><Arrow className="next-arrow" /></IonButton>

	</div>

  }

export default BuildNavigation;
