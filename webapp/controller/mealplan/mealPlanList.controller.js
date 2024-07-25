sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.demo.nav.controller.meal.MealList", {

        async onInit(...args) {

			this.mealId=0;
	  
			this.meal = {
			  id:this.mealId,
			  name:"",
			  description:""
			};
	  
			this.data = {
			  meals:[],
			  meal:this.meal
			};

            await this.getFetchedData();
		  },
		  
		  getFetchedData: async function() {
			//fetch('http://localhost:8318/Meal')
			fetch('${config.ApiService}Meal')
			  .then(x => x.json())
			  .then(y => {
				this.data.meals = y;
				this.getView().getModel().refresh();       
			  if (y.length > 0) {
				this.mealId = y[y.length - 1].id + 1;
			  } else {
				this.mealId = 0; 
			  }
			})
			  .catch(error => {
				console.error('Error fetching data:', error);
			  });
		  },
	  
		  onAfterRendering: async function(){
			  var oModel = new sap.ui.model.json.JSONModel(this.data);
			  this.getView().setModel(oModel);
			  if(!this.newMealDialog){
				this.newMealDialog = sap.ui.xmlfragment("fragment.addmeal", this);
				var oModel = new sap.ui.model.json.JSONModel();
				this.newMealDialog.setModel(oModel);
			  }
			  await this.getFetchedData();
		  },
	  
		  handleAddMeal: async function(oEvent){
			if(!this.newMealDialog){
			  this.newMealDialog = sap.ui.xmlfragment("fragment.addmeal", this);
			  var oModel = new sap.ui.model.json.JSONModel();
			  this.newMealDialog.setModel(oModel);
			}
	  
			this.meal.id=this.mealId;
			var data = JSON.parse(JSON.stringify(this.meal));
			this.newMealDialog.getModel(oModel).setData(data);
			this.newMealDialog.open();
		  },
	  
		  createMeal: async function(mealData){
			//var toSend = JSON.parse(JSON.stringify(this.meal));
			fetch('${config.ApiService}Meal', {
			  //fetch('http://localhost:8318/Meal', {
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json', },
			  body: JSON.stringify(
				{ name: mealData.name, description: mealData.description })
		  })
		  },
	  
		  handleDeleteMeal: function(oEvent){
			var oCurrentMeal = oEvent.getSource().getBindingContext().getObject();
			var oViewData = this.getView().getModel().getData();
	  
			for(var i=0; i<oViewData.meals.length>0; i++){
			  var temp= oViewData.meals[i];
			  if(temp.id === oCurrentMeal.id){
				oViewData.meals.splice(i, 1);
				this.deleteMeal(oCurrentMeal);
				break;
			  }
			}
			this.getView().getModel().setData(oViewData);
		  },
	  
		  deleteMeal: async function(mealData){
			//var toSend = JSON.parse(JSON.stringify(this.meal));
			fetch('${config.ApiService}Meal/' + mealData.id, {
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
			this.newMealDialog.close();
		  },
	  
		  handleSaveBtnPress: async function(oEvent){
			var oModel = oEvent.getSource().getModel();
			var oDialogData = oModel.getData();
			var oViewData = this.getView().getModel().getData();
	  
			if(this.gbEditing){
				for(var i=0; i<oViewData.meals.length>0; i++){
				  var temp= oViewData.meals[i];
				  if(temp.id === oDialogData.id){
					temp= oDialogData;
					oViewData.meals[i] = temp;
					break;
				  }
				}
				this.gbEditing = false;
				this.getView().getModel().setData(oViewData);
				this.newMealDialog.close();
				
				await this.editMeal(oDialogData);
				return;
			}
	  
			  // Update meal object properties before pushing
			  this.meal.name = oDialogData.name;
			  this.meal.description = oDialogData.description;
			
			oViewData.meals.push(oDialogData);
			this.getView().getModel().setData(oViewData);
			this.mealId++;
			this.newMealDialog.close();
			
			await this.createMeal(this.meal);
		  },
	  
		  handleEditMeal: function(oEvent){
			var oCurrentMeal = oEvent.getSource().getBindingContext().getObject();
			this.newMealDialog.getModel().setData(oCurrentMeal);
	  
			this.newMealDialog.open();
			this.gbEditing = true;
		  },
	  
		  editMeal: async function(mealData){
			  //fetch('http://localhost:8318/Meal', {
			  fetch('${config.ApiService}Meal', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json', },
				body: JSON.stringify(
					{ id: mealData.id, name: mealData.name, description: mealData.description })
			})
				.then(response => response)
				.then(data => {
					console.log('Success:', data);
				})
				.catch((error) => { console.error('Error:', error); });
		  },
		  GoToIngredients: function(){
            this.getRouter().navTo("ingredient");
		  }


	});

});
