/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/base/DataType","sap/ui/base/Object","sap/ui/core/Lib","sap/ui/thirdparty/jquery","sap/ui/core/library","sap/f/library","sap/m/library","sap/ui/layout/library"],function(e,a,t,i,jQuery){"use strict";var u=i.init({name:"sap.uxap",apiVersion:2,dependencies:["sap.ui.core","sap.f","sap.m","sap.ui.layout"],designtime:"sap/uxap/designtime/library.designtime",types:["sap.uxap.BlockBaseColumnLayout","sap.uxap.BlockBaseFormAdjustment","sap.uxap.Importance","sap.uxap.ObjectPageConfigurationMode","sap.uxap.ObjectPageHeaderDesign","sap.uxap.ObjectPageHeaderPictureShape","sap.uxap.ObjectPageSubSectionLayout","sap.uxap.ObjectPageSubSectionMode"],interfaces:["sap.uxap.IHeaderTitle","sap.uxap.IHeaderContent"],controls:["sap.uxap.AnchorBar","sap.uxap.BlockBase","sap.uxap.BreadCrumbs","sap.uxap.HierarchicalSelect","sap.uxap.ObjectPageHeader","sap.uxap.ObjectPageDynamicHeaderTitle","sap.uxap.ObjectPageDynamicHeaderContent","sap.uxap.ObjectPageHeaderActionButton","sap.uxap.ObjectPageHeaderContent","sap.uxap.ObjectPageLayout","sap.uxap.ObjectPageSection","sap.uxap.ObjectPageSectionBase","sap.uxap.ObjectPageSubSection"],elements:["sap.uxap.ModelMapping","sap.uxap.ObjectPageAccessibleLandmarkInfo","sap.uxap.ObjectPageHeaderLayoutData","sap.uxap.ObjectPageLazyLoader"],version:"1.123.0",extensions:{flChangeHandlers:{"sap.uxap.ObjectPageHeader":"sap/uxap/flexibility/ObjectPageHeader","sap.uxap.ObjectPageLayout":"sap/uxap/flexibility/ObjectPageLayout","sap.uxap.ObjectPageSection":"sap/uxap/flexibility/ObjectPageSection","sap.uxap.ObjectPageSubSection":"sap/uxap/flexibility/ObjectPageSubSection","sap.uxap.ObjectPageDynamicHeaderTitle":"sap/uxap/flexibility/ObjectPageDynamicHeaderTitle","sap.uxap.ObjectPageHeaderActionButton":"sap/uxap/flexibility/ObjectPageHeaderActionButton","sap.ui.core._StashedControl":{unstashControl:{changeHandler:"default",layers:{USER:true}},stashControl:{changeHandler:"default",layers:{USER:true}}}},"sap.ui.support":{publicRules:true}}});u.BlockBaseColumnLayout=a.createType("sap.uxap.BlockBaseColumnLayout",{isValid:function(e){return/^(auto|[1-4]{1})$/.test(e)}},a.getType("string"));u.BlockBaseFormAdjustment={BlockColumns:"BlockColumns",OneColumn:"OneColumn",None:"None"};a.registerEnum("sap.uxap.BlockBaseFormAdjustment",u.BlockBaseFormAdjustment);u.ObjectPageConfigurationMode={JsonURL:"JsonURL",JsonModel:"JsonModel"};a.registerEnum("sap.uxap.ObjectPageConfigurationMode",u.ObjectPageConfigurationMode);u.ObjectPageHeaderDesign={Light:"Light",Dark:"Dark"};a.registerEnum("sap.uxap.ObjectPageHeaderDesign",u.ObjectPageHeaderDesign);u.ObjectPageHeaderPictureShape={Circle:"Circle",Square:"Square"};a.registerEnum("sap.uxap.ObjectPageHeaderPictureShape",u.ObjectPageHeaderPictureShape);u.ObjectPageSubSectionLayout={TitleOnTop:"TitleOnTop",TitleOnLeft:"TitleOnLeft"};a.registerEnum("sap.uxap.ObjectPageSubSectionLayout",u.ObjectPageSubSectionLayout);u.ObjectPageSubSectionMode={Collapsed:"Collapsed",Expanded:"Expanded"};a.registerEnum("sap.uxap.ObjectPageSubSectionMode",u.ObjectPageSubSectionMode);u.Importance={Low:"Low",Medium:"Medium",High:"High"};a.registerEnum("sap.uxap.Importance",u.Importance);u.Utilities={getClosestOPL:function(e){while(e&&!t.isObjectA(e,"sap.uxap.ObjectPageLayout")){e=e.getParent()}return e},isPhoneScenario:function(a){if(e.system.phone){return true}return u.Utilities._isCurrentMediaSize("Phone",a)},isTabletScenario:function(e){return u.Utilities._isCurrentMediaSize("Tablet",e)},_isCurrentMediaSize:function(e,a){return a&&a.name===e},getChildPosition:function(e,a){var t=e instanceof jQuery?e:jQuery(e),i=a instanceof jQuery?a:jQuery(a),u=jQuery(document.documentElement),n=t.position(),s=t.offsetParent(),p;while(!s.is(i)&&!s.is(u)){p=s.position();n.top+=p.top;n.left+=p.left;s=s.offsetParent()}return n}};return u});
//# sourceMappingURL=library.js.map