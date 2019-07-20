var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    var Income = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        total: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, description, value) {
            var newItem, ID

            // Create a new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0
            }

            // Create new item based on type
            if (type === 'exp') {
                newItem = new Expense(ID, description, value)
            } else if (type === 'inc') {
                newItem = new Income(ID, description, value)
            }

            // PUsh it to new data structure
            data.allItems[type].push(newItem)
            return newItem
        },
    }

    

})()


var UIController = (function() {

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    }
    
    return  {
        getInput: function() {
            return ({
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            })
        },
        addListItem: function(obj, type) {
            var html, element
            // create HTML string with place holder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer
                html = `<div class="item clearfix" id="income-${obj.id}">\
                    <div class="item__description"> ${obj.description}</div>\
                        <div class="right clearfix">\
                            <div class="item__value">+ ${obj.value}</div>\
                            <div class="item__delete">\
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                            </div>\
                        </div>\
                        </div >`
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer
                html = `<div class="item clearfix" id="expense-${obj.id}">\
                    <div class="item__description">${obj.description}</div>\
                    <div class="right clearfix">\
                        <div class="item__value">- ${obj.value}</div>\
                        <div class="item__percentage">10%</div>\
                        <div class="item__delete">\
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                        </div>\
                    </div>\
                </div>`
                
            }
            
            document.querySelector(element).insertAdjacentHTML("beforeend", html)
        },
        clearFields: function() {
            var fields
            fields = Array.from(document.querySelectorAll(`${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`))  
            fields.forEach(function(current) {
                current.value = ''
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

    var updateBudget = function() {
        // Calculate the Budget

        // Return the budget

        // Display the budget to the UI
    }


    var ctrlAddItem = function() {
        let budgetInput, newItem
        // Get the field input data
        budgetInput = UICtrl.getInput()
        // Add the item to the budget controller
        newItem = budgetCtrl.addItem(budgetInput.type, budgetInput.description, budgetInput.value)
        // Add the item to the UI
        UICtrl.addListItem(newItem, budgetInput.type)
        // Clear the fields
        UICtrl.clearFields()
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
