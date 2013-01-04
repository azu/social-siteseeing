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
//100までとりあえず取得
var apiEndPoint = 'http://otter.topsy.com/trackbacks.json?perpage=100&url=';
var request = require("request").Request;
function getURL(url, callback){
    request({
        url : url,
        onComplete : function(response){
            var json = response.json;
            if (json == null){
                callback(new Error("response is not json"));
            }else{
                callback(null, json);
            }
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
    if (json.response.total === 0){
        return;
    }
    var displayOption = (typeof option === "object") ? option : {};
    var commentLists = json.response.list;
    var array = [];
    for (var i = 0, len = commentLists.length; i < len; i++){
        var list = commentLists[i];
        var isIgnored = false;
        var influence_level = (typeof list.author.influence_level !== "undefined") ? list.author.influence_level : 0;
        if (displayOption.ignoreNoComment && list.content.length == 0){
            isIgnored = true
            // }else if (displayOption.ignoreReTweet && influence_level == 0){
            // doesn't implement yet...
            // isIgnored = true;
        }
        // console.log(influence_level + " " + list.content.length, (isIgnored ? "remove" : "exist"));
        // 無視フラグが経ってないものを表示するものに追加する
        if (!isIgnored){
            array.push({
                "user" : list.author.name,
                "user_image" : list.author.photo_url,
                "date" : list.date_alpha,
                "comment" : list.content,
                "permalink_url" : list.permalink_url
            });
        }
    }
    return array;
}


exports.getTopsyJSON = getTopsyJSON;
exports.format = format;
