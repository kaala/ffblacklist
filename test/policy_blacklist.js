var { Cc, Ci } = require('chrome')
var { Class } = require('sdk/core/heritage');
var { Unknown } = require('sdk/platform/xpcom');

var categoryManager = Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);

var ContentPolicy = Class({
    category: 'content-policy',
    entry: 'blacklist_policy',
    contractId: '@public/blacklist_policy',
    extends:  Unknown,
    interfaces: [ 'nsIContentPolicy' ],
    register: function register() {
        categoryManager.addCategoryEntry(this.category, this.entry, this.contractId, false, true);
    },
    unregister: function() {
        categoryManager.deleteCategoryEntry(this.category, this.entry, this.contractId, false, true);
    },
    shouldLoad: function (aContentType, aContentLocation, aRequestOrigin, aContext, aMimeTypeGuess, aExtra) {
        console.log(aContentLocation,aRequestOrigin);
        if(false){
            return Ci.nsIContentPolicy.REJECT_REQUEST;
        }
        return Ci.nsIContentPolicy.ACCEPT;
    },
    shouldProcess: function (aContentType, aContentLocation, aRequestOrigin, aContext, aMimeTypeGuess, aExtra) {
        console.log(aContentLocation,aRequestOrigin);
        return Ci.nsIContentPolicy.ACCEPT;
    }
});

var policy = ContentPolicy();
policy.register();
