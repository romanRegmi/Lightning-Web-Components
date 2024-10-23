import { LightningElement } from 'lwc';
import LightningAlert from 'lightning/alert';

export default class LightningAlert extends LightningElement {
    async handleAlertClick(e) {
        const {name} = e.target;
        await LightningAlert.open({
            message: 'this is the alert message',
            theme: name, // a red theme intended for error states
            label: `I am ${name} Alert Handler`, // this is the header text
        });
        //Alert has been closed

        this.add(2, 5); 
        // If async/await keyords are not used, this will fire simultaneously with the handleAlertClick
        // if async/await is used, the code waits for the await to execute. Which in this case is for the user to close the alert popup.

    }

    add(x, y){
        console.log(x + y);
    }
}