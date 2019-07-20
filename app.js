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

    var calculateTotal = function(type) {
        var sum = 0
        data.allItems[type].forEach(function(current) {
            sum += current.value
        })
        data.totals[type] = sum
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

            // Push it to new data structure
            data.allItems[type].push(newItem)
            return newItem
        },
        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('exp')
            calculateTotal('inc')
            // calculate the budget income - expenses
            data.budget = data.totals.inc - data.totals.exp
            // calculate the percentage of expenses from income
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1
            }
        },
        getBudget: function() {
            return {
                totalsInc: data.totals.inc,
                totalsExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        }
    }

    

})()


var UIController = (function() {

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpenseValue: '.budget__expenses--value',
        budgetExpensesPercentage: '.budget__expenses--percentage'
    }
    
    return  {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        addListItem: function(obj, type) {
            var html, element
            // create HTML string with place holder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer
                html = `<div class="item clearfix" id="income-${obj.id}">\
                    <div class="item__description"> ${obj.description}</div>\
                        <div class="right clearfix">\
                            <div class="item__value">+ $${obj.value}</div>\
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
                        <div class="item__value">- $${obj.value}</div>\
                        <div class="item__percentage">10%</div>\
                        <div class="item__delete">\
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                        </div>\
                    </div>\
                </div>`
                
            }
            
            document.querySelector(element).insertAdjacentHTML("beforeend", html)
        },
        displayBudget: function(obj) {
            if (obj.budget > 0) {
                document.querySelector(DOMStrings.budgetValue).textContent = `+ $${obj.budget}`
            } else {
                document.querySelector(DOMStrings.budgetValue).textContent = `$${obj.budget}`
            }


            document.querySelector(DOMStrings.budgetIncomeValue).textContent = `+ $${obj.totals.inc}`
            document.querySelector(DOMStrings.budgetExpenseValue).textContent = `- $${obj.totals.exp}`
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.budgetExpensesPercentage).textContent = `${obj.percentage}%`
            } else {
                document.querySelector(DOMStrings.budgetExpensesPercentage).textContent = '---'
            }


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
        budgetCtrl.calculateBudget()
        // Return the budget
        var budget = budgetCtrl.getBudget()
        // Display the budget to the UI
        UICtrl.displayBudget(budget)
    }


    var ctrlAddItem = function() {
        let budgetInput, newItem
        // Get the field input data
        budgetInput = UICtrl.getInput()
        if (budgetInput.description !== '' && !isNaN(budgetInput.value) && budgetInput.value > 0) {
            // Add the item to the budget controller
            newItem = budgetCtrl.addItem(budgetInput.type, budgetInput.description, budgetInput.value)
            // Add the item to the UI
            UICtrl.addListItem(newItem, budgetInput.type)
            // Clear the fields
            UICtrl.clearFields()
            // Calcultate the budget
            updateBudget()
            // Display the budget to the UI
            
            }

        }

    
    return {
        init: function() {
            setUpEventListeners()
            UICtrl.displayBudget({
                budget: 0,
                totalsInc: 0,
                totalsExp: 0,
                percentage: 0
            })
            console.log('App set up!')
        }
    }

    


})(budgetController, UIController)

controller.init()
