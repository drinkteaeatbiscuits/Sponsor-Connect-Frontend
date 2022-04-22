import { IonButton, IonCol, IonGrid, IonIcon, IonInput, IonRow } from "@ionic/react";
import { link, logoFacebook, logoInstagram, logoTwitter, logoYoutube, close } from "ionicons/icons";
import React, { useEffect, useState } from "react";

interface props {
    achievements?: any,
    setAchievements: Function,
}

const AchievementsEdit: React.FC<props> = (props) => {

    const { achievements, setAchievements } = props;

    const [yourAchievements, setYourAchievements] = useState(achievements);

    const editAccolade = (e: any) => {

        // console.log(e);

        let accoladeIndex = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement);
        let newAccolades: Array<any> = [];
        newAccolades = newAccolades.concat(achievements);
        newAccolades[accoladeIndex] = e.target.value;

        setAchievements(newAccolades);

    }

    

    const addAccolade = (e: any) => {

        const newAccolades: Array<any> = achievements ? [...achievements] : new Array;

        // let newAccolades: Array<any> = [];
        newAccolades.push("");
        
        // achievements && achievements.length > 0 && newAccolades.push("");

        // !achievements && newAccolades.push("");


        setAchievements(newAccolades);
    }

    const removeAccolade = (e) => {
        const removeIndex = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement);
        
        const newAccolades: Array<any> = achievements ? [...achievements] : new Array;
        // console.log(removeIndex);
        newAccolades.splice(removeIndex, 1);
        setAchievements(newAccolades);
    }


    return <div>

        <div className="accolade-list">

            {achievements?.length > 0 && achievements.map((accolade: string, index: any) => {

                return <div className="accolade-field" key={index}>
                    <IonInput autocapitalize="words" placeholder="Your Achievement" value={accolade && accolade} id={"accolade-" + index} onIonChange={(e: any) => editAccolade(e)} />
                    <IonIcon icon={close} onClick={(e) => { removeAccolade(e); }} />
                </div>

            })

            } </div>

        <IonButton expand="block" size="small" className="button-tertiary" onClick={(e) => addAccolade(e)} >Add Accolade</IonButton>
    </div>
}

export default AchievementsEdit;