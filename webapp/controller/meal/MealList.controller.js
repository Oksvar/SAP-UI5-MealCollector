sap.ui.define([
    "sap/ui/demo/nav/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, Fragment, Filter, FilterOperator, MessageToast) {
    "use strict";

    return BaseController.extend("sap.ui.demo.nav.controller.meal.MealList", {
        onInit: function () {
            this.mealId = 0;
            this.meal = {
                id: this.mealId,
                name: "",
                description: "",
                ingredients: []
            };
            this.data = {
                meals: [],
                meal: this.meal
            };

            // Initialize selectedIngredients model
            this.getView().setModel(new JSONModel({ items: [] }), "selectedIngredients");

            this._loadMeals();
            this._loadIngredients();
        },

        _loadMeals: function () {
            fetch(`${config.ApiService}Meal`)
                .then(response => response.json())
                .then(data => {
                    this.data.meals = data;
                    if (data.length > 0) {
                        this.mealId = data[data.length - 1].id + 1;
                    } else {
                        this.mealId = 0;
                    }
                    this.getView().setModel(new JSONModel(this.data));
                    this._updateMealsWithIngredients();
                })
                .catch(error => console.error('Error fetching meals:', error));
        },


        _loadIngredients: function () {
            console.log("Fetching ingredients...");
            fetch(`${config.ApiService}Ingredient`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Ingredients fetched:", data);
                    var oModel = new sap.ui.model.json.JSONModel({ ingredients: data });
                    this.getView().setModel(oModel, "ingredients");
                })
                .catch(error => console.error('Error fetching ingredients:', error));
        },

        _loadMealIngredients: function (mealId) {
            return fetch(`${config.ApiService}Meal/${mealId}/ingredients`)
                .then(response => response.json())
                .then(data => {
                    const ingredients = data.map(item => ({
                        id: item.ingredient.id,
                        name: item.ingredient.name,
                        description: item.ingredient.description,
                        measureMent: item.ingredient.measureMent,
                        amount: item.amount
                    }));

                    return ingredients;
                })
                .catch(error => console.error('Error fetching meal ingredients:', error));
        },

        handleAddMeal: function (oEvent) {
            if (!this.newMealDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "fragment.addmeal",
                    controller: this
                }).then(function (oDialog) {
                    this.newMealDialog = oDialog;
                    this.getView().addDependent(this.newMealDialog);
                    this._openMealDialog();
                }.bind(this));
            } else {
                this._openMealDialog();
            }
        },

        _openMealDialog: function () {
            var newMeal = Object.assign({}, this.meal, { id: this.mealId });
            this.newMealDialog.setModel(new JSONModel(newMeal));

            // Clear selected ingredients model
            this.getView().getModel("selectedIngredients").setProperty("/items", []);
            this._updateSelectedIngredients();

            this.newMealDialog.open();
        },
        _openEditMealDialog: function (oCurrentMeal) {
            if (!this.newMealDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "fragment.addmeal",
                    controller: this
                }).then(function (oDialog) {
                    this.newMealDialog = oDialog;
                    this.getView().addDependent(this.newMealDialog);
                    this._initializeEditMealDialog(oCurrentMeal);
                }.bind(this));
            } else {
                this._initializeEditMealDialog(oCurrentMeal);
            }
        },

        _initializeEditMealDialog: function (oCurrentMeal) {
            this.newMealDialog.setModel(new JSONModel(oCurrentMeal));
        
            // Fetch and set ingredients for the selected meal
            this._loadMealIngredients(oCurrentMeal.id).then(ingredients => {
                this.getView().getModel("selectedIngredients").setProperty("/items", ingredients);
                this._updateSelectedIngredients();
                this.newMealDialog.open();
            });
        },

        handleTableSelectDialogPress: function () {
            if (!this.oIngredientDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "fragment.IngredientSelectDialog",
                    controller: this
                }).then(function (oDialog) {
                    this.oIngredientDialog = oDialog;
                    this.getView().addDependent(this.oIngredientDialog);

                    // Preselect assigned ingredients
                    const selectedIngredients = this.getView().getModel("selectedIngredients").getProperty("/items") || [];
                    const ingredientIds = selectedIngredients.map(item => item.id);
                    oDialog.getBinding("items").attachChange(() => {
                        oDialog.getItems().forEach(item => {
                            if (ingredientIds.includes(item.getBindingContext("ingredients").getObject().id)) {
                                item.setSelected(true);
                            }
                        });
                    });

                    this.oIngredientDialog.open();
                }.bind(this));
            } else {
                this.oIngredientDialog.open();
            }
        },

        handleIngredientSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("name", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        handleIngredientSelect: function (oEvent) {
            var selectedItems = oEvent.getParameter("selectedItems");
            var selectedIngredients = selectedItems.map(function (item) {
                return item.getBindingContext("ingredients").getObject();
            });

            var oModel = this.getView().getModel("selectedIngredients");
            if (!oModel) {
                oModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oModel, "selectedIngredients");
            }
            oModel.setProperty("/items", selectedIngredients);

            this._updateSelectedIngredients();
            this.oIngredientDialog.close();
        },

        handleIngredientCancel: function (oEvent) {
            oEvent.getSource().getBinding("items").filter([]);
        },

        _updateSelectedIngredients: function () {
            var oVBox = this.byId("ingredientListBox");
            oVBox.removeAllItems();

            var oModel = this.getView().getModel("selectedIngredients");
            var aSelectedIngredients = oModel.getProperty("/items") || [];

            aSelectedIngredients.forEach(function (ingredient) {
                var oHBox = new sap.m.HBox({
                    items: [
                        new sap.m.Text({ text: ingredient.name }),
                        new sap.m.Text({ text: ":" }),
                        new sap.m.Input({ value: ingredient.amount, placeholder: "Enter amount", change: function (oEvent) {
                            ingredient.amount = oEvent.getSource().getValue();
                        }}),
                        new sap.m.Text({ text: ingredient.measureMent })
                    ]
                });
                oVBox.addItem(oHBox);
            });
        },

        handleCancelBtnPress: function () {
            this.newMealDialog.close();
        },

        handleSaveBtnPress: async function (oEvent) {
            var oModel = oEvent.getSource().getModel();
            var oDialogData = oModel.getData();
            var oViewData = this.getView().getModel().getData();

            // Get selected ingredients
            var selectedIngredients = this.getView().getModel("selectedIngredients").getProperty("/items");

            if (this.gbEditing) {
                for (var i = 0; i < oViewData.meals.length > 0; i++) {
                    var temp = oViewData.meals[i];
                    if (temp.id === oDialogData.id) {
                        temp = oDialogData;
                        temp.ingredients = selectedIngredients; // Set ingredients
                        oViewData.meals[i] = temp;
                        break;
                    }
                }
                this.gbEditing = false;
                this.getView().getModel().setData(oViewData);
                this.newMealDialog.close();

                await this.editMeal(oDialogData);
                await this._saveIngredientsToMeal(oDialogData.id, selectedIngredients);
                return;
            }

            this.meal.name = oDialogData.name;
            this.meal.description = oDialogData.description;
            this.meal.ingredients = selectedIngredients;

            oViewData.meals.push(oDialogData);
            this.getView().getModel().setData(oViewData);
            this.mealId++;
            this.newMealDialog.close();

            await this.createMeal(this.meal);
            await this._saveIngredientsToMeal(oDialogData.id, selectedIngredients);
        },

        handleEditMeal: function (oEvent) {
            var oCurrentMeal = oEvent.getSource().getBindingContext().getObject();
            this.gbEditing = true;
            this._openEditMealDialog(oCurrentMeal);
        },

        editMeal: async function (mealData) {
            fetch('${config.ApiService}Meal', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: mealData.id,
                    name: mealData.name,
                    description: mealData.description
                })
            })
                .then(response => response)
                .then(data => {
                    console.log('Success:', data);
                    this._loadMeals();
                })
                .catch(error => console.error('Error:', error));
        },

        _saveIngredientsToMeal: async function (mealId, ingredients) {
            const promises = ingredients.map(ingredient => {
                const amount = ingredient.amount || 0; // Default to 0 if amount is undefined
                return fetch(`${config.ApiService}Meal/${mealId}/ingredient/${ingredient.id}/amount/${amount}`, {
                    method: 'POST'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to add ingredient to meal');
                    }
                    console.log(`Added ingredient ${ingredient.id} to meal ${mealId} with amount ${amount}`);
                })
                .catch(error => console.error('Error adding ingredient to meal:', error));
            });

            await Promise.all(promises);
        },

        createMeal: async function (mealData) {
            fetch('${config.ApiService}Meal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: mealData.id,
                    name: mealData.name,
                    description: mealData.description
                })
            })
                .then(response => response.json())
                .then(async data => {
                    console.log('Success:', data);
                    mealData.id = data.id;
                    await this._saveIngredientsToMeal(data.id, mealData.ingredients);
                })
                .catch(error => console.error('Error:', error));
        },

        handleDeleteMeal: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var oContext = oItem.getBindingContext();
            var oMeal = oContext.getObject();

            fetch(`${config.ApiService}Meal/${oMeal.id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete meal');
                }
                console.log(`Deleted meal ${oMeal.id}`);
                this._loadMeals();
                /* this._loadMealIngredients(oMeal.id); */
            })
            .catch(error => console.error('Error deleting meal:', error));
        },

        GoToIngredients: function () {
            this.getRouter().navTo("ingredient");
        },

        _getIngredientString: function (ingredients) {
            return ingredients.map(ingredient => `${ingredient.name}: ${ingredient.amount} ${ingredient.measureMent}`).join('\n');
        },

        _updateMealsWithIngredients: async function () {
            for (const meal of this.data.meals) {
                const ingredients = await this._loadMealIngredients(meal.id);
                meal.ingredientString = this._getIngredientString(ingredients);
            }
            this.getView().getModel().refresh();
        }
    });
});
