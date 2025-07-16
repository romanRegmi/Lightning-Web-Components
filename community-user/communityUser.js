import { LightningElement, wire } from 'lwc';
import CURRENT_USER_ID from '@salesforce/user/Id';
import CONTACT_FIELD from '@salesforce/schema/User.ContactId'
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

export default class CommunityUserLWC extends LightningElement{

    @wire(getRecord, {recordId: CURRENT_USER_ID, fields: [CONTACT_FIELD]})
    userData;

    get userContactId(){
        return getFieldValue(this.userData.data, CONTACT_FIELD);
    }

    get isCommunityUser(){
        return this.userContactId ? true : false
    }
}