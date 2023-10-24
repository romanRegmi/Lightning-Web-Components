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
    try {
      let phone = getFieldValue(this.account.data, PHONE_FIELD);

      if (!phone) {
        throw new Error("Phone number not found on the record.");
      }

      let verificationResponse = await verifyPhone({ phone: phone });

      if (verificationResponse.phone_valid) {
        let msg =
          "This is a valid phone number from " +
          verificationResponse.phone_region +
          " having " +
          verificationResponse.carrier +
          " as carrier.";

        const evt = new ShowToastEvent({
          title: "Valid Phone Number",
          message: msg,
          variant: "success",
        });
        this.dispatchEvent(evt);
      } else {
        const evt = new ShowToastEvent({
          title: "Invalid Phone Number",
          message: "The phone number is not valid.",
          variant: "error",
        });
        this.dispatchEvent(evt);
      }
    } catch (error) {
      console.error("An error occurred:", error);

      const evt = new ShowToastEvent({
        title: "Error",
        message: "An error occurred while verifying the phone number.",
        variant: "error",
      });
      this.dispatchEvent(evt);
    }
  }
}
