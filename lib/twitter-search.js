/**
 * User: azu
 * Date: 2013/05/04
 * License: MIT License
 */

var apiEndPoint = 'https://search.twitter.com/search.json?q=';
var request = require("sdk/request").Request;
function getURL(url, callback){
    request({
        url : url,
        onComplete : function(response){
            callback(null, response.json);
        }
    }).get();
}
function getTwitterJSON(target, callback){
    var siteURL = target.replace(/https?:\/\//i, "");
    var apiURL = apiEndPoint + encodeURIComponent(siteURL);
    getURL(apiURL, function(err, content){
        if (err){
            return callback(err);
        }
        return callback(null, content);
    });
}

function parseDate(date){
    return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
}
function format(json, option){
    var displayOption = (typeof option === "object") ? option : {};
    var commentLists = json["results"];
    var array = [];
    console.log(json)
    for (var i = 0, len = commentLists.length; i < len; i++){
        var list = commentLists[i];
        if (!(displayOption.ignoreNoComment && list["text"].length === 0)){
            array.push({
                "user" : list["from_user"],
                "user_image" : list["profile_image_url"],
                "date" : parseDate(new Date(list["created_at"])),
                "comment" : list["text"]
            });
        }
    }
    return array;
}


exports.getTwitterJSON = getTwitterJSON;
exports.format = format;
