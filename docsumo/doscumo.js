import { LightningElement, api, track, wire } from "lwc";
import { deleteRecord, getRecord  } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

import Id from '@salesforce/schema/ContentDocument.Id';
import TITLE from '@salesforce/schema/ContentDocument.Title';
import FILE_TYPE from '@salesforce/schema/ContentDocument.FileType';
import CONTENT_SIZE from '@salesforce/schema/ContentDocument.ContentSize';

const actions = [
        { label: 'Delete', name: 'delete' },
    ];

const columns = [
        { label: 'Title', fieldName: 'title' },
        { label: 'File Type', fieldName: 'fileType' },
        { label: 'Size', fieldName: 'size', type: 'number' },
        {
            type: 'action',
            typeAttributes: { rowActions: actions },
        },
    ];

export default class DocsumoContentDocumentViewer extends LightningElement {
    isRemoved = false; //Switched to true if the uploaded file is deleted
    @track contentDocuments = []; // Data to show in the data table
    defaultContentDocumentIds = [];

    columns = columns;

    wiredContentDocumentsResult;

    @api
    get contentDocumentIds(){
        return this.defaultContentDocumentIds;
    }

    // TODO : Fix for multiple files uploaded.
    set contentDocumentIds(cdIds){
        this.defaultContentDocumentIds = cdIds.find(id=>id!==undefined); // Will only use the first Id
    }

    

    // Fetch ContentDocument data using @wire
    @wire(getRecord, {
              recordId: '$contentDocumentIds',
              fields: [Id, TITLE, FILE_TYPE, CONTENT_SIZE]
            })   
    wiredContentDocuments(result) {
        try{     
            this.wiredContentDocumentsResult = result;
            if(result.data){
                this.contentDocuments = [
                    {
                        Id: result.data.fields.Id.value,
                        title: result.data.fields.Title.value,
                        fileType: result.data.fields.FileType.value,
                        size: result.data.fields.ContentSize.value
                    }
                ];
            } else if (result.error) {
                console.error('Error fetching content document data:', error);
                this.contentDocuments = [];
            }
        } catch (error){
            console.error(error);
            this.contentDocuments = [];
        }
    }

    //Handle delete button action
    //Use spinner
    async handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                try{
                    this.isRemoved = true; // Set deleted flag
                    try {
                        await deleteRecord(row.Id);
                        console.log('Record deleted successfully');
                    } catch (error) {
                        console.error('Error deleting record:', error);
                    }
                    
                    // Send back variable to flow after deletion
                    this.dispatchEvent(new FlowAttributeChangeEvent('isRemoved', this.isRemoved))
                    .then(() => {
                            console.log('FlowAttributeChangeEvent Fired');
                        })
                        .catch(error => {
                            console.error('Error Passing Values from LWC to the flow', error);
                        });;
                        
                    await refreshApex(this.wiredContentDocumentsResult)
                        .then(() => {
                            console.log('Apex data refreshed');
                        })
                        .catch(error => {
                            console.error('Error refreshing Apex', error);
                        });
                } catch (error){
                    console.error(error);
                }
            default:
        }

    }

}