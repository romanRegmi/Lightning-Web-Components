@isTest
global class VeriPhoneMock implements HTTPCalloutMock {
    
    global HTTPResponse respond(HTTPRequest request) {
        HTTPResponse response = new HTTPResponse();
        response.setBody('{"status": "success", "phone": "+49-15123577723", "phone_valid": true, "phone_type": "mobile", "phone_region": "Germany", "country": "Germany", "country_code": "DE", "country_prefix": "49", "international_number": "+49 1512 3577723", "local_number": "01512 3577723", "e164": "+4915123577723", "carrier": "T-Mobile"}');
        response.setHeader('Content-Type', 'application/json');
        response.setStatusCode(200);
        return response;
    }

}