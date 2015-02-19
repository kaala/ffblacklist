// http://manhua.ali213.net/comic/6873/207955.html

function checkBlockList(url,blacklist) {
    for(var idx=0; idx<blacklist.length; idx++){
        var enc=blacklist[idx];
        enc=enc.replace(/\//g,'\\/');
        enc=enc.replace(/\./g,'\\.');
        enc=enc.replace(/\*/g,'\\w+');
        var regex=new RegExp(enc,'i');
        if(regex.test(url)){
            return true;
        }
    };
    return false;
}

function extractElements(tag_name){
    var elements=[];
    var collection=document.getElementsByTagName(tag_name);
    for(var idx=0; idx<collection.length; idx++){
        var item=collection[idx];
        elements.push(item);
    }
    return elements;
}

function removeBlockUrl(blacklist){
    var page_elements=[];
    page_elements=page_elements.concat(extractElements('script'));
    page_elements=page_elements.concat(extractElements('iframe'));
    page_elements=page_elements.concat(extractElements('img'));
    for(var idx=0; idx<page_elements.length; idx++){
        var element=page_elements[idx];
        var src=element.src;
        if(src.length) {
            if(checkBlockList(src,blacklist)){
                console.log(src);
                element.src='';
            }
        }
    }
}

var opts=self.options.opts;
var url_blacklist=opts.blacklist;
removeBlockUrl(url_blacklist);
