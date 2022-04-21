import React from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";

import tips from './tips.json';

interface props {
	descriptionSection: string,
	profileType: string
}

const DescriptionTips: React.FC<props> = (props) => {

	const { state: authState, dispatch } = React.useContext(AuthContext);
	const history = useHistory();
	const { descriptionSection, profileType } = props;


	// console.log(profileType);

	return <div className="" style={{padding: '8px 16px'}}>
			<p style={{fontSize: '0.95em'}}>These are some suggestions for key bits of information that potential sponsors may wish to know.</p>
			<p style={{fontSize: '0.95em'}}>Please feel free to expand on this as you see fit.</p>
			<ul style={{margin: '0', fontSize: '0.95em', padding: '8px 12px 8px 18px'}}>
				
			{ tips.map((tipsSection) => {
		
				if( tipsSection.profileType === profileType && tipsSection.descriptionSections ){

					return tipsSection.descriptionSections.map((tipsDescriptionSection) => {

						if( tipsDescriptionSection.descriptionSection === descriptionSection && tipsDescriptionSection.tips ) {

							return tipsDescriptionSection.tips.map((tip, index) => {

								if(Array.isArray(tip)){
									

									return <li key={tip + ' ' + index} style={{padding: '0 0 8px', fontWeight: 500}}>
										
										{ tip[0] }
										<ul style={{margin: '0', fontSize: '0.95em', padding: '8px 12px 2px 12px'}}>
											{ tip.map((tipSub, index) => {
												if(index > 0 ){
													return <li key={tipSub + ' ' + index} style={{padding: '0 0 8px', fontWeight: 500}}>{ tipSub }</li>
												}
											}) }
										</ul>
									</li>

								}else{
									
									return <li key={tip + ' ' + index} style={{padding: '0 0 8px', fontWeight: 500}}>{ tip }</li>

								}
								
								

							})
						}

					})
					
				}
				
			}) }


			</ul>



		</div>
  }

export default DescriptionTips;

