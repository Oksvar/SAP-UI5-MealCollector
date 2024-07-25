sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.demo.nav.controller.ingredient.IngredientList", {

        async onInit(...args) {

			this.ingredientId=0;
	  
			this.ingredient = {
			  id:this.ingredientId,
			  name:"",
			  description:"",
			  measureMent:""
			};
	  
			this.data = {
			  ingredients:[],
			  ingredient:this.ingredient
			};

            await this.getFetchedData();
		  },
		  
		  getFetchedData: async function() {
			//fetch('http://localhost:8318/Meal')
			fetch('${config.ApiService}Ingredient')
			  .then(x => x.json())
			  .then(y => {
				this.data.ingredients = y;
				this.getView().getModel().refresh();       
			  if (y.length > 0) {
				this.ingredientId = y[y.length - 1].id + 1;
			  } else {
				this.ingredientId = 0; 
			  }
			})
			  .catch(error => {
				console.error('Error fetching data:', error);
			  });
		  },
	  
		  onAfterRendering: async function(){
			  var oModel = new sap.ui.model.json.JSONModel(this.data);
			  this.getView().setModel(oModel);
			  if(!this.newIngredientDialog){
				this.newIngredientDialog = sap.ui.xmlfragment("fragment.addingredient", this);
				var oModel = new sap.ui.model.json.JSONModel();
				this.newIngredientDialog.setModel(oModel);
			  }
			  await this.getFetchedData();
		  },
	  
		  handleAddIngredient: async function(oEvent){
			if(!this.newIngredientDialog){
			  this.newIngredientDialog = sap.ui.xmlfragment("fragment.addingredient", this);
			  var oModel = new sap.ui.model.json.JSONModel();
			  this.newIngredientDialog.setModel(oModel);
			}
	  
			this.ingredient.id=this.ingredientId;
			var data = JSON.parse(JSON.stringify(this.ingredient));
			this.newIngredientDialog.getModel(oModel).setData(data);
			this.newIngredientDialog.open();
		  },
	  
		  createIngredient: async function(ingredientData){
			//var toSend = JSON.parse(JSON.stringify(this.meal));
			fetch('${config.ApiService}Ingredient', {
			  //fetch('http://localhost:8318/Meal', {
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json', },
			  body: JSON.stringify(
				{ name: ingredientData.name, description: ingredientData.description, measureMent: ingredientData.measureMent })
		  })
		  },
	  
		  handleDeleteIngredient: function(oEvent){
			var oCurrentIngredient = oEvent.getSource().getBindingContext().getObject();
			var oViewData = this.getView().getModel().getData();
	  
			for(var i=0; i<oViewData.ingredients.length>0; i++){
			  var temp= oViewData.ingredients[i];
			  if(temp.id === oCurrentIngredient.id){
				oViewData.ingredients.splice(i, 1);
				this.deleteIngredient(oCurrentIngredient);
				break;
			  }
			}
			this.getView().getModel().setData(oViewData);
		  },
	  
		  deleteIngredient: async function(ingredientData){
			//var toSend = JSON.parse(JSON.stringify(this.meal));
			fetch('${config.ApiService}Ingredient/' + ingredientData.id, {
			  //fetch('http://localhost:8318/Meal/' + mealData.id, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json', },
				body: null
			})
				.then(response => response)
				.then(data => {
					console.log('Success:', data);
				})
				.catch((error) => { console.error('Error:', error); alert("This instance is connected to something else in the database, first you should delete them as well") });
		  },
	  
		  handleCancelBtnPress: function()
		  {
			this.newIngredientDialog.close();
		  },
	  
		  handleSaveBtnPress: async function(oEvent){
			var oModel = oEvent.getSource().getModel();
			var oDialogData = oModel.getData();
			var oViewData = this.getView().getModel().getData();
	  
			if(this.gbEditing){
				for(var i=0; i<oViewData.ingredients.length>0; i++){
				  var temp= oViewData.ingredients[i];
				  if(temp.id === oDialogData.id){
					temp= oDialogData;
					oViewData.ingredients[i] = temp;
					break;
				  }
				}
				this.gbEditing = false;
				this.getView().getModel().setData(oViewData);
				this.newIngredientDialog.close();
				
				await this.editIngredient(oDialogData);
				return;
			}
	  
			  // Update meal object properties before pushing
			  this.ingredient.name = oDialogData.name;
			  this.ingredient.description = oDialogData.description;
			  this.ingredient.measureMent = oDialogData.measureMent;
			
			oViewData.ingredients.push(oDialogData);
			this.getView().getModel().setData(oViewData);
			this.ingredientId++;
			this.newIngredientDialog.close();
			
			await this.createIngredient(this.ingredient);
		  },
	  
		  handleEditIngredient: function(oEvent){
			var oCurrentIngredient = oEvent.getSource().getBindingContext().getObject();
			this.newIngredientDialog.getModel().setData(oCurrentIngredient);
	  
			this.newIngredientDialog.open();
			this.gbEditing = true;
		  },
	  
		  editIngredient: async function(ingredientData){
			  //fetch('http://localhost:8318/Meal', {
			  fetch('${config.ApiService}Ingredient', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json', },
				body: JSON.stringify(
					{ id: ingredientData.id, name: ingredientData.name, description: ingredientData.description, measureMent: ingredientData.measureMent })
			})
				.then(response => response)
				.then(data => {
					console.log('Success:', data);
				})
				.catch((error) => { console.error('Error:', error); });
		  },
		  GoToHome: function(){
            this.getRouter().navTo("apphome");
		  }


	});

});
