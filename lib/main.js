var prefs = require("sdk/simple-prefs");

function isUrlInsideList(url,blacklist){
    for(var idx=0; idx<blacklist.length; idx++){
        var enc=blacklist[idx];
        var regex=new RegExp(enc,'i');
        if(regex.test(url)){
            return true;
        }
    }
    return false;
}

function convertListToRegExp(text){
    var lines=[];
    if(text){
        lines=text.split(/\n/gm);
    }
    var blacklist=[];
    for(var idx=0; idx<lines.length; idx++){
        var regex=lines[idx];
        if(regex.length){
            regex=regex.replace(/\//g,'\\/');//=/->\/
            regex=regex.replace(/\./g,'\\.');//=.->\.
            regex=regex.replace(/\*\*/g,'.+');//=**->.+
            regex=regex.replace(/\*/g,'[^/]+');//=*->[^/]+
            blacklist.push(regex);
        }
    }
    return blacklist;
}

function readListFile(filename){
    var text=null;
    if(filename){
        var io=require("sdk/io/file");
        if(io.exists(filename)){
            var reader=io.open(filename, 'r');
            if(!reader.closed){
                text=reader.read();
                reader.close();
            }
        }
    }
    return text;
}

function reloadListFile(){
    var filename=prefs.prefs['blacklist'];
    var text=readListFile(filename);
    return convertListToRegExp(text);
}

var opts={}
opts.blacklist=reloadListFile();

prefs.on("blacklist", function(){
    opts.blacklist=reloadListFile();
});
prefs.on('reload',function(){
    opts.blacklist=reloadListFile();
});

var { Cc, Ci, Cr } = require('chrome')
var { Class } = require('sdk/core/heritage');
var { Unknown } = require('sdk/platform/xpcom');

var observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);

var BlacklistObserver = Class({
    extends:  Unknown,
    interfaces: [ 'nsIObserver' ],
    topic: 'http-on-modify-request',
    register: function register() {
        observerService.addObserver(this, this.topic, false);
    },
    unregister: function() {
        observerService.removeObserver(this, this.topic);
    },
    observe: function observe(subject, topic, data) {
        subject.QueryInterface(Ci.nsIHttpChannel);
        var url = subject.URI.spec;
        var blacklist=opts.blacklist;
        if(isUrlInsideList(url,blacklist)){
            console.log('cancel: ',url);
            subject.cancel(Cr.NS_BINDING_ABORTED);
        }
    }
});

var observer = BlacklistObserver();
observer.register();
