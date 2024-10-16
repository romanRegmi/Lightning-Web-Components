import { LightningElement} from "lwc";
export default class slotChild extends LightningElement {

    handleFooterChange() {

        // If slds-hide is not used, and even when the footer is not called, the footer component will take its space.
        // to prevent this, we hide the footer dynamically.
        const footerEle = this.template.querySelector('.slds-card__footer')
        if(footerEle){
            footerEle.classList.remove('slds-hide');
        }
    }
}
