import { LightningElement, track } from 'lwc';
import generateOTP from '@salesforce/apex/OTPController.generateAndSendOTP';
import verifyOTP from '@salesforce/apex/OTPController.verifyOTP';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OtpGenerator extends LightningElement {
    email = '';
    otp = '';
    timeDuration = 150 //seconds
    isLoading = false;
    disableGenerateOTP = false;
    showTimer = false;
    timerText = '';

    // Handle email input change
    handleEmailChange(event) {
        this.email = event.target.value;
    }

    // Handle OTP input change
    handleOTPChange(event) {
        this.otp = event.target.value;
    }

    // Format seconds to MM:SS
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Handle Generate OTP button click
    async handleGenerateOTP() {
        if (!this.email) {
            this.showToast('Error', 'Please enter an email address', 'error');
            return;
        }

        // Disable the Generate OTP button
        this.showTimer = true;
        this.disableGenerateOTP = true;
        
        // Create and send the OTP to the email address
        try {
            await generateOTP({ email: this.email });
            this.showToast('Success', 'OTP sent to your email', 'success');
        } catch (error) {
            this.showToast('Error', error.body.message || 'Failed to send OTP', 'error');
        } finally {
            // Start the countdown to which the OTP is valid and a new OTP cannot be created 
            let secondsRemaining = this.timeDuration;
            let countDownInterval = setInterval(() => {
                secondsRemaining--;
                const formattedTime = this.formatTime(secondsRemaining);
                
                // Shows MM:SS format
                if (secondsRemaining >= 60) {
                    this.timerText = `Enter the OTP sent to the email address within ${formattedTime}`;
                } else {
                    this.timerText = `Enter the OTP sent to the email address within ${secondsRemaining} seconds`;
                }
                
                if(secondsRemaining <= 0){
                    clearInterval(countDownInterval);
                    this.showTimer = false;
                    this.disableGenerateOTP = false;                  
                }
            }, 1000);
        }
    }

    // Handle Verify OTP button click
    async handleVerifyOTP() {
        if (!this.otp) {
            this.showToast('Error', 'Please enter the OTP', 'error');
            return;
        }
        this.isLoading = true;
        this.disableGenerateOTP = true;
        try {
            const isValid = await verifyOTP({ email: this.email, otp: this.otp });
            if (isValid) {
                this.showToast('Success', 'OTP verified successfully!!', 'success');
            } else {
                this.showToast('Error', 'Invalid or expired OTP!!', 'error');
            }
        } catch (error) {
            this.showToast('Error', error.body.message || 'Failed to verify OTP', 'error');
        } finally {
            this.isLoading = false;
            this.disableGenerateOTP = false;
        }
    }

    // Utility to show toast messages
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}