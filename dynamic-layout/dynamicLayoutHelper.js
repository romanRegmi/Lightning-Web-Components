({
    callMainRegionSizeHelper : function(c) {
        var mainRegionDiv = c.find("mainRegionDiv");
        if(!c.get("v.leftRegionCollapsed") && !c.get("v.rightRegionCollapsed")) {
            if(!$A.util.hasClass(mainRegionDiv, "slds-size_6-of-12")) {
                $A.util.toggleClass(mainRegionDiv, "slds-size_6-of-12");
            }
        } else {
            if($A.util.hasClass(mainRegionDiv, "slds-size_6-of-12")) {
                $A.util.toggleClass(mainRegionDiv, "slds-size_6-of-12");
            }
        }
    }
})