import { ReactComponent as Visa } from './images/visa.svg';
import { ReactComponent as Amex } from './images/amex.svg';
import { ReactComponent as Jcb } from './images/jcb.svg';
import { ReactComponent as Maestro } from './images/maestro.svg';
import { ReactComponent as Mastercard } from './images/mastercard.svg';
import { ReactComponent as Discover } from './images/discover.svg';
import { ReactComponent as Diners } from './images/diners.svg';

let CardLogos:any = {};

    CardLogos['visa'] = Visa;
    CardLogos['mastercard'] = Mastercard;
    CardLogos['amex'] = Amex;
    CardLogos['jcb'] = Jcb;
    CardLogos['maestro'] = Maestro;
    CardLogos['discover'] = Discover;
    CardLogos['diners'] = Diners;


export default CardLogos;

