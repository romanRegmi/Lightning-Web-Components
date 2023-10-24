public with sharing class VeriPhoneDescriptor {
    @AuraEnabled public String status;
    @AuraEnabled public Boolean phone_valid;
    @AuraEnabled public String phone_region;
    @AuraEnabled public String carrier;

    public VeriPhoneDescriptor parseJSON(String json){
        return (VeriPhoneDescriptor) System.JSON.deserialize(json, VeriPhoneDescriptor.class);
    }
}