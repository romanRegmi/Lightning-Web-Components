import { LightningElement } from 'lwc';
export default class HelloWorld extends LightningElement {
    title = 'Roman Regmi';

    changeHandler(event){
        this.title = event.target.value
    }

}