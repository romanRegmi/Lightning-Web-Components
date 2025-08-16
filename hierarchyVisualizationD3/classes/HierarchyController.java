// HierarchyController.cls
public with sharing class HierarchyController {
    private static Integer maxLevel;

    // API Name of the field value you want to show in the node for each object
    private static final Map<String, String> NAME_FIELD_MAP = new Map<String, String>{
        'Account' => 'Name',
        'Contact' => 'Name',
        'Opportunity' => 'Name',
        'Case' => 'Subject',
        'CaseComment' => 'ParentId'
    };

    @AuraEnabled
    public static HierarchyNode getHierarchyData(String recordId, String currObj, Integer maxLevels) {
        try {
            if (String.isBlank(recordId) || String.isBlank(currObj) || maxLevels <= 0) {
                throw new AuraHandledException('Invalid parameters provided');
            }
            
            maxLevel = maxLevels;
                        
            // Get the root record
            SObject rootRecord = getRootRecord(recordId, currObj);
            if (rootRecord == null) {
                throw new AuraHandledException('Record not found');
            }

            // Build hierarchy starting from root
            HierarchyNode rootNode = buildHierarchyNode(rootRecord, currObj, 0, new Set<String>());
            System.debug('rootNode ' + rootNode);
            return rootNode;
            
        } catch (Exception e) {
            System.debug('Error in getHierarchyData: ' + e.getMessage());
            throw new AuraHandledException('Error retrieving hierarchy data: ' + e.getMessage());
        }
    }
    
    private static SObject getRootRecord(String recordId, String currObj) {
        return Database.query('SELECT Id, Name FROM ' + String.escapeSingleQuotes(currObj) + ' WHERE Id = :recordId LIMIT 1');
    }
    
    private static HierarchyNode buildHierarchyNode(SObject record, String currObj, Integer currentLevel, Set<String> processedRecords) {
        // Prevent infinite loops
        try{
        if (processedRecords.contains(record.Id)) {
            return null;
        }
        processedRecords.add(record.Id);
        
        HierarchyNode node = new HierarchyNode();
        node.id = record.Id;
        node.name =  NAME_FIELD_MAP.get(currObj) != null ? String.valueOf(record.get(NAME_FIELD_MAP.get(currObj))) : null;
        node.currObj = currObj;
        node.level = currentLevel;
        node.children = new List<HierarchyNode>();
        
        // Add additional data
        node.data = new Map<String, Object>();
        Map<String, Object> recordMap = record.getPopulatedFieldsAsMap();
        for (String fieldName : recordMap.keySet()) {
            node.data.put(fieldName, recordMap.get(fieldName));
        }
        
        // If we haven't reached max levels, get children
        if (currentLevel < maxLevel) {
            List<HierarchyNode> childNodes = getChildRecords(record.Id, currObj, currentLevel + 1, processedRecords);
            node.children.addAll(childNodes);
        }
        System.debug('NODE ' + node.currObj);
        return node;
        } catch (Exception e){
            System.debug('Error in buildHierarchyNode: ' + e.getMessage());
            return null;
        }
    }
    
    private static List<HierarchyNode> getChildRecords(String parentId, String parentObjectType, Integer currentLevel, Set<String> processedRecords) {
        List<HierarchyNode> childNodes = new List<HierarchyNode>();
        
        // Define relationship mappings - customize these based on your org's structure
        Map<String, List<ChildRelationship>> relationshipMap = getRelationshipMappings();
        
        if (relationshipMap.containsKey(parentObjectType)) {
            for (ChildRelationship relationship : relationshipMap.get(parentObjectType)) {
                List<HierarchyNode> relationshipChildren = getChildrenForRelationship(
                    parentId, relationship, currentLevel, processedRecords
                );
                childNodes.addAll(relationshipChildren);
            }
        }
        
        return childNodes;
    }
    
    private static List<HierarchyNode> getChildrenForRelationship(String parentId, ChildRelationship relationship, Integer currentLevel, Set<String> processedRecords) {
        List<HierarchyNode> children = new List<HierarchyNode>();
        
        try {
            // Build dynamic query for child records
            List<String> queryFields = new List<String>{'Id'};
            if(!String.isBlank(NAME_FIELD_MAP.get(relationship.childObjectName))){
                queryFields.add(NAME_FIELD_MAP.get(relationship.childObjectName));
            }
            
            String query = 'SELECT ' + String.join(queryFields, ', ') + 
                          ' FROM ' + String.escapeSingleQuotes(relationship.childObjectName) + 
                          ' WHERE ' + String.escapeSingleQuotes(relationship.relationshipField) + ' = :parentId' +
                          ' ORDER BY CreatedDate DESC'; // Limit to prevent too many records
            
            List<SObject> childRecords = Database.query(query);
            
            for (SObject childRecord : childRecords) {
                if (!processedRecords.contains(childRecord.Id)) {
                    HierarchyNode childNode = buildHierarchyNode(
                        childRecord, relationship.childObjectName, currentLevel, processedRecords
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
            new ChildRelationship('Account', 'ParentId') // Self relationship isn't supported
        });
        
        // Contact relationships
        relationshipMap.put('Contact', new List<ChildRelationship>{
            new ChildRelationship('Case', 'ContactId')
        });
        
        // Opportunity relationships
        relationshipMap.put('Opportunity', new List<ChildRelationship>{
            new ChildRelationship('OpportunityLineItem', 'OpportunityId')
        });
        
        // Case relationships
        relationshipMap.put('Case', new List<ChildRelationship>{
            new ChildRelationship('Case', 'ParentId'), // Child Cases
            new ChildRelationship('CaseComment', 'ParentId')
        });
        
        // Add more relationships as needed for your org
        
        return relationshipMap;
    }
    
    // Wrapper classes
    public class HierarchyNode {
        @AuraEnabled public String id { get; set; }
        @AuraEnabled public String name { get; set; }
        @AuraEnabled public String currObj { get; set; }
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