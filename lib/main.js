var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var prefs = require("sdk/simple-prefs");
var storage = require("sdk/simple-storage");

function parseList(){
    var text=storage.storage.blacklist;
    var sp=[];
    if(text){
        sp=text.split(/\n/gm);
    }
    var blacklist=[];
    for(var idx=0; idx<sp.length; idx++){
        var obj=sp[idx];
        if(obj.length){
            blacklist.push(obj);
        }
    }
    console.log(blacklist);
    return blacklist;
}

function readList(){
    var filename=prefs.prefs['blacklist'];
    if(filename){
        var io=require("sdk/io/file");
        var text=null;
        if(io.exists(filename)){
            var reader=io.open(filename, 'r');
            if(!reader.closed){
                text=reader.read();
                reader.close();
            }
        }
        storage.storage.blacklist=text;
    }
}

var opts={}
opts.blacklist=parseList();

prefs.on("blacklist", function(){
    readList();    
    opts.blacklist=parseList();
});
prefs.on('reload',function(){
    readList();    
    opts.blacklist=parseList();
});

pageMod.PageMod({
    include: "*",
    contentScriptFile: self.data.url("url_remove.js"),
    contentScriptOptions: {opts: opts},
    contentScriptWhen: "start"
});
pageMod.PageMod({
    include: "*",
    contentScriptFile: self.data.url("url_remove.js"),
    contentScriptOptions: {opts: opts},
    contentScriptWhen: "ready"
});
pageMod.PageMod({
    include: "*",
    contentScriptFile: self.data.url("url_remove.js"),
    contentScriptOptions: {opts: opts},
    contentScriptWhen: "end"
});
