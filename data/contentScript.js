/**
 * Created by azu.
 * Date: 12/10/08 19:22
 * License: MIT License
 */

var panel = {
    clear : "kPanelClear",
    seeing : "kSeeing"
};
window.addEventListener("click", function(event){
    var target = event.target
    if (target.nodeName == 'A'){
        event.preventDefault();
        self.port.emit('click-link', target.toString());
    }
}, false);
self.port.on(panel.seeing, function(data){
    var insertElem = document.querySelector(data.insertElementSelector);

    // 前回の位置が残るので、トップにスクロールしておく
    window.scrollTo(0, 0);
    // 既に中身があるなら消す
    emptyElem(insertElem);
    if (!data){
        return;
    }
    //テンプレートの取得
    var source = document.querySelector("#entry-template").innerHTML;
    //テンプレートのコンパイル
    var template = Handlebars.compile(source, function(){
    });
    //テンプレートとパラメータをマージ
    var result = template(data);
    //結果を出力
    insertElem.innerHTML = result;

    var loadingElem = document.querySelector(data.insertElementSelector + "> .loading");
    loadingElem.classList.remove("loading");
});
// クリア
function emptyTemplate(){
    var siteDiv = document.querySelectorAll("#contents > div");
    for (var i = 0, len = siteDiv.length; i < len; i++){
        var div = siteDiv[i];
        emptyElem(div);
    }
}
self.port.on(panel.clear, emptyTemplate)

// elementの子を消す
function emptyElem(element){
    while (element.firstChild){
        element.removeChild(element.firstChild);
    }
}