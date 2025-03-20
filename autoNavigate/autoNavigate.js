import { LightningElement, api } from 'lwc';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class AutoNavigate extends LightningElement {
    @api delaySeconds = 3; // Default delay in seconds, configurable in Flow
    countdown;

    connectedCallback() {
        this.countdown = this.delaySeconds;
        // Start a countdown timer
        const interval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(interval);
                this.navigateNext();
            }
        }, 1000); // Update every second

        // Auto-navigate after the full delay
        setTimeout(() => {
            this.navigateNext();
        }, this.delaySeconds * 1000);
    }

    navigateNext() {
        // Dispatch the navigation event to move to the next screen
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
    }
}