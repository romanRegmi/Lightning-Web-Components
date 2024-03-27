import { LightningElement } from 'lwc';

// Create a Custom Permission and add it to a PS. 
// import the custom permission
import hasAccessUI from '@salesforce/customPermission/myFirstCustomPermission';

export default class PermissionSetUI extends LightningElement {

    // use lwc:if 
    get isUIAccessible(){
        return hasAccessUI;
    }
}