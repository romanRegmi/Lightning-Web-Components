import LightningModal from 'lightning/modal';
export default class QuizQuestions extends LightningModal {
    score = 0;
    position = 0;

    isCompleted = false;
    isNextClicked = true;

    get question() {
        return this.questions[this.position];
    }

    get isScoredFull() {
        return `slds-text-heading_large ${this.questions.length === this.score ? 'slds-text-color_success' : 'slds-text-color_error'}`;
    }


    questions = [
        {
            id: 1,
            question: "What does HTML stand for?",
            answer: "Hyper Text Markup Language",
            options: [
                "Hyper Text Preprocessor",
                "Hyper Text Markup Language",
                "Hyper Text Multiple Language",
                "Hyper Tool Multi Language"
            ]
        },
        {
            id: 2,
            question: "What does CSS stand for?",
            answer: "Cascading Style Sheet",
            options: [
                "Common Style Sheet",
                "Colorful Style Sheet",
                "Computer Style Sheet",
                "Cascading Style Sheet"
            ]
        },
        {
            id: 3,
            question: "What does JSON stand for?",
            answer: "JavaScript Object Notation",
            options: [
                "Java Object Notion ",
                "JavaScript Object Notion",
                "Java Object Notation",
                "JavaScript Object Notation"
            ]
        },
        {
            id: 4,
            question: "What does SQL stand for?",
            answer: "Structured Query Language",
            options: [
                "Stylish Question Language",
                "Stylesheet Query Language",
                "Statement Question Language",
                "Structured Query Language"
            ]
        },
        {
            id: 5,
            question: "What does XML stand for?",
            answer: "eXtensible Markup Language",
            options: [
                "eXtensible Markup Language",
                "eXecutable Multiple Language",
                "eXTra Multi-Program Language",
                "eXamine Multiple Language"
            ]
        },
    ]


    handleNext() {
        this.isNextClicked = true;
        if (this.questions.length - 1 > this.position) {
            this.position += 1;
        } else {
            this.isCompleted = true;
        }
    }

    handleReplay() {
        this.score = this.position = 0;
        this.isCompleted = false;
    }

    handleSelect(event) {
        if (this.isNextClicked) {
            const correctAnswer = this.questions[this.position].answer;
            const selectedEvent = event.target;

            const buttons = this.template.querySelector('lightning-modal-body')
                .querySelectorAll('lightning-button');

            buttons.forEach(function (button) {
                button.disabled = true;
                if (button.title === correctAnswer) {
                    button.disabled = false;
                    button.variant = 'success';
                }
            });

            if (selectedEvent.title === correctAnswer) {
                this.score += 1;
            } else {
                selectedEvent.disabled = false;
                selectedEvent.variant = 'destructive';
            }

            this.isNextClicked = false;

        }

    }

    handleQuit() {
        this.close();
    }
}