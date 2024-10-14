import { LightningElement } from 'lwc';
import quizRules from 'c/quizRules';
import quizQuestions from 'c/quizQuestions';



export default class LaunchQuiz extends LightningElement {
    async openQuizModal() {
        const result = await quizQuestions.open({
            size: 'small',
            description: 'Accessible description of modal\'s purpose',
            disableClose: false, //If true, prevents closing the modal by normal means like the ESC key, the close button, or .close()
        });
        console.log(result);
    }

    handleClick() {
        const result = quizRules.open({
            // `label` is not included here in this example.
            // it is set on lightning-modal-header instead
            size: 'small',
            description: 'Accessible description of modal\'s purpose',
            rules: ["1. You will have only 15 seconds per question.",
                "2. Once you select your answer, it can't be undone.",
                "3. You can't select any option once the time goes off.",
                "4. You'll get points on the basis of your correct answers.",
                "5. You can't exit from the Quiz while you are playing"],
        }).then((result) => {
            // if modal closed with X button, promise returns result = 'undefined'
            // if modal closed with OK button, promise returns result = 'okay'

            if (result === 'startQuiz') {
                this.openQuizModal();
            }
        });
    }

    
}