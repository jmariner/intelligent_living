/*	=== poor man's jQuery ===
	this is basically an improved document.querySelectorAll
	with default value support and ability to return a single value
	when only one element is found
*/
function $(sel, defaultVal) {
	var result = document.querySelectorAll(sel);
	if (result.length === 1) return result[0];
	else if (result.length === 0) {
		if (defaultVal !== undefined) return defaultVal;
		else throw "Element not found: '" + sel + "'";
	}
	else return result;
}

// get the BoundingClientRect of an element; used for calculating navbar affix
// supports an element or selector
function rect(obj) {
	if (typeof obj === "string") obj = $(obj);
	if (obj instanceof Array) obj = obj[0];
	return obj.getBoundingClientRect();
}

/*	=== class editing functions ===
	allowing adding, removing, and setting according to a boolean
	of classes on elements
*/

function addClass(el, classes) { setClassState(el, classes, true); }

function removeClass(el, classes) { setClassState(el, classes, false); }

function setClassState(el, classes, state) {
	if (el instanceof Element) {
		classes.split(" ").forEach(function(cls) {
			if (state) el.classList.add(cls);
			else el.classList.remove(cls);
		});
	}
}

// step up the element tree via .parentElement
// to find a certain level of ancestor
function getAncestor(el, level) {
	var ancestor = el;

	for (var i = 0; i < level; i++)
		ancestor = ancestor.parentElement;

	return ancestor;
}

// parse the query string (location.search) that's set by form submission
function getQueryData(key) {

	var queryString = location.search.substring(1);

	// object storing key-value pairs from the query string
	var query = {};

	// split on "&" and parse each section
	queryString.split("&").forEach(function(part) {
		// split on the first equals sign; taking what's before it
		// as the key and what's after as the value
		var eq = part.indexOf("=");
		var k = part.slice(0, eq);
		var v = part.slice(eq + 1);

		// decodeURIComponenent to hanldles %20 and such, and replace + with space
		query[k.toLowerCase()] = v ? decodeURIComponent(v).replace(/\+/g, " ") : "";
	});

	// return the whole object unless a particular key was asked for
	return key ? query[key] : query;
}

// polyfill for NodeList.prototype.forEach (for IE11)
// NodeList is what's returned from querySelectorAll
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}