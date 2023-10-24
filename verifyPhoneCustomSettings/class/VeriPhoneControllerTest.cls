@isTest
public with sharing class VeriPhoneControllerTest {
    public static final Integer RESPONSE_CODE = 200;
    public static final String RESPONSE_STATUS = 'success';
    public static final String RESPONSE_BODY = '{"status": "success", "phone": "+49-15123577723", "phone_valid": true, "phone_type": "mobile", "phone_region": "Germany", "country": "Germany", "country_code": "DE", "country_prefix": "49", "international_number": "+49 1512 3577723", "local_number": "01512 3577723", "e164": "+4915123577723", "carrier": "T-Mobile"}';
    
    
    @isTest
    public static void testVeriPhone() {
        Test.startTest();
        Test.setMock(HTTPCalloutMock.class, new VeriPhoneMock());
        VeriPhoneDescriptor response = VeriPhoneController.verifyPhone('+49-15123577723');
        System.assertEquals(RESPONSE_STATUS, response.status);
        System.assertEquals(true, response.phone_valid);
        System.assertEquals('Germany', response.phone_region);
        Test.stopTest();
        
    }
}