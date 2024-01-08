/*
In Lightning Web Components (LWC), you can call a method defined in a child component from a parent component to facilitate communication from parent to child.

By using `this.template.querySelector()`, you can call child component method by passing child component name in querySelector parameter.

eg:- this.template.querySelector(‘c-child-component’).childMethod().


We can pass non primitive data such as arrays, objects from parent to child
We can pass data on action event like when clicked. 
*/

// childComponent.js
import { LightningElement, api } from 'lwc';
  
export default class ChildComponent extends LightningElement {
 
showMethod=' '
  @api childMethod(){
            this.showMethod = 'Child Method Called'
            console.log('child method called');
    }
}

// parentComponent.js
import { LightningElement } from 'lwc';
 
export default class ParentComponent extends LightningElement {
 
   //Call method from child component
    callChild() {
    this.template.querySelector('c-child-component').childMethod();
  }
}