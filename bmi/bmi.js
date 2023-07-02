import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class Bmi extends LightningElement {

    bmi;
    isBMICalculated = false;

    handleCalculate() {
        const heightInMeter = this.refs.heightRef.value / 100;
        const weight = this.refs.weightRef.value;

        let minWeight = 2.1
        let maxWeight = 635

        let minHeight = 0.546
        let maxHeight = 2.72

        if ((weight > maxWeight || weight < minWeight) || (heightInMeter > maxHeight || heightInMeter < minHeight)) {

            let errorTitle = '';
            let errorMessage = '';

            if (weight > maxWeight || weight < minWeight) {
                errorTitle = 'Enter valid weight';
                errorMessage = `Weight should be between ${minWeight} and ${maxWeight}`;
            } else {
                errorTitle = 'Enter valid height';
                errorMessage = `Height should be between ${minHeight * 100} and ${maxHeight * 100}`;
            }

            this.dispatchEvent(
                new ShowToastEvent({
                    title: errorTitle,
                    variant: 'error',
                    message: errorMessage,
                })
            );
        } else {
            this.bmi = (weight / (heightInMeter * heightInMeter)).toFixed(2);
            this.isBMICalculated = true;
        }


    }

    handleReCalculate() {
        this.isBMICalculated = false;
    }
}