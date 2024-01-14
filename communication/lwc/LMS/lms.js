//Let’s create two Lightning Web Components (LWCs) that communicate with each other using the Lightning Message Service in Salesforce. 

// senderComponent.js
import { LightningElement, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import MESSAGE_CHANNEL from '@salesforce/messageChannel/MyMessageChannel__c';
 
export default class SenderComponent extends LightningElement {
    @track message = '';
 
    handleChange(event) {
        this.message = event.target.value;
    }
 
    sendMessage() {
        // Publish the message to the Lightning Message Service
        const payload = { message: this.message };
        publish(this.messageContext, MESSAGE_CHANNEL, payload);
    }
 
    // Get the message context for the Lightning Message Service
    messageContext = MessageContext;
}


// receiverComponent.js
import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import MESSAGE_CHANNEL from '@salesforce/messageChannel/MyMessageChannel__c';
 
export default class ReceiverComponent extends LightningElement {
    @track receivedMessage = '';
 
    @wire(MessageContext)
    messageContext;
 
    subscription;
 
    connectedCallback() {
        // Subscribe to the message channel
        this.subscription = subscribe(
            this.messageContext,
            MESSAGE_CHANNEL,
            (message) => {
                // Handle the received message
                this.handleMessage(message);
            }
        );
    }
 
    handleMessage(message) {
        this.receivedMessage = message ? message.message : '';
    }
 
    disconnectedCallback() {
        // Unsubscribe from the message channel when the component is destroyed
        unsubscribe(this.subscription);
    }
}