public with sharing class VeriPhoneController {

    public static String API_KEY = '265A5DCDCF0143F5B246E20127FA1038';
    
    @AuraEnabled
    public static VeriPhoneDescriptor verifyPhone(String phone){
        String endpoint = 'https://api.veriphone.io/v2/verify?phone=' + phone + '&key=' + API_KEY;
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpoint); // Corrected the variable name
        request.setMethod('GET');
        System.debug(request);
        HttpResponse response = http.send(request);
        System.debug('===>Response : ' + response.getBody());
        return new VeriPhoneDescriptor().parseJSON(response.getBody());
    }
}