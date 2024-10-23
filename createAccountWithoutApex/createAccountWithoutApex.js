import { LightningElement, wire } from 'lwc';
import ACCOUNT_RATING from '@salesforce/schema/Account.Rating';
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { createRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import LightningConfirm from "lightning/confirm";

export default class CreateAccountWithoutApex extends LightningElement {
    accountName;
    accRating;

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    accountObjectInfo;

    @wire(getPicklistValues, {
        fieldApiName: ACCOUNT_RATING,
        recordTypeId: '$accountObjectInfo.data.defaultRecordTypeId'
    })
    ratingPickListValue;

    handleChange(event) {
        this[event.target.name] = event.target.value;
        console.log('accountName ' + this.accountName);
        console.log('accRating ' + this.accRating);
    }

    saveAccount() {
        let inputFields = {}
        inputFields[ACCOUNT_NAME.fieldApiName] = this.accountName;
        inputFields[ACCOUNT_RATING.fieldApiName] = this.accRating;

        let recordInput = {
            fields: inputFields,
            apiName: ACCOUNT_OBJECT.objectApiName
        }


        createRecord(recordInput).then((result) => {
            this.ShowToastMessage('success', 'success', 'Account is Created Successfully');
            this.resetHandler();
        }).catch((error) => {
            this.ShowToastMessage('error', 'error', 'something went wrong');
        })
    }

    ShowToastMessage(title, variant, message) {
        const event = new ShowToastEvent({
            title: title,
            variant: variant,
            message: message
        })
        this.dispatchEvent(event);
    }

    resetHandler() {
        let inputFields = this.template.querySelectorAll('lightning-input. lightning-combobox');
        inputFields.forEach((currItem) => currItem.value = '');
    }

    async confirmHandler() {


        const result = await LightningConfirm.open({
            message: 'Are you sure you want to create this Account? Please confirm your action.',
            variant: 'header', // or 'plain' if you prefer a simpler Look
            label: 'Create Account Confirmation',
            theme: "success"// Add a success theme to make it visuatty attractive (though it may be subtle)
        });

        result ? this.saveAccount() : '';
    }
}