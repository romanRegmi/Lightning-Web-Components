import { LightningElement, api, wire } from "lwc";
import verifyPhone from "@salesforce/apex/VeriPhoneController.verifyPhone";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import PHONE_FIELD from "@salesforce/schema/Account.Phone";

const fields = [PHONE_FIELD];

export default class VeriPhoneLWC extends LightningElement {
  @api recordId;
  @wire(getRecord, { recordId: "$recordId", fields })
  account;
  @api async invoke() {
    let phone = getFieldValue(this.account.data, PHONE_FIELD);
    let verificationResponse = await verifyPhone({ phone: phone });
    let valid = verificationResponse.phone_valid;
    if(valid) {
        let msg =
            "This is a valid phone number from " + verificationResponse.phone_region + " having " + verificationResponse.carrier + " as carrier.";
            const evt = new ShowToastEvent({
                title: "Valid Phone Number",
                message: msg,
                variant: "success"
            });
            this.dispatchEvent(evt);
    } else {
          const evt = new ShowToastEvent({
            title: "Error",
            message: "Noa a valid phone number !",
            variant: "error"
          });
          this.dispatchEvent(evt);
        }
  }
}