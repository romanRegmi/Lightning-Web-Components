public class renderMapController() {
    @AuraEnabled(cacheable=true)
    public static Map<String, Account> getAccounts() {
    Map<String, Account> accounts = new Map<String, Account>();

    for (Account account : [SELECT Id, Name, NumberOfEmployees, (SELECT Id, Name, Email, Phone FROM Contacts) FROM Account]) {
        accounts.put (account. Name, account) ;
    }
    return accounts;
}

