// pubSubCompA.js
 
import { LightningElement } from 'lwc';
import pubSubService from 'c/pubSubService';
 
export default class PubsubCompA extends LightningElement {
  compAMessage = ''
  inputTextHandler(event) {
    this.compAMessage = event.target.value
  }
  publishHandler() {
    pubSubService.publish('messageFromCompA', this.compAMessage)
    console.log('published Comp A');
  }
}

// pubSubCompB.js
 
import { LightningElement } from 'lwc';
import pubSubService from 'c/pubSubService';
 
export default class PubsubCompB extends LightningElement {
  messageData = ''
  connectedCallback() {
    this.subscribeComponent()
  }
  subscribeComponent() {
    pubSubService.subscribe('messageFromCompA', (message) => {
      this.messageData = message
    })
  }
}