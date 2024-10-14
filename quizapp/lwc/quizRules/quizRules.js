import { api } from 'lwc';
import LightningModal from 'lightning/modal';


export default class QuizRules extends LightningModal  {

    @api rules;

    handleCancel() {
        this.close();
    }

    handleContinue() {
        this.close('startQuiz');
    }

}