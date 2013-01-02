/**
 * Created by azu.
 * Date: 12/12/31 22:43
 * License: MIT License
 */
/**
 * Created by azu.
 * Date: 12/10/08 16:28
 * License: MIT License
 */
var apiEndPoint = 'http://otter.topsy.com/trackbacks.json?url=';
var request = require("request").Request;
function getURL(url, callback){
    request({
        url : url,
        onComplete : function(response){
            callback(null, response.json);
        }
    }).get();
}
function getTopsyJSON(target, callback){
    var apiURL = apiEndPoint + encodeURIComponent(target);
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
    var commentLists = json.response.list;
    var array = [];
    for (var i = 0, len = commentLists.length; i < len; i++){
        var list = commentLists[i];
        if (!(displayOption.ignoreNoComment && list.content.length === 0)){
            array.push({
                "user" : list.author.name,
                "user_image" : list.author.photo_url,
                "date" : parseDate(new Date(list.date)),
                "comment" : list.content
            });
        }
    }
    return array;
}


exports.getTopsyJSON = getTopsyJSON;
exports.format = format;
