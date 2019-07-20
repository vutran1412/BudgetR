var budgetController = (function() {
    
})()

var UIController = (function() {

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    
    return  {
        getInput: function() {
            return ({
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            })
        },
        getDOMStrings: function() {
            return DOMStrings
        }
    }

})()

var controller = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {
        var DOM = UICtrl.getDOMStrings()

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', (event) => {
            // if keycode is enter then get the field input data
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem()
            }
        })
    }


    var ctrlAddItem = function() {
        // Get the field input data
        let budgetItem = UICtrl.getInput()
        // Add the item to the budget controller

        // Add the item to the UI

        // Calcultate the budget

        // Display the budget to the UI
    }

    
    return {
        init: function() {
            setUpEventListeners()
            console.log('App set up!')
        }
    }

    


})(budgetController, UIController)

controller.init()
