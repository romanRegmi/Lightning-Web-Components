import { LightningElement, api } from 'lwc'
export default class FileUploadComponent extends LightningElement {
    @api recordId // This will be the parent record the file is attached to
    uploadedFiles
    handleUploadFinished(e){
        const uploadedFiles=e.detail.files;
        this.uploadedFiles=uploadedFiles.map(file=> ({
            name:file.name,
            documentId:file.documentId
        }));
    }
}