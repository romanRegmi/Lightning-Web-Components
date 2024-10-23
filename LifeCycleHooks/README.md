# Constructor Method

Invoked when a component instance is created.
Executes before the component is connected to the DOM.
First statement must be super().
Properties aren't ready, access host element using this.template.
Lifecycle flow: parent to child.
Cannot access child elements or public properties.
Avoid DOM manipulation and event handling.
Can set properties, call Apex methods, and use uiRecordApi (Salesforce).
Cannot create/dispatch custom events or use navigation service.

Constructor is invoked when the component is created. It is similar to the init method in the aura component. Only difference here is that flow is from parent to child as opposed to that of init where the child component’s init is called first and then the parent component’s init gets called.


we can't access child elements in the component body because they don't exist yet.
Don't add attributes to the host element in the constructor