import { LightningElement } from 'lwc';
export default class PasswordValidation extends LightningElement {
    showValidation;
    passwordValue = '';
    handleFocus() {
        this.showValidation = true;
    }

    handleBlur() {
        this.showValidation = false;
    }

    get isLowerCaseValid() {
        return this.passwordValue.match(/[a-z]/g) ? 'slds-text-color_success' : 'slds-text-color_error';
    }

    get isUpperCaseValid() {
        return this.passwordValue.match(/[A-Z]/g) ? 'slds-text-color_success' : 'slds-text-color_error';
    }

    get isNumberValid() {
        return this.passwordValue.match(/[0-9]/g) ? 'slds-text-color_success' : 'slds-text-color_error';
    }

    get isLengthValid() {
        return this.passwordValue.length > 8 ? 'slds-text-color_success' : 'slds-text-color_error';
    }

    handleChange(event) {
        this.passwordValue = event.target.value?.trim() || '';
    }

    handleClick() {
        if (
            this.isLowerCaseValid === 'slds-text-color_success' &&
            this.isUpperCaseValid === 'slds-text-color_success' &&
            this.isNumberValid === 'slds-text-color_success' &&
            this.isLengthValid === 'slds-text-color_success'
        ) {
            // All criteria are valid, show success alert
            this.showAlert('All criteria are valid!');
        } else {
            // Not all criteria are valid, show error message
            this.showErrorMessage();
        }
    }

    showAlert(message) {
        alert(message);
    }

    showErrorMessage() {
        // Build an error message based on which criteria are not met
        let errorMessage = 'Please fix the following issues:\n';

        if (this.isLowerCaseValid !== 'slds-text-color_success') {
            errorMessage += '- A lowercase letter is required\n';
        }
        if (this.isUpperCaseValid !== 'slds-text-color_success') {
            errorMessage += '- An uppercase letter is required\n';
        }
        if (this.isNumberValid !== 'slds-text-color_success') {
            errorMessage += '- A number character is required\n';
        }
        if (this.isLengthValid !== 'slds-text-color_success') {
            errorMessage += '- Minimum 8 characters are required\n';
        }

        alert(errorMessage);
    }
    

}