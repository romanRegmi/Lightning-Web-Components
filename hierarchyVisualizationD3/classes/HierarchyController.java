// HierarchyController.cls
public with sharing class HierarchyController {
    public static String objName;
    
    @AuraEnabled
    public static HierarchyNode getHierarchyData(String recordId, String objectApiName, Integer maxLevels) {
        try {
            if (String.isBlank(recordId) || maxLevels <= 0) {
                throw new AuraHandledException('Invalid parameters provided');
            }
                        
            // Get the root record
            SObject rootRecord = getRootRecord(recordId, objectApiName);
            if (rootRecord == null) {
                throw new AuraHandledException('Record not found');
            }

            objName = objectApiName;            
            
            // Build hierarchy starting from root
            HierarchyNode rootNode = buildHierarchyNode(rootRecord, objectApiName, 0, maxLevels, new Set<String>());
            return rootNode;
            
        } catch (Exception e) {
            System.debug('Error in getHierarchyData: ' + e.getMessage());
            throw new AuraHandledException('Error retrieving hierarchy data: ' + e.getMessage());
        }
    }
    
    private static SObject getRootRecord(String recordId, String objectApiName) {    
        try {
            return Database.query('SELECT Id, Name FROM ' + String.escapeSingleQuotes(objectApiName) + ' WHERE Id = :recordId LIMIT 1');
        } catch (Exception e) {
            System.debug('Error in getRootRecord: ' + e.getMessage());
            return null;
        }
    }
    
    private static HierarchyNode buildHierarchyNode(SObject record, String objectType, Integer currentLevel, Integer maxLevels, Set<String> processedRecords) {
        // Prevent infinite loops
        if (processedRecords.contains(record.Id)) {
            return null;
        }
        processedRecords.add(record.Id);
        
        HierarchyNode node = new HierarchyNode();
        node.id = record.Id;
        node.name = getRecordName(record);
        node.objectType = objectType;
        node.level = currentLevel;
        node.children = new List<HierarchyNode>();
        
        // Add additional data
        node.data = new Map<String, Object>();
        Map<String, Object> recordMap = record.getPopulatedFieldsAsMap();
        for (String fieldName : recordMap.keySet()) {
            node.data.put(fieldName, recordMap.get(fieldName));
        }
        
        // If we haven't reached max levels, get children
        if (currentLevel < maxLevels) {
            List<HierarchyNode> childNodes = getChildRecords(record.Id, objectType, currentLevel + 1, maxLevels, processedRecords);
            node.children.addAll(childNodes);
        }
        
        return node;
    }
    
    private static String getRecordName(SObject record) {
        // Map object API name to the field used as Name
        Map<String, String> mapRecordName = new Map<String, String>{
            'Account' => 'Name', 
            'Contact' => 'Name',
            'Opportunity' => 'Name',
            'Lead' => 'Name'
        };
        
        // Get the field name from the map, default to 'Name' if not found
        String nameField = mapRecordName.get(objName);
        if (nameField != null && record.get(nameField) != null) {
            return String.valueOf(record.get(nameField));
        }
        
        return null;
    }
    
    private static List<HierarchyNode> getChildRecords(String parentId, String parentObjectType, Integer currentLevel, Integer maxLevels, Set<String> processedRecords) {
        List<HierarchyNode> childNodes = new List<HierarchyNode>();
        
        // Define relationship mappings - customize these based on your org's structure
        Map<String, List<ChildRelationship>> relationshipMap = getRelationshipMappings();
        
        if (relationshipMap.containsKey(parentObjectType)) {
            for (ChildRelationship relationship : relationshipMap.get(parentObjectType)) {
                List<HierarchyNode> relationshipChildren = getChildrenForRelationship(
                    parentId, relationship, currentLevel, maxLevels, processedRecords
                );
                childNodes.addAll(relationshipChildren);
            }
        }
        
        return childNodes;
    }
    
    private static List<HierarchyNode> getChildrenForRelationship(String parentId, ChildRelationship relationship, Integer currentLevel, Integer maxLevels, Set<String> processedRecords) {
        List<HierarchyNode> children = new List<HierarchyNode>();
        
        try {
            // Build dynamic query for child records
            List<String> queryFields = new List<String>{'Id'};
            
            // Get object metadata for child object
            Schema.SObjectType childSObjectType = Schema.getGlobalDescribe().get(relationship.childObjectName);
            if (childSObjectType != null) {
                Schema.DescribeSObjectResult childObjectDescribe = childSObjectType.getDescribe();
                Map<String, Schema.SObjectField> fieldMap = childObjectDescribe.fields.getMap();
                
                // Add common fields if they exist
                List<String> commonFields = new List<String>{
                    'Name', 'Title', 'Subject', 'CaseNumber', 'AccountNumber', 
                    'Description', 'Status', 'Stage', 'Type'
                };
                
                for (String fieldName : commonFields) {
                    if (fieldMap.containsKey(fieldName.toLowerCase())) {
                        queryFields.add(fieldName);
                    }
                }
            }
            
            String query = 'SELECT ' + String.join(queryFields, ', ') + 
                          ' FROM ' + String.escapeSingleQuotes(relationship.childObjectName) + 
                          ' WHERE ' + String.escapeSingleQuotes(relationship.relationshipField) + ' = :parentId' +
                          ' ORDER BY CreatedDate DESC LIMIT 50'; // Limit to prevent too many records
            
            List<SObject> childRecords = Database.query(query);
            
            for (SObject childRecord : childRecords) {
                if (!processedRecords.contains(childRecord.Id)) {
                    HierarchyNode childNode = buildHierarchyNode(
                        childRecord, relationship.childObjectName, currentLevel, maxLevels, processedRecords
                    );
                    if (childNode != null) {
                        children.add(childNode);
                    }
                }
            }
            
        } catch (Exception e) {
            System.debug('Error querying child records for relationship ' + relationship.childObjectName + ': ' + e.getMessage());
        }
        
        return children;
    }
    
    private static Map<String, List<ChildRelationship>> getRelationshipMappings() {
        // Customize this map based on your org's object relationships
        Map<String, List<ChildRelationship>> relationshipMap = new Map<String, List<ChildRelationship>>();
        
        // Account relationships
        relationshipMap.put('Account', new List<ChildRelationship>{
            new ChildRelationship('Contact', 'AccountId'),
            new ChildRelationship('Opportunity', 'AccountId'),
            new ChildRelationship('Case', 'AccountId'),
            new ChildRelationship('Account', 'ParentId') // Child Accounts
        });
        
        // Contact relationships
        relationshipMap.put('Contact', new List<ChildRelationship>{
            new ChildRelationship('Case', 'ContactId'),
            new ChildRelationship('Opportunity', 'Contact__c'), // If you have custom contact field
            new ChildRelationship('Task', 'WhoId'),
            new ChildRelationship('Event', 'WhoId')
        });
        
        // Opportunity relationships
        relationshipMap.put('Opportunity', new List<ChildRelationship>{
            new ChildRelationship('OpportunityLineItem', 'OpportunityId'),
            new ChildRelationship('Task', 'WhatId'),
            new ChildRelationship('Event', 'WhatId')
        });
        
        // Case relationships
        relationshipMap.put('Case', new List<ChildRelationship>{
            new ChildRelationship('Case', 'ParentId'), // Child Cases
            new ChildRelationship('Task', 'WhatId'),
            new ChildRelationship('Event', 'WhatId'),
            new ChildRelationship('CaseComment', 'ParentId')
        });
        
        // Add more relationships as needed for your org
        
        return relationshipMap;
    }
    
    // Wrapper classes
    public class HierarchyNode {
        @AuraEnabled public String id { get; set; }
        @AuraEnabled public String name { get; set; }
        @AuraEnabled public String objectType { get; set; }
        @AuraEnabled public Integer level { get; set; }
        @AuraEnabled public List<HierarchyNode> children { get; set; }
        @AuraEnabled public Map<String, Object> data { get; set; }
        
        public HierarchyNode() {
            this.children = new List<HierarchyNode>();
            this.data = new Map<String, Object>();
        }
    }
    
    private class ChildRelationship {
        public String childObjectName { get; set; }
        public String relationshipField { get; set; }
        
        public ChildRelationship(String childObjectName, String relationshipField) {
            this.childObjectName = childObjectName;
            this.relationshipField = relationshipField;
        }
    }
}