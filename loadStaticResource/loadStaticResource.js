import {LightningElement} from 'lwc';
import {loadStyle} from 'lightning/platformResourceLoader';
import img from '@salesforce/resourceUrl/img'; // Image Load
import myStyles from '@salesforce/resourceUrl/myStyles';

export default class LoadStaticResource extends LightningElement {
    imgURL = img;

    // CSS file
    connectedCallback(){
        loadStyle(this, myStyles);
    }
}