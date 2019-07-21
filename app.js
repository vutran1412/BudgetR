var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage
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
        deleteItem: function(type, id) {
            let ids, index
            ids = data.allItems[type].map(function(current) {
                return current.id
            })
            index = ids.indexOf(id)
            if (index !== -1) {
                data.allItems[type].splice(index, 1)
                console.log(data.allItems)
            }
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
        calculatePercentages: function () {
            data.allItems.exp.forEach(function(curr) {
                curr.calcPercentage(data.totals.inc)
            })
        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(curr) {
                return curr.getPercentage()
            })
            return allPerc
        },
        getBudget: function() {
            return {
                totalsInc: data.totals.inc,
                totalsExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        },
        publicTest: function() {
            console.log(data)
            return data
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
        budgetExpensesPercentage: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    }

    var formatNumber = function(num, type) {
        var numSplit, sign
        num = Math.abs(num)
        num = num.toFixed(2)

        numSplit = num.split('.')

        int = numSplit[0]
        if (int.length > 3) {
            int = `${int.substr(0, int.length - 3)},${int.substr(int.length - 3, int.length)}`
        }

        dec = numSplit[1]
        type === 'exp' ? sign = '-' : sign = '+'

        return `${sign} $${int}.${dec}`

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
                html = `<div class="item clearfix" id="inc-${obj.id}">\
                    <div class="item__description"> ${obj.description}</div>\
                        <div class="right clearfix">\
                            <div class="item__value">${formatNumber(obj.value, 'inc')}</div>\
                            <div class="item__delete">\
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                            </div>\
                        </div>\
                        </div >`
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer
                html = `<div class="item clearfix" id="exp-${obj.id}">\
                    <div class="item__description">${obj.description}</div>\
                    <div class="right clearfix">\
                        <div class="item__value">${formatNumber(obj.value, 'exp')}</div>\
                        <div class="item__percentage">${obj.percentage}</div>\
                        <div class="item__delete">\
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                        </div>\
                    </div>\
                </div>`
                
            }
            
            document.querySelector(element).insertAdjacentHTML("beforeend", html)
        },
        deleteListItem: function(type, id) {
            document.getElementById(`${type}-${id}`).remove()
        },
        displayBudget: function(obj) {
            obj.budget > 0 ? type = 'inc' : type = 'exp'
            document.querySelector(DOMStrings.budgetValue).textContent = `${formatNumber(obj.budget, type)}`


            document.querySelector(DOMStrings.budgetIncomeValue).textContent = `${formatNumber(obj.totalsInc, 'inc')}`
            document.querySelector(DOMStrings.budgetExpenseValue).textContent = `${formatNumber(obj.totalsExp, 'exp')}`
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.budgetExpensesPercentage).textContent = `${obj.percentage}%`
            } else {
                document.querySelector(DOMStrings.budgetExpensesPercentage).textContent = '---'
            }

        },
        displayPercentages: function(percentages) {
            var fields = Array.from(document.querySelectorAll(DOMStrings.expensesPercLabel))
            
            var nodeListForEach = function(list, callback) {
                for (let i = 0; i < list.length; i++) {
                    callback(list[i], i)
                }
            }

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = `${percentages[index]}%`
                } else {
                    current.textContent = '---'
                }
            })
        },
        displayMonth: function() {
            var now, months, month, year
            now = new Date()
            year = now.getFullYear()
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            month = now.getMonth()
            document.querySelector(DOMStrings.dateLabel).textContent = `${months[month - 1]}/${year}`
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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    }

    var updateBudget = function() {
        // Calculate the Budget
        budgetCtrl.calculateBudget()
        // Return the budget
        var budget = budgetCtrl.getBudget()
        // Display the budget to the UI
        UICtrl.displayBudget(budget)
    }

    var updatePercentages = function() {
        // Calculate percentage
        budgetCtrl.calculatePercentages()
        // Read percentage from the budget controller
        var percentages = budgetCtrl.getPercentages()
        // Update the UI with the new percentages
        UICtrl.displayPercentages(percentages)
    }

    var ctrlDeleteItem = function(event) {
        var itemId, splitID, type, ID
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id
        if (itemId) {
            splitID = itemId.split('-')
            type = splitID[0]
            ID = parseInt(splitID[1])

            // Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID)
            // Delete the item from the UI
            UIController.deleteListItem(type, ID)
            // Update and show new budget
            updateBudget()
            updatePercentages()
        }
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
            // Calculate and updsate the percentages
            updatePercentages()
            
            }

        }

    
    return {
        init: function() {
            setUpEventListeners()
            UICtrl.displayMonth()
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
