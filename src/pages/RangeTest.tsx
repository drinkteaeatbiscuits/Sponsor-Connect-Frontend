import { IonRange } from "@ionic/react";
import React, { useState } from "react";

interface RangeTestProps {
	
}
 
const RangeTest: React.FC<RangeTestProps> = () => {


	const [testBudget, setTestBudget] = useState<any>({ value: { lower: 0, upper: 8 }});

	  console.log(testBudget);

	return <div>
		<IonRange 
							
			onIonChange={(e) => { testBudget !== e.detail.value && setTestBudget(e.detail.value) }}
			
	  		debounce={50}
			dualKnobs={true}
			min={1}  
			max={8} 
			step={1}  
			snaps={true} color="primary" />
	</div>
}
 
export default RangeTest;