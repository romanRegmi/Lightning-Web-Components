// Parent Component

import {LightningElement} from 'lwc';

export default class P2cParentComponent extends LightningElement {
   percentage = 10;
   changeHandler(e){
    this.percentage = e.target.value;
   }
}




// Child component
import {LightningElement, api} from 'lwc';

export default class P2cProgressComponent extends LightningElement {
    @api progressValue;
}
