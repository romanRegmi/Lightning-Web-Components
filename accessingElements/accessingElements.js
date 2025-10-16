import { LightningElement } from 'lwc';
export default class AccessingElements extends LightningElement {
    userNames = ["John", "Smith", "Nike"];

    fetchDetailHandler() {
        const elem = this.template.querySelector('h1');
        elem.style.border = "1px solid red";
        console.log(elem.innerText);

        const userElements = this.template.querySelectorAll('.txt'); // Node of elements
        Array.from(userElements).forEach(item => {
            console.log(item.innerText);
            // line 6 in html --> <div class="txt" key={user} title={item.innerText}>
            item.setAttribute("title", item.innerText);
        })

        // lwc:manual => manually add an innerHTML -> without this the innnerHTML append will throw an error but will still work. 
        const childEle = this.template.querySelector('.child');
        childEle.innerHTML = '<p>Paragraph</p>';
    }

}