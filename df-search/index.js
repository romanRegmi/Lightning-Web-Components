// ClientSideSearch.js
import { LightningElement, wire } from 'lwc';
import contactDetails from '@salesforce/apex/ContactDetails.contactList';

const COLUMNS = [
 { label: 'First Name', fieldName: 'FirstName' },
 { label: 'Last Name', fieldName: 'LastName' },
 { label: 'Email', fieldName: 'Email'}
];
export default class ClientSideSearch extends LightningElement {
 searchKey = '';
 data = [];
 columns = COLUMNS;
 filteredData =[];
 isLoading = true;
 debounceTimeout;

 @wire(contactDetails)
 Contact({ error, data }) {
  if (data) {
   this.data = data;
   this.filteredData = [...data];
  }
  else if (error) {
   console.error('Error:', error);
  }
  this.isLoading = false; // Hide spinner once data is loaded
 }

 handleSearch(event) {
  this.searchKey = event.target.value.toLowerCase();
  this.isLoading = true; // Show spinner during search
  // Debouncing: Clears previous timeout and waits 300ms before filtering
  clearTimeout(this.debounceTimeout);
  this.debounceTimeout = setTimeout(() => {
   if (this.searchKey) {
    this.filteredData = this.data.filter(row =>
     Object.values(row).some(val =>
      (val ? String(val).toLowerCase() : '').includes(this.searchKey)
     )
    );
   } else {
    this.filteredData = [...this.data];
   }
   this.isLoading = false; // Hide spinner after filtering
  }, 300); // Waits 300ms after the user stops typing before applying the search filter.
  // This prevents unnecessary filtering on every keystroke and improves performance.
 }
}