({
    toogleRightSection: function (c, e, h) {
        c.set("v.rightRegionCollapsed", !c.get("v.rightRegionCollapsed"));
        $A.util.toggleClass(c.find("rightRegionDiv"), "hideDisplay")
        h.callMainRegionSizeHelper(c);
    },

    toogleLeftSection: function (c, e, h) {
        c.set("v.leftRegionCollapsed", !c.get("v.leftRegionCollapsed"));
        $A.util.toggleClass(c.find("leftRegionDiv"), "hideDisplay")
        h.callMainRegionSizeHelper(c);
    }
})