# Note on Authentication Form Validation

**Field Validations in HTML:**

Field validations for the authentication form are defined in the HTML and are triggered first. These validations ensure that the entered data meets the specified criteria.

**Order of Execution:**

1. **Field Validations:** The field validations are fired when the respective fields are interacted with, i.e., clicked on.

2. **Onclick Method:** The onclick method associated with the authentication button is executed only after the field validation has been triggered. This ensures that the user's input conforms to the specified requirements before any further action is taken.

**Note on Authentication Button:**

To initiate the onclick method, you need to click on the authenticate button. However, due to the order of execution, you might need to click the button twice for the method to run successfully. This is because the first click triggers the field validations, and the second click allows the onclick method to execute after the validations are satisfied.

**Field Validation Activation:**

It's important to note that field validations are set to fire only when the corresponding fields are clicked or focused on. This means that if you haven't interacted with a particular field, its validation won't be triggered until you click on or focus on that specific field.

In summary, the authentication process involves ensuring that user inputs meet the specified criteria through field validations before executing any further actions defined in the onclick method.