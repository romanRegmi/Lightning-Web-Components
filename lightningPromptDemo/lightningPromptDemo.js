promptHandler(){
    LightningPrompt.open({
        message: "Please Enter Your Age",
        label: "Check your voting eligibility",
        theme: "success", //success, warning, error, info
        defaultValue: 30
    }).then(result => {
        console.log(result)
        if (result && Number(result) > 18) {
            console.log("Hurray you are eligible")
        } else {
            console.log("Sorry you are not eligible")

        }
    }

})