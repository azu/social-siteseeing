/**
 * Created by azu.
 * Date: 12/10/08 19:22
 * License: MIT License
 */

var panel = {
    clear : "kPanelClear",
    seeing : "kSeeing"
};
self.port.on(panel.seeing, function(data){
    //テンプレートの取得
    var source = document.querySelector("#entry-template").innerHTML;
    //テンプレートのコンパイル
    var template = Handlebars.compile(source, function(){
    });
    //テンプレートに渡すパラメータ
    var context = data;

    //独自のヘルパーファンクションを登録
    Handlebars.registerHelper('fullName', function(person){
        return person.firstName + " " + person.lastName;
    });
    Handlebars.registerHelper('agree_button', function(){
        return new Handlebars.SafeString("<button>I agree. I "
                + this.emotion + " " + this.name + "</button>");
    });
    Handlebars.registerHelper('list', function(items, options){
        var out = "<ul>";

        for (var i = 0, l = items.length; i < l; i++){
            out = out + "<li>" + options.fn(items[i]) + "</li>";
        }

        return out + "</ul>";
    });
    //テンプレートとパラメータをマージ
    var result = template(context);

    //結果を出力
    document.querySelector(data.insertElementSelector).innerHTML = result;
});
self.port.on(panel.clear, function(data){
    var siteDiv = document.querySelectorAll("#contents > div");
    for (var i = 0, len = siteDiv.length; i < len; i++){
        var div = siteDiv[i];
        div.innerHTML = "";
    }
})
