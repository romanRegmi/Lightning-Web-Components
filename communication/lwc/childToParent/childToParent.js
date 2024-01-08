// parentComponent.js
import { LightningElement } from 'lwc';
 
export default class ParentComponent extends LightningElement {
  dataRecievedFromChild = ' '
  receivedEvent(event) {
    console.log('Event received from the child component');
    this.dataRecievedFromChild = event.detail
 
  }
}



// childComponent.js
import { LightningElement } from 'lwc';
 
export default class ChildComponent extends LightningElement {
 
  childInputText = ''
  childInputTextHandler(event) {
    this.childInputText = event.target.value
  }
 
  childClickHandler() {
    this.dispatchEvent(new CustomEvent('sendevent', {
      detail: this.childInputText
      /* you can place data in form of object also 
           detail: {
           msg: this.childInputText
          }
      */
    }))
  }
}