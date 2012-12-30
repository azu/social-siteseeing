var data = require("self").data;
var hatebu = require("./hatebu");
var Hotkey = require("hotkeys").Hotkey;
var fbug = require("./fbug").fbug;
var constants = require("./constants");
var socialPanel = require("panel").Panel({
    width : 600,
    height : 300,
    contentURL : data.url("view.html"),
    contentScriptFile : [data.url("handlebars-1.0.rc.1.js"), data.url("contentScript.js")],
    onHide : function(){
        socialPanel.port.emit("clear");
    }
});

var socialWidget = require("widget").Widget({
    id : "open-clock-btn",
    label : "Clock",
    contentURL : "http://www.mozilla.org/favicon.ico",
    panel : socialPanel,
    onClick : seeingHatenaBookmark
});

function getItemNodeForWidget(widget){
    var item;
    for (var win in require("window-utils").windowIterator()){
        var doc = win.document;
        var bar = doc.getElementById("addon-bar");
        var selector = 'toolbaritem[id$="' + widget.id + '"]';
        item = bar.querySelector(selector);
    }
    return item;
}
var showHotKey = Hotkey({
    combo : "meta-shift-c",
    onPress : function(){
        if (socialPanel.isShowing){
            socialPanel.hide();
        }else{
            seeingHatenaBookmark(function(err, doc){
                var item = getItemNodeForWidget(socialWidget);
                socialPanel.show(item);
            });
        }
    }
});
function seeingHatenaBookmark(callback){
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
        socialPanel.port.emit(constants.panel.seeing, hatena);

        if (typeof callback === "function"){
            callback(err, doc);
        }
    });
}
