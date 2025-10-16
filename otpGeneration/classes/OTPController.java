public with sharing class OTPController {
    // Inner class to store OTP and expiration time
    private class OTPRecord {
        String otp;
        Datetime expirationTime;

        OTPRecord(String otp, Datetime expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
        }
    }

    // Generate and send OTP
    @AuraEnabled
    public static void generateAndSendOTP(String email) {
        if (String.isBlank(email)) {
            throw new AuraHandledException('Email is required');
        }

        // Generate 6-digit OTP
        String otp = String.valueOf(Math.round(Math.random() * 899999) + 100000);
        
        // Session Partition : Per User Partition.
        Cache.SessionPartition sessionPartition = Cache.Session.getPartition('local.OTP');

        // Store OTP in memory with 5-minute expiration
        sessionPartition.put(UserInfo.getUserId(), new OTPRecord(otp, System.now().addSeconds(180)));

        // Send OTP via email
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { email });
        mail.setSubject('OTP Code');
        mail.setPlainTextBody('The OTP is: ' + otp + '\nThis OTP is valid for 2 minutes and 30 seconds.');
        mail.setSaveAsActivity(false);

        try {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        } catch (Exception e) {
            throw new AuraHandledException('Failed to send email: ' + e.getMessage());
        }
    }

    // Verify OTP
    @AuraEnabled
    public static Boolean verifyOTP(String email, String otp) {
        if (String.isBlank(email) || String.isBlank(otp)) {
            throw new AuraHandledException('Email and OTP are required');
        }
        
        OTPRecord otpRecord;
        
        if(!Cache.Session.contains(UserInfo.getUserId())){
            throw new AuraHandledException('The OTP has expired!!'); 
        }

        try{
            otpRecord = (OTPRecord) Cache.Session.get(UserInfo.getUserId());   
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
        

        Boolean isValid = otpRecord.otp == otp && otpRecord.expirationTime > System.now();

        // Remove OTP from memory after verification
        Cache.Session.remove(UserInfo.getUserId());

        return isValid;
    }
}