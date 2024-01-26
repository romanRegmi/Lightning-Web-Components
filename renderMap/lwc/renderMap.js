/*
* Render values from Apex map
*/
import { LightningElement, wire } from 'lwc';
export default class MyComponentName extends LightningElement {
    @wire(getAccounts, {})
    wiredAccounts({ data, error }) {
        if (data) {
            this.data = Object.entries(data).map(([key, value]) => ({
                name: key,
                employees: value.NumberOfEmployees,
                contacts: value.Contacts
            }));
        } else if (error) {
            console.error(error)

        }
    }
}