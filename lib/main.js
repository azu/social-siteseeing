var data = require("self").data;
var hatebu = require("./hatebu");
var fbug = require("./fbug").fbug;
var socialPanel = require("panel").Panel({
    width : 600,
    height : 300,
    contentURL : data.url("view.html"),
    contentScriptFile : [data.url("handlebars-1.0.rc.1.js"), data.url("contentScript.js")],
    onHide : function(){
        socialPanel.port.emit("clear");
    }
});

require("widget").Widget({
    id : "open-clock-btn",
    label : "Clock",
    contentURL : "http://www.mozilla.org/favicon.ico",
    panel : socialPanel,
    onClick : function(){
        var targetURL = require("tabs").activeTab.url;
        hatebu.getHatebuJSON(targetURL, function(err, doc){
            var hatena = {
                insertElementSelector : "#hatena-bookmark",
                title : "はてなブックマーク",
                "count" : doc.count,
                "comments" : hatebu.format(doc, {
                    ignoreNoComment : true
                }),
                "url" : doc.entry_url
            }
            socialPanel.port.emit("seeing", hatena);
        });
    }
});