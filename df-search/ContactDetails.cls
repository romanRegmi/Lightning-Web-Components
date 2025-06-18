//ContactDetails.cls
public with sharing class ContactDetails {
   /**
   * @description The @AuraEnabled(cacheable=true) annotation allows Lightning Data Service
   * caching, which improves performance by reducing server calls when data is unchanged.
   * This helps load contacts faster in our component.
   */
  @AuraEnabled(cacheable = true)
  public static List<Contact> contactList(){
    try {
      return [SELECT Id, FirstName, LastName, Email 
              FROM Contact 
              ORDER BY FirstName];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}