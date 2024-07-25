sap.ui.define([
	"sap/ui/demo/nav/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.demo.nav.controller.Home", {

		onDisplayNotFound : function () {
			// display the "notFound" target without changing the hash
			this.getRouter().getTargets().display("notFound", {
				fromTarget : "home"
			});
		},

		onNavToMeals : function () {
			this.getRouter().navTo("mealList");
		},

		onNavToIngredients : function () {
			this.getRouter().navTo("ingredientList");
		},

		onNavToMealPlans : function () {
			this.getRouter().navTo("mealPlanList");
		}

	});

});
