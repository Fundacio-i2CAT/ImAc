(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.imsc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* 
 * Copyright (c) 2016, Pierre-Anthony Lemieux <pal@sandflow.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @module imscDoc
 */

;
(function (imscDoc, sax, imscNames, imscStyles, imscUtils) {


    /**
     * Allows a client to provide callbacks to handle children of the <metadata> element
     * @typedef {Object} MetadataHandler
     * @property {?OpenTagCallBack} onOpenTag
     * @property {?CloseTagCallBack} onCloseTag
     * @property {?TextCallBack} onText
     */

    /**
     * Called when the opening tag of an element node is encountered.
     * @callback OpenTagCallBack
     * @param {string} ns Namespace URI of the element
     * @param {string} name Local name of the element
     * @param {Object[]} attributes List of attributes, each consisting of a
     *                              `uri`, `name` and `value`
     */

    /**
     * Called when the closing tag of an element node is encountered.
     * @callback CloseTagCallBack
     */

    /**
     * Called when a text node is encountered.
     * @callback TextCallBack
     * @param {string} contents Contents of the text node
     */

    /**
     * Parses an IMSC1 document into an opaque in-memory representation that exposes
     * a single method <pre>getMediaTimeEvents()</pre> that returns a list of time
     * offsets (in seconds) of the ISD, i.e. the points in time where the visual
     * representation of the document change. `metadataHandler` allows the caller to
     * be called back when nodes are present in <metadata> elements. 
     * 
     * @param {string} xmlstring XML document
     * @param {?module:imscUtils.ErrorHandler} errorHandler Error callback
     * @param {?MetadataHandler} metadataHandler Callback for <Metadata> elements
     * @returns {Object} Opaque in-memory representation of an IMSC1 document
     */

    imscDoc.fromXML = function (xmlstring, errorHandler, metadataHandler) {
        var p = sax.parser(true, {xmlns: true});
        var estack = [];
        var xmllangstack = [];
        var xmlspacestack = [];
        var metadata_depth = 0;
        var doc = null;

        p.onclosetag = function (node) {

            if (estack[0] instanceof Styling) {

                /* flatten chained referential styling */

                for (var sid in estack[0].styles) {

                    mergeChainedStyles(estack[0], estack[0].styles[sid], errorHandler);

                }

            } else if (estack[0] instanceof P || estack[0] instanceof Span) {

                /* merge anonymous spans */

                if (estack[0].contents.length > 1) {

                    var cs = [estack[0].contents[0]];

                    var c;

                    for (c = 1; c < estack[0].contents.length; c++) {

                        if (estack[0].contents[c] instanceof AnonymousSpan &&
                            cs[cs.length - 1] instanceof AnonymousSpan) {

                            cs[cs.length - 1].text += estack[0].contents[c].text;

                        } else {

                            cs.push(estack[0].contents[c]);

                        }

                    }

                    estack[0].contents = cs;

                }

                // remove redundant nested anonymous spans (9.3.3(1)(c))

                if (estack[0] instanceof Span &&
                    estack[0].contents.length === 1 &&
                    estack[0].contents[0] instanceof AnonymousSpan &&
                    estack[0].text === null) {

                    estack[0].text = estack[0].contents[0].text;
                    delete estack[0].contents;

                }

            } else if (estack[0] instanceof ForeignElement) {

                if (estack[0].node.uri === imscNames.ns_tt &&
                    estack[0].node.local === 'metadata') {

                    /* leave the metadata element */

                    metadata_depth--;

                } else if (metadata_depth > 0 &&
                    metadataHandler &&
                    'onCloseTag' in metadataHandler) {

                    /* end of child of metadata element */

                    metadataHandler.onCloseTag();

                }

            }

            // TODO: delete stylerefs?

            // maintain the xml:space stack

            xmlspacestack.shift();

            // maintain the xml:lang stack

            xmllangstack.shift();

            // prepare for the next element

            estack.shift();
        };

        p.ontext = function (str) {

            if (estack[0] === undefined) {

                /* ignoring text outside of elements */

            } else if (estack[0] instanceof Span || estack[0] instanceof P) {

                /* create an anonymous span */
                
                var s = new AnonymousSpan();
              
                s.initFromText(doc, estack[0], str, xmlspacestack[0], errorHandler);

                estack[0].contents.push(s);

            } else if (estack[0] instanceof ForeignElement &&
                metadata_depth > 0 &&
                metadataHandler &&
                'onText' in metadataHandler) {

                /* text node within a child of metadata element */

                metadataHandler.onText(str);

            }

        };


        p.onopentag = function (node) {

            // maintain the xml:space stack

            var xmlspace = node.attributes["xml:space"];

            if (xmlspace) {

                xmlspacestack.unshift(xmlspace.value);

            } else {

                if (xmlspacestack.length === 0) {

                    xmlspacestack.unshift("default");

                } else {

                    xmlspacestack.unshift(xmlspacestack[0]);

                }

            }

            /* maintain the xml:lang stack */


            var xmllang = node.attributes["xml:lang"];

            if (xmllang) {

                xmllangstack.unshift(xmllang.value);

            } else {

                if (xmllangstack.length === 0) {

                    xmllangstack.unshift("");

                } else {

                    xmllangstack.unshift(xmllangstack[0]);

                }

            }


            /* process the element */

            if (node.uri === imscNames.ns_tt) {

                if (node.local === 'tt') {

                    if (doc !== null) {

                        reportFatal("Two <tt> elements at (" + this.line + "," + this.column + ")");

                    }

                    doc = new TT();

                    doc.initFromNode(node, errorHandler);

                    estack.unshift(doc);

                } else if (node.local === 'head') {

                    if (!(estack[0] instanceof TT)) {
                        reportFatal("Parent of <head> element is not <tt> at (" + this.line + "," + this.column + ")");
                    }

                    if (doc.head !== null) {
                        reportFatal("Second <head> element at (" + this.line + "," + this.column + ")");
                    }

                    doc.head = new Head();

                    estack.unshift(doc.head);

                } else if (node.local === 'styling') {

                    if (!(estack[0] instanceof Head)) {
                        reportFatal("Parent of <styling> element is not <head> at (" + this.line + "," + this.column + ")");
                    }

                    if (doc.head.styling !== null) {
                        reportFatal("Second <styling> element at (" + this.line + "," + this.column + ")");
                    }

                    doc.head.styling = new Styling();

                    estack.unshift(doc.head.styling);

                } else if (node.local === 'style') {

                    var s;

                    if (estack[0] instanceof Styling) {

                        s = new Style();

                        s.initFromNode(node, errorHandler);

                        /* ignore <style> element missing @id */

                        if (!s.id) {

                            reportError("<style> element missing @id attribute");

                        } else {

                            doc.head.styling.styles[s.id] = s;

                        }

                        estack.unshift(s);

                    } else if (estack[0] instanceof Region) {

                        /* nested styles can be merged with specified styles
                         * immediately, with lower priority
                         * (see 8.4.4.2(3) at TTML1 )
                         */

                        s = new Style();

                        s.initFromNode(node, errorHandler);

                        mergeStylesIfNotPresent(s.styleAttrs, estack[0].styleAttrs);

                        estack.unshift(s);

                    } else {

                        reportFatal(errorHandler, "Parent of <style> element is not <styling> or <region> at (" + this.line + "," + this.column + ")");

                    }

                } else if (node.local === 'layout') {

                    if (!(estack[0] instanceof Head)) {

                        reportFatal(errorHandler, "Parent of <layout> element is not <head> at " + this.line + "," + this.column + ")");

                    }

                    if (doc.head.layout !== null) {

                        reportFatal(errorHandler, "Second <layout> element at " + this.line + "," + this.column + ")");

                    }

                    doc.head.layout = new Layout();

                    estack.unshift(doc.head.layout);

                } else if (node.local === 'region') {

                    if (!(estack[0] instanceof Layout)) {
                        reportFatal(errorHandler, "Parent of <region> element is not <layout> at " + this.line + "," + this.column + ")");
                    }

                    var r = new Region();

                    r.initFromNode(doc, node, errorHandler);

                    if (!r.id || r.id in doc.head.layout.regions) {

                        reportError(errorHandler, "Ignoring <region> with duplicate or missing @id at " + this.line + "," + this.column + ")");

                    } else {

                        doc.head.layout.regions[r.id] = r;

                        doc._registerEvent(r);

                    }

                    estack.unshift(r);

                } else if (node.local === 'body') {

                    if (!(estack[0] instanceof TT)) {

                        reportFatal(errorHandler, "Parent of <body> element is not <tt> at " + this.line + "," + this.column + ")");

                    }

                    if (doc.body !== null) {

                        reportFatal(errorHandler, "Second <body> element at " + this.line + "," + this.column + ")");

                    }

                    var b = new Body();

                    b.initFromNode(doc, node, errorHandler);

                    doc._registerEvent(b);

                    doc.body = b;

                    estack.unshift(b);

                } else if (node.local === 'div') {

                    if (!(estack[0] instanceof Div || estack[0] instanceof Body)) {

                        reportFatal(errorHandler, "Parent of <div> element is not <body> or <div> at " + this.line + "," + this.column + ")");

                    }

                    var d = new Div();

                    d.initFromNode(doc, estack[0], node, errorHandler);

                    doc._registerEvent(d);

                    estack[0].contents.push(d);

                    estack.unshift(d);

                } else if (node.local === 'p') {

                    if (!(estack[0] instanceof Div)) {

                        reportFatal(errorHandler, "Parent of <p> element is not <div> at " + this.line + "," + this.column + ")");

                    }

                    var p = new P();

                    p.initFromNode(doc, estack[0], node, errorHandler);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    doc._registerEvent(p);

                    estack[0].contents.push(p);

                    estack.unshift(p);

                } else if (node.local === 'span') {

                    if (!(estack[0] instanceof Span || estack[0] instanceof P)) {

                        reportFatal(errorHandler, "Parent of <span> element is not <span> or <p> at " + this.line + "," + this.column + ")");

                    }

                    var ns = new Span();

                    ns.initFromNode(doc, estack[0], node, xmlspacestack[0], errorHandler);

                    doc._registerEvent(ns);

                    estack[0].contents.push(ns);

                    estack.unshift(ns);

                } else if (node.local === 'br') {

                    if (!(estack[0] instanceof Span || estack[0] instanceof P)) {

                        reportFatal(errorHandler, "Parent of <br> element is not <span> or <p> at " + this.line + "," + this.column + ")");

                    }

                    var nb = new Br();

                    nb.initFromNode(doc, estack[0], node, errorHandler);

                    doc._registerEvent(nb);

                    estack[0].contents.push(nb);

                    estack.unshift(nb);

                } else if (node.local === 'set') {

                    if (!(estack[0] instanceof Span ||
                        estack[0] instanceof P ||
                        estack[0] instanceof Div ||
                        estack[0] instanceof Body ||
                        estack[0] instanceof Region ||
                        estack[0] instanceof Br)) {

                        reportFatal(errorHandler, "Parent of <set> element is not a content element or a region at " + this.line + "," + this.column + ")");

                    }

                    var st = new Set();

                    st.initFromNode(doc, estack[0], node, errorHandler);

                    doc._registerEvent(st);

                    estack[0].sets.push(st);

                    estack.unshift(st);

                } else {

                    /* element in the TT namespace, but not a content element */

                    estack.unshift(new ForeignElement(node));
                }

            } else {

                /* ignore elements not in the TTML namespace unless in metadata element */

                estack.unshift(new ForeignElement(node));

            }

            /* handle metadata callbacks */

            if (estack[0] instanceof ForeignElement) {

                if (node.uri === imscNames.ns_tt &&
                    node.local === 'metadata') {

                    /* enter the metadata element */

                    metadata_depth++;

                } else if (
                    metadata_depth > 0 &&
                    metadataHandler &&
                    'onOpenTag' in metadataHandler
                    ) {

                    /* start of child of metadata element */

                    var attrs = [];

                    for (var a in node.attributes) {
                        attrs[node.attributes[a].uri + " " + node.attributes[a].local] =
                            {
                                uri: node.attributes[a].uri,
                                local: node.attributes[a].local,
                                value: node.attributes[a].value
                            };
                    }

                    metadataHandler.onOpenTag(node.uri, node.local, attrs);

                }

            }

        };

        // parse the document

        p.write(xmlstring).close();

        // all referential styling has been flatten, so delete the styling elements if there is a head
        // otherwise create an empty head

        if (doc.head !== null) {
            delete doc.head.styling;
        } else {
            doc.head = new Head();
        }

        // create default region if no regions specified

        if (doc.head.layout === null) {

            doc.head.layout = new Layout();

        }

        var hasRegions = false;

        /* AFAIK the only way to determine whether an object has members */

        for (var i in doc.head.layout.regions) {

            hasRegions = true;

            break;

        }

        if (!hasRegions) {

            var dr = Region.createDefaultRegion();

            doc.head.layout.regions[dr.id] = dr;

        }

        return doc;
    };

    function ForeignElement(node) {
        this.node = node;
    }

    function TT() {
        this.events = [];
        this.head = null;
        this.body = null;
    }

    TT.prototype.initFromNode = function (node, errorHandler) {

        /* compute cell resolution */

        this.cellResolution = extractCellResolution(node, errorHandler);

        /* extract frame rate and tick rate */

        var frtr = extractFrameAndTickRate(node, errorHandler);

        this.effectiveFrameRate = frtr.effectiveFrameRate;

        this.tickRate = frtr.tickRate;

        /* extract aspect ratio */

        this.aspectRatio = extractAspectRatio(node, errorHandler);

        /* check timebase */

        var attr = findAttribute(node, imscNames.ns_ttp, "timeBase");

        if (attr !== null && attr !== "media") {

            reportFatal(errorHandler, "Unsupported time base");

        }

        /* retrieve extent */

        var e = extractExtent(node, errorHandler);

        if (e === null) {

            /* TODO: remove once unit tests are ready */

            this.pxDimensions = {'h': 480, 'w': 640};

        } else {

            if (e.h.unit !== "px" || e.w.unit !== "px") {
                reportFatal(errorHandler, "Extent on TT must be in px or absent");
            }

            this.pxDimensions = {'h': e.h.value, 'w': e.w.value};
        }

    };

    /* register a temporal events */
    TT.prototype._registerEvent = function (elem) {

        /* skip if begin is not < then end */

        if (elem.end <= elem.begin) return;

        /* index the begin time of the event */

        var b_i = indexOf(this.events, elem.begin);

        if (!b_i.found) {
            this.events.splice(b_i.index, 0, elem.begin);
        }

        /* index the end time of the event */

        if (elem.end !== Number.POSITIVE_INFINITY) {

            var e_i = indexOf(this.events, elem.end);

            if (!e_i.found) {
                this.events.splice(e_i.index, 0, elem.end);
            }

        }

    };


    /*
     * Retrieves the range of ISD times covered by the document
     * 
     * @returns {Array} Array of two elements: min_begin_time and max_begin_time
     * 
     */
    TT.prototype.getMediaTimeRange = function () {

        return [this.events[0], this.events[this.events.length - 1]];
    };

    /*
     * Returns list of ISD begin times  
     * 
     * @returns {Array}
     */
    TT.prototype.getMediaTimeEvents = function () {

        return this.events;
    };

    /*
     * Represents a TTML Head element
     */

    function Head() {
        this.styling = null;
        this.layout = null;
    }

    /*
     * Represents a TTML Styling element
     */

    function Styling() {
        this.styles = {};
    }

    /*
     * Represents a TTML Style element
     */

    function Style() {
        this.id = null;
        this.styleAttrs = null;
        this.styleRefs = null;
    }

    Style.prototype.initFromNode = function (node, errorHandler) {
        this.id = elementGetXMLID(node);
        this.styleAttrs = elementGetStyles(node, errorHandler);
        this.styleRefs = elementGetStyleRefs(node);
    };

    /*
     * Represents a TTML Layout element
     * 
     */

    function Layout() {
        this.regions = {};
    }

    /*
     * Represents a TTML Content element
     * 
     */

    function ContentElement(kind) {
        this.kind = kind;
        this.begin = null;
        this.end = null;
        this.styleAttrs = null;
        this.regionID = null;
        this.sets = null;
        this.timeContainer = null;
    }

    ContentElement.prototype.initFromNode = function (doc, parent, node, errorHandler) {

        var t = processTiming(doc, parent, node, errorHandler);
        this.begin = t.begin;
        this.end = t.end;

        this.styleAttrs = elementGetStyles(node, errorHandler);

        if (doc.head !== null && doc.head.styling !== null) {
            mergeReferencedStyles(doc.head.styling, elementGetStyleRefs(node), this.styleAttrs, errorHandler);
        }

        this.regionID = elementGetRegionID(node);

        this.sets = [];

        this.timeContainer = elementGetTimeContainer(node, errorHandler);

    };

    /*
     * Represents a TTML body element
     */

    function Body() {
        ContentElement.call(this, 'body');
    }

    Body.prototype.initFromNode = function (doc, node, errorHandler) {
        ContentElement.prototype.initFromNode.call(this, doc, null, node, errorHandler);
        this.contents = [];
    };

    /*
     * Represents a TTML div element
     */

    function Div() {
        ContentElement.call(this, 'div');
    }

    Div.prototype.initFromNode = function (doc, parent, node, errorHandler) {
        ContentElement.prototype.initFromNode.call(this, doc, parent, node, errorHandler);
        this.contents = [];
    };

    /*
     * Represents a TTML p element
     */

    function P() {
        ContentElement.call(this, 'p');
    }

    P.prototype.initFromNode = function (doc, parent, node, errorHandler) {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ContentElement.prototype.initFromNode.call(this, doc, parent, node, errorHandler);
        this.contents = [];
        this.id = elementGetXMLID(node);
        this.equirectangularLongitude = elementGetXMLImacPos(node);
    };

    /*
     * Represents a TTML span element
     */

    function Span() {
        ContentElement.call(this, 'span');
        this.space = null;
    }

    Span.prototype.initFromNode = function (doc, parent, node, xmlspace, errorHandler) {
        ContentElement.prototype.initFromNode.call(this, doc, parent, node, errorHandler);
        this.space = xmlspace;
        this.contents = [];
    };
    
    /*
     * Represents a TTML anonymous span element
     */
    
    function AnonymousSpan() {
        ContentElement.call(this, 'span');
        this.space = null;
        this.text = null;
    }
    
    AnonymousSpan.prototype.initFromText = function (doc, parent, text, xmlspace, errorHandler) {
        ContentElement.prototype.initFromNode.call(this, doc, parent, null, errorHandler);
        this.text = text;
        this.space = xmlspace;
    };

    /*
     * Represents a TTML br element
     */

    function Br() {
        ContentElement.call(this, 'br');
    }

    Br.prototype.initFromNode = function (doc, parent, node, errorHandler) {
        ContentElement.prototype.initFromNode.call(this, doc, parent, node, errorHandler);
    };

    /*
     * Represents a TTML Region element
     * 
     */

    function Region() {
        this.id = null;
        this.begin = null;
        this.end = null;
        this.styleAttrs = null;
        this.sets = null;
    }

    Region.createDefaultRegion = function () {
        var r = new Region();

        r.id = '';
        r.begin = 0;
        r.end = Number.POSITIVE_INFINITY;
        r.styleAttrs = {};
        r.sets = [];

        return r;
    };

    Region.prototype.initFromNode = function (doc, node, errorHandler) {

        this.id = elementGetXMLID(node);

        var t = processTiming(doc, null, node, errorHandler);
        this.begin = t.begin;
        this.end = t.end;

        this.styleAttrs = elementGetStyles(node, errorHandler);

        this.sets = [];

        /* immediately merge referenced styles */

        if (doc.head !== null && doc.head.styling !== null) {
            mergeReferencedStyles(doc.head.styling, elementGetStyleRefs(node), this.styleAttrs, errorHandler);
        }

    };

    /*
     * Represents a TTML Set element
     * 
     */

    function Set() {
        this.begin = null;
        this.end = null;
        this.qname = null;
        this.value = null;
    }

    Set.prototype.initFromNode = function (doc, parent, node, errorHandler) {

        var t = processTiming(doc, parent, node, errorHandler);

        this.begin = t.begin;
        this.end = t.end;

        var styles = elementGetStyles(node, errorHandler);

        for (var qname in styles) {

            if (this.qname) {

                reportError(errorHandler, "More than one style specified on set");
                break;

            }

            this.qname = qname;
            this.value = styles[qname];

        }

    };

    /*
     * Utility functions
     * 
     */


    function elementGetXMLID(node) {
        return node && 'xml:id' in node.attributes ? node.attributes['xml:id'].value || null : null;
    }

    function elementGetXMLImacPos(node) {
        return node && 'imac:equirectangularLongitude' in node.attributes ? node.attributes['imac:equirectangularLongitude'].value : undefined;
    }

    function elementGetRegionID(node) {
        return node && 'region' in node.attributes ? node.attributes.region.value : '';
    }

    function elementGetTimeContainer(node, errorHandler) {

        var tc = node && 'timeContainer' in node.attributes ? node.attributes.timeContainer.value : null;

        if ((!tc) || tc === "par") {

            return "par";

        } else if (tc === "seq") {

            return "seq";

        } else {

            reportError(errorHandler, "Illegal value of timeContainer (assuming 'par')");

            return "par";

        }

    }

    function elementGetStyleRefs(node) {

        return node && 'style' in node.attributes ? node.attributes.style.value.split(" ") : [];

    }

    function elementGetStyles(node, errorHandler) {

        var s = {};

        if (node !== null) {

            for (var i in node.attributes) {

                var qname = node.attributes[i].uri + " " + node.attributes[i].local;

                var sa = imscStyles.byQName[qname];

                if (sa !== undefined) {

                    var val = sa.parse(node.attributes[i].value);

                    if (val !== null) {

                        s[qname] = val;

                        /* TODO: consider refactoring errorHandler into parse and compute routines */

                        if (sa === imscStyles.byName.zIndex) {
                            reportWarning(errorHandler, "zIndex attribute present but not used by IMSC1 since regions do not overlap");
                        }

                    } else {

                        reportError(errorHandler, "Cannot parse styling attribute " + qname + " --> " + node.attributes[i].value);

                    }

                }

            }

        }

        return s;
    }

    function findAttribute(node, ns, name) {
        for (var i in node.attributes) {

            if (node.attributes[i].uri === ns &&
                node.attributes[i].local === name) {

                return node.attributes[i].value;
            }
        }

        return null;
    }

    function extractAspectRatio(node, errorHandler) {

        var ar = findAttribute(node, imscNames.ns_ittp, "aspectRatio");

        var rslt = null;

        if (ar !== null) {

            var ASPECT_RATIO_RE = /(\d+) (\d+)/;

            var m = ASPECT_RATIO_RE.exec(ar);

            if (m !== null) {

                var w = parseInt(m[1]);

                var h = parseInt(m[2]);

                if (w !== 0 && h !== 0) {

                    rslt = w / h;

                } else {

                    reportError(errorHandler, "Illegal aspectRatio values (ignoring)");
                }

            } else {

                reportError(errorHandler, "Malformed aspectRatio attribute (ignoring)");
            }

        }

        return rslt;

    }

    /*
     * Returns the cellResolution attribute from a node
     * 
     */
    function extractCellResolution(node, errorHandler) {

        var cr = findAttribute(node, imscNames.ns_ttp, "cellResolution");

        // initial value

        var h = 15;
        var w = 32;

        if (cr !== null) {

            var CELL_RESOLUTION_RE = /(\d+) (\d+)/;

            var m = CELL_RESOLUTION_RE.exec(cr);

            if (m !== null) {

                var isHMD = true;

                w = isHMD ? 50 : parseInt(m[1]); /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                h = isHMD ? 50 : parseInt(m[2]); /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            } else {

                reportWarning(errorHandler, "Malformed cellResolution value (using initial value instead)");

            }

        }

        return {'w': w, 'h': h};

    }


    function extractFrameAndTickRate(node, errorHandler) {

        // subFrameRate is ignored per IMSC1 specification

        // extract frame rate

        var fps_attr = findAttribute(node, imscNames.ns_ttp, "frameRate");

        // initial value

        var fps = 30;

        // match variable

        var m;

        if (fps_attr !== null) {

            var FRAME_RATE_RE = /(\d+)/;

            m = FRAME_RATE_RE.exec(fps_attr);

            if (m !== null) {

                fps = parseInt(m[1]);

            } else {

                reportWarning(errorHandler, "Malformed frame rate attribute (using initial value instead)");
            }

        }

        // extract frame rate multiplier

        var frm_attr = findAttribute(node, imscNames.ns_ttp, "frameRateMultiplier");

        // initial value

        var frm = 1;

        if (frm_attr !== null) {

            var FRAME_RATE_MULT_RE = /(\d+) (\d+)/;

            m = FRAME_RATE_MULT_RE.exec(frm_attr);

            if (m !== null) {

                frm = parseInt(m[1]) / parseInt(m[2]);

            } else {

                reportWarning(errorHandler, "Malformed frame rate multiplier attribute (using initial value instead)");
            }

        }

        var efps = frm * fps;

        // extract tick rate

        var tr = 1;

        var trattr = findAttribute(node, imscNames.ns_ttp, "tickRate");

        if (trattr === null) {

            if (fps_attr !== null) tr = efps;

        } else {

            var TICK_RATE_RE = /(\d+)/;

            m = TICK_RATE_RE.exec(trattr);

            if (m !== null) {

                tr = parseInt(m[1]);

            } else {

                reportWarning(errorHandler, "Malformed tick rate attribute (using initial value instead)");
            }

        }

        return {effectiveFrameRate: efps, tickRate: tr};

    }

    function extractExtent(node, errorHandler) {

        var attr = findAttribute(node, imscNames.ns_tts, "extent");

        if (attr === null) return null;

        var s = attr.split(" ");

        if (s.length !== 2) {

            reportWarning(errorHandler, "Malformed extent (ignoring)");

            return null;
        }

        var w = imscUtils.parseLength(s[0]);

        var h = imscUtils.parseLength(s[1]);

        if (!h || !w) {

            reportWarning(errorHandler, "Malformed extent values (ignoring)");

            return null;
        }

        return {'h': h, 'w': w};

    }

    function parseTimeExpression(tickRate, effectiveFrameRate, str) {

        var CLOCK_TIME_FRACTION_RE = /^(\d{2,}):(\d\d):(\d\d(?:\.\d+)?)$/;
        var CLOCK_TIME_FRAMES_RE = /^(\d{2,}):(\d\d):(\d\d)\:(\d{2,})$/;
        var OFFSET_FRAME_RE = /^(\d+(?:\.\d+)?)f$/;
        var OFFSET_TICK_RE = /^(\d+(?:\.\d+)?)t$/;
        var OFFSET_MS_RE = /^(\d+(?:\.\d+)?)ms$/;
        var OFFSET_S_RE = /^(\d+(?:\.\d+)?)s$/;
        var OFFSET_H_RE = /^(\d+(?:\.\d+)?)h$/;
        var OFFSET_M_RE = /^(\d+(?:\.\d+)?)m$/;
        var m;
        var r = null;
        if ((m = OFFSET_FRAME_RE.exec(str)) !== null) {

            if (effectiveFrameRate !== null) {

                r = parseFloat(m[1]) / effectiveFrameRate;
            }

        } else if ((m = OFFSET_TICK_RE.exec(str)) !== null) {

            if (tickRate !== null) {

                r = parseFloat(m[1]) / tickRate;
            }

        } else if ((m = OFFSET_MS_RE.exec(str)) !== null) {

            r = parseFloat(m[1]) / 1000.0;

        } else if ((m = OFFSET_S_RE.exec(str)) !== null) {

            r = parseFloat(m[1]);

        } else if ((m = OFFSET_H_RE.exec(str)) !== null) {

            r = parseFloat(m[1]) * 3600.0;

        } else if ((m = OFFSET_M_RE.exec(str)) !== null) {

            r = parseFloat(m[1]) * 60.0;

        } else if ((m = CLOCK_TIME_FRACTION_RE.exec(str)) !== null) {

            r = parseInt(m[1]) * 3600 +
                parseInt(m[2]) * 60 +
                parseFloat(m[3]);

        } else if ((m = CLOCK_TIME_FRAMES_RE.exec(str)) !== null) {

            /* this assumes that HH:MM:SS is a clock-time-with-fraction */

            if (effectiveFrameRate !== null) {

                r = parseInt(m[1]) * 3600 +
                    parseInt(m[2]) * 60 +
                    parseInt(m[3]) +
                    (m[4] === null ? 0 : parseInt(m[4]) / effectiveFrameRate);
            }

        }

        return r;
    }

    function processTiming(doc, parent, node, errorHandler) {

        /* Q: what does this do <div b=1 e=3><p b=1 e=5> ?*/
        /* Q: are children clipped by parent time interval? */

        var isseq = parent && parent.timeContainer === "seq";

        /* retrieve begin value */

        var b = 0;

        if (node && 'begin' in node.attributes) {

            b = parseTimeExpression(doc.tickRate, doc.effectiveFrameRate, node.attributes.begin.value);

            if (b === null) {

                reportWarning(errorHandler, "Malformed begin value " + node.attributes.begin.value + " (using 0)");

                b = 0;

            }

        }

        /* retrieve dur value */

        /* NOTE: end is not meaningful on seq container children and dur is equal to 0 if not specified */

        var d = isseq ? 0 : null;

        if (node && 'dur' in node.attributes) {

            d = parseTimeExpression(doc.tickRate, doc.effectiveFrameRate, node.attributes.dur.value);

            if (d === null) {

                reportWarning(errorHandler, "Malformed dur value " + node.attributes.dur.value + " (ignoring)");

            }

        }

        /* retrieve end value */

        var e = null;

        if (node && 'end' in node.attributes) {

            e = parseTimeExpression(doc.tickRate, doc.effectiveFrameRate, node.attributes.end.value);

            if (e === null) {

                reportWarning(errorHandler, "Malformed end value (ignoring)");

            }

        }

        /* compute starting offset */

        var start_off = 0;

        if (parent) {

            if (isseq && 'contents' in parent && parent.contents.length > 0) {

                /*
                 * if seq time container, offset from the previous sibling end
                 */

                start_off = parent.contents[parent.contents.length - 1].end;


            } else {

                /* 
                 * retrieve parent begin. Assume 0 if no parent.
                 * 
                 */

                start_off = parent.begin || 0;

            }

        }

        /* offset begin per time container semantics */

        b += start_off;

        /* set end */

        if (d !== null) {

            // use dur if specified

            e = b + d;

        } else {

            /* retrieve parent end, or +infinity if none */

            var parent_e = (parent && 'end' in parent) ? parent.end : Number.POSITIVE_INFINITY;

            e = (e !== null) ? e + start_off : parent_e;

        }

        return {begin: b, end: e};

    }



    function mergeChainedStyles(styling, style, errorHandler) {

        while (style.styleRefs.length > 0) {

            var sref = style.styleRefs.pop();

            if (!(sref in styling.styles)) {
                reportError(errorHandler, "Non-existant style id referenced");
                continue;
            }

            mergeChainedStyles(styling, styling.styles[sref], errorHandler);

            mergeStylesIfNotPresent(styling.styles[sref].styleAttrs, style.styleAttrs);

        }

    }

    function mergeReferencedStyles(styling, stylerefs, styleattrs, errorHandler) {

        for (var i = stylerefs.length - 1; i >= 0; i--) {

            var sref = stylerefs[i];

            if (!(sref in styling.styles)) {
                reportError(errorHandler, "Non-existant style id referenced");
                continue;
            }

            mergeStylesIfNotPresent(styling.styles[sref].styleAttrs, styleattrs);

        }

    }

    function mergeStylesIfNotPresent(from_styles, into_styles) {

        for (var sname in from_styles) {

            if (sname in into_styles)
                continue;

            into_styles[sname] = from_styles[sname];

        }

    }

    /* TODO: validate style format at parsing */


    /*
     * ERROR HANDLING UTILITY FUNCTIONS
     * 
     */

    function reportInfo(errorHandler, msg) {

        if (errorHandler && errorHandler.info && errorHandler.info(msg))
            throw msg;

    }

    function reportWarning(errorHandler, msg) {

        if (errorHandler && errorHandler.warn && errorHandler.warn(msg))
            throw msg;

    }

    function reportError(errorHandler, msg) {

        if (errorHandler && errorHandler.error && errorHandler.error(msg))
            throw msg;

    }

    function reportFatal(errorHandler, msg) {

        if (errorHandler && errorHandler.fatal)
            errorHandler.fatal(msg);

        throw msg;

    }

    /*
     * Binary search utility function
     * 
     * @typedef {Object} BinarySearchResult
     * @property {boolean} found Was an exact match found?
     * @property {number} index Position of the exact match or insert position
     * 
     * @returns {BinarySearchResult}
     */

    function indexOf(arr, searchval) {

        var min = 0;
        var max = arr.length - 1;
        var cur;

        while (min <= max) {

            cur = Math.floor((min + max) / 2);

            var curval = arr[cur];

            if (curval < searchval) {

                min = cur + 1;

            } else if (curval > searchval) {

                max = cur - 1;

            } else {

                return {found: true, index: cur};

            }

        }

        return {found: false, index: min};
    }


})(typeof exports === 'undefined' ? this.imscDoc = {} : exports,
    typeof sax === 'undefined' ? require("sax") : sax,
    typeof imscNames === 'undefined' ? require("./names") : imscNames,
    typeof imscStyles === 'undefined' ? require("./styles") : imscStyles,
    typeof imscUtils === 'undefined' ? require("./utils") : imscUtils);

},{"./names":5,"./styles":6,"./utils":7,"sax":undefined}],2:[function(require,module,exports){
/* 
 * Copyright (c) 2016, Pierre-Anthony Lemieux <pal@sandflow.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @module imscHTML
 */

;
(function (imscHTML, imscNames, imscStyles) {

    /**
     * Function that maps <pre>smpte:background</pre> URIs to URLs resolving to image resource
     * @callback IMGResolver
     * @param {string} <pre>smpte:background</pre> URI
     * @return {string} PNG resource URL
     */


    /**
     * Renders an ISD object (returned by <pre>generateISD()</pre>) into a 
     * parent element, that must be attached to the DOM. The ISD will be rendered
     * into a child <pre>div</pre>
     * with heigh and width equal to the clientHeight and clientWidth of the element,
     * unless explicitly specified otherwise by the caller. Images URIs specified 
     * by <pre>smpte:background</pre> attributes are mapped to image resource URLs
     * by an <pre>imgResolver</pre> function. The latter takes the value of <code>smpte:background</code>
     * attribute and an <code>img</code> DOM element as input, and is expected to
     * set the <code>src</code> attribute of the <code>img</code> to the absolute URI of the image.
     * <pre>displayForcedOnlyMode</pre> sets the (boolean)
     * value of the IMSC1 displayForcedOnlyMode parameter.
     * 
     * @param {Object} isd ISD to be rendered
     * @param {Object} element Element into which the ISD is rendered
     * @param {?IMGResolver} imgResolver Resolve <pre>smpte:background</pre> URIs into URLs.
     * @param {?number} eheight Height (in pixel) of the child <div>div</div> or null 
     *                  to use clientHeight of the parent element
     * @param {?number} ewidth Width (in pixel) of the child <div>div</div> or null
     *                  to use clientWidth of the parent element
     * @param {?boolean} displayForcedOnlyMode Value of the IMSC1 displayForcedOnlyMode parameter,
     *                   or false if null         
     * @param {?module:imscUtils.ErrorHandler} errorHandler Error callback
     */

    imscHTML.render = function (isd, element, imgResolver, eheight, ewidth, displayForcedOnlyMode, errorHandler) {

        /* maintain aspect ratio if specified */

        var height = eheight || element.clientHeight;
        var width = ewidth || element.clientWidth;

        if (isd.aspectRatio !== null) {

            var twidth = height * isd.aspectRatio;

            if (twidth > width) {

                height = Math.round(width / isd.aspectRatio);

            } else {

                width = twidth;

            }

        }

        var rootcontainer = document.createElement("div");
        rootcontainer.id = 'subtitlediv'; // afegit

        rootcontainer.style.position = "relative";
        rootcontainer.style.width = width + "px";
        rootcontainer.style.height = height + "px";
        rootcontainer.style.margin = "auto";
        rootcontainer.style.top = 0;
        rootcontainer.style.bottom = 0;
        rootcontainer.style.left = 0;
        rootcontainer.style.right = 0;
        rootcontainer.style.zIndex = 0;


        /*var rootcanvas = document.getElementById("YourIDName");
        var ctx = rootcanvas.getContext("webgl");
ctx.font = "30px Arial";
ctx.fillText("Hello World",20,50);
*/

        /*myelement.style.position = "relative";
        myelement.style.width = width + "px";
        myelement.style.height = height + "px";
        myelement.style.margin = "auto";
        myelement.style.top = 0;
        myelement.style.bottom = 0;
        myelement.style.left = 0;
        myelement.style.right = 0;
        myelement.style.zIndex = 0;*/

        var context = {
            h: height,
            w: width,
            regionH: null,
            regionW: null,
            imgResolver: imgResolver,
            displayForcedOnlyMode: displayForcedOnlyMode || false,
            isd: isd,
            errorHandler: errorHandler
        };


        element.appendChild(rootcontainer);

        for (var i in isd.contents) {

            processElement(context, rootcontainer, isd.contents[i]);

        }

    };

    function processElement(context, dom_parent, isd_element) {

        var e;

        if (isd_element.kind === 'region') {

            e = document.createElement("div");
            e.style.position = "absolute";

        } else if (isd_element.kind === 'body') {

            e = document.createElement("div");

        } else if (isd_element.kind === 'div') {

            e = document.createElement("div");

        } else if (isd_element.kind === 'p') {

            e = document.createElement("p");

        } else if (isd_element.kind === 'span') {

            e = document.createElement("span");

            //e.textContent = isd_element.text;

        } else if (isd_element.kind === 'br') {

            e = document.createElement("br");

        }

        if (!e) {

            reportError(context.errorHandler, "Error processing ISD element kind: " + isd_element.kind);

            return;

        }

        /* override UA default margin */

        e.style.margin = "0";

        /* tranform TTML styles to CSS styles */

        for (var i in STYLING_MAP_DEFS) {

            var sm = STYLING_MAP_DEFS[i];

            var attr = isd_element.styleAttrs[sm.qname];

            if (attr !== undefined && sm.map !== null) {

                sm.map(context, e, isd_element, attr);

            }

        }

        var proc_e = e;


        // handle multiRowAlign and linePadding

        var mra = isd_element.styleAttrs[imscStyles.byName.multiRowAlign.qname];

        if (mra && mra !== "auto") {

            var s = document.createElement("span");

            s.style.display = "inline-block";

            s.style.textAlign = mra;

            e.appendChild(s);

            proc_e = s;

            context.mra = mra;

        }

        var lp = isd_element.styleAttrs[imscStyles.byName.linePadding.qname];

        if (lp && lp > 0) {

            context.lp = lp;

        }

        // wrap characters in spans to find the line wrap locations

        if (isd_element.kind === "span" && isd_element.text) {

            if (context.lp || context.mra) {

                for (var j = 0; j < isd_element.text.length; j++) {

                    var span = document.createElement("span");

                    span.textContent = isd_element.text.charAt(j);

                    e.appendChild(span);

                }

            } else {
                e.textContent = isd_element.text;
            }
        }


        dom_parent.appendChild(e);

        for (var k in isd_element.contents) {

            processElement(context, proc_e, isd_element.contents[k]);

        }

        // handle linePadding and multiRowAlign

        if ((context.lp || context.mra) && isd_element.kind === "p") {

            var elist = [];

            constructElementList(proc_e, elist, "red");

            /* TODO: linePadding only supported for horizontal scripts */

            processLinePaddingAndMultiRowAlign(elist, context.lp * context.h);

            /* TODO: clean-up the spans ? */

            if (context.lp)
                delete context.lp;
            if (context.mra)
                delete context.mra;

        }

    }

    function pruneEmptySpans(element) {

        var child = element.firstChild;

        while (child) {

            var nchild = child.nextSibling;

            if (child.nodeType === Node.ELEMENT_NODE &&
                child.localName === 'span') {

                pruneEmptySpans(child);

                if (child.childElementCount === 0 &&
                    child.textContent.length === 0) {

                    element.removeChild(child);

                }
            }

            child = nchild;
        }

    }

    function constructElementList(element, elist, bgcolor) {

        if (element.childElementCount === 0) {

            elist.push({
                "element": element,
                "bgcolor": bgcolor}
            );

        } else {

            var newbgcolor = element.style.backgroundColor || bgcolor;

            var child = element.firstChild;

            while (child) {

                if (child.nodeType === Node.ELEMENT_NODE) {

                    constructElementList(child, elist, newbgcolor);

                }

                child = child.nextSibling;
            }
        }

    }

    function isSameLine(top1, height1, top2, height2) {

        return (((top1 + height1) < (top2 + height2)) && (top1 > top2)) || (((top2 + height2) <= (top1 + height1)) && (top2 >= top1));

    }

    function processLinePaddingAndMultiRowAlign(elist, lp) {

        var line_head = null;

        var lookingForHead = true;

        var foundBR = false;

        for (var i = 0; i <= elist.length; i++) {

            /* skip <br> since they apparently have a different box top than
             * the rest of the line 
             */

            if (i !== elist.length && elist[i].element.localName === "br") {
                foundBR = true;
                continue;
            }

            /* detect new line */

            if (line_head === null ||
                i === elist.length ||
                (!isSameLine(elist[i].element.getBoundingClientRect().top,
                    elist[i].element.getBoundingClientRect().height,
                    elist[line_head].element.getBoundingClientRect().top,
                    elist[line_head].element.getBoundingClientRect().height))
                ) {

                /* apply right padding to previous line (if applicable and unless this is the first line) */

                if (lp && (!lookingForHead)) {

                    for (; --i >= 0; ) {

                        if (elist[i].element.getBoundingClientRect().width !== 0) {

                            addRightPadding(elist[i].element, elist[i].color, lp);

                            if (elist[i].element.getBoundingClientRect().width !== 0 &&
                                isSameLine(elist[i].element.getBoundingClientRect().top,
                                    elist[i].element.getBoundingClientRect().height,
                                    elist[line_head].element.getBoundingClientRect().top,
                                    elist[line_head].element.getBoundingClientRect().height))
                                break;

                            removeRightPadding(elist[i].element);

                        }

                    }

                    lookingForHead = true;

                    continue;

                }

                /* explicit <br> unless already present */

                if (i !== elist.length && line_head !== null && (!foundBR)) {

                    var br = document.createElement("br");

                    elist[i].element.parentElement.insertBefore(br, elist[i].element);

                    elist.splice(i, 0, {"element": br});

                    foundBR = true;

                    continue;

                }

                /* apply left padding to current line (if applicable) */

                if (i !== elist.length && lp) {

                    /* find first non-zero */

                    for (; i < elist.length; i++) {

                        if (elist[i].element.getBoundingClientRect().width !== 0) {
                            addLeftPadding(elist[i].element, elist[i].color, lp);
                            break;
                        }

                    }

                }

                lookingForHead = false;

                foundBR = false;

                line_head = i;

            }

        }

    }

    function addLeftPadding(e, c, lp) {
        e.style.paddingLeft = lp + "px";
        e.style.backgroundColor = c;
    }

    function addRightPadding(e, c, lp) {
        e.style.paddingRight = lp + "px";
        e.style.backgroundColor = c;

    }

    function removeRightPadding(e) {
        e.style.paddingRight = null;
    }


    function HTMLStylingMapDefintion(qName, mapFunc) {
        this.qname = qName;
        this.map = mapFunc;
    }

    var STYLING_MAP_DEFS = [

        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling backgroundColor",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.backgroundColor = "rgba(" +
                    attr[0].toString() + "," +
                    attr[1].toString() + "," +
                    attr[2].toString() + "," +
                    (attr[3] / 255).toString() +
                    ")";
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling color",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.color = "rgba(" +
                    attr[0].toString() + "," +
                    attr[1].toString() + "," +
                    attr[2].toString() + "," +
                    (attr[3] / 255).toString() +
                    ")";
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling direction",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.direction = attr;
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling display",
            function (context, dom_element, isd_element, attr) {}
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling displayAlign",
            function (context, dom_element, isd_element, attr) {

                /* see https://css-tricks.com/snippets/css/a-guide-to-flexbox/ */

                /* TODO: is this affected by writing direction? */

                dom_element.style.display = "flex";
                dom_element.style.flexDirection = "column";

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
//              ADDED BY I2CAT                                                              //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                attr = forcedDisplayAlign ? forcedDisplayAlign : attr;
//////////////////////////////////////////////////////////////////////////////////////////////

                if (attr === "before") {

                    dom_element.style.justifyContent = "flex-start";

                } else if (attr === "center") {

                    dom_element.style.justifyContent = "center";

                } else if (attr === "after") {

                    dom_element.style.justifyContent = "flex-end";
                }

            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling extent",
            function (context, dom_element, isd_element, attr) {
                /* TODO: this is super ugly */

                context.regionH = (attr.h * context.h);
                context.regionW = (attr.w * context.w);

                /* 
                 * CSS height/width are measured against the content rectangle,
                 * whereas TTML height/width include padding
                 */

                var hdelta = 0;
                var wdelta = 0;

                var p = isd_element.styleAttrs["http://www.w3.org/ns/ttml#styling padding"];

                if (!p) {

                    /* error */

                } else {

                    hdelta = (p[0] + p[2]) * context.h;
                    wdelta = (p[1] + p[3]) * context.w;

                }

                dom_element.style.height = (context.regionH - hdelta) + "px";
                dom_element.style.width = (context.regionW - wdelta) + "px";

            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling fontFamily",
            function (context, dom_element, isd_element, attr) {

                var rslt = [];

                /* per IMSC1 */

                for (var i in attr) {

                    if (attr[i] === "monospaceSerif") {

                        rslt.push("Courier New");
                        rslt.push('"Liberation Mono"');
                        rslt.push("Courier");
                        rslt.push("monospace");

                    } else if (attr[i] === "proportionalSansSerif") {

                        rslt.push("Arial");
                        rslt.push("Helvetica");
                        rslt.push('"Liberation Sans"');
                        rslt.push("sans-serif");

                    } else if (attr[i] === "monospace") {

                        rslt.push("monospace");

                    } else if (attr[i] === "sansSerif") {

                        rslt.push("sans-serif");

                    } else if (attr[i] === "serif") {

                        rslt.push("serif");

                    } else if (attr[i] === "monospaceSansSerif") {

                        rslt.push("Consolas");
                        rslt.push("monospace");

                    } else if (attr[i] === "proportionalSerif") {

                        rslt.push("serif");

                    } else {

                        rslt.push(attr[i]);

                    }

                }

                dom_element.style.fontFamily = rslt.join(",");
            }
        ),

        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling fontSize",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.fontSize = (attr * context.h) + "px";
            }
        ),

        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling fontStyle",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.fontStyle = attr;
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling fontWeight",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.fontWeight = attr;
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling lineHeight",
            function (context, dom_element, isd_element, attr) {
                if (attr === "normal") {

                    dom_element.style.lineHeight = "normal";

                } else {

                    dom_element.style.lineHeight = (attr * context.h) + "px";
                }
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling opacity",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.opacity = attr;
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling origin",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.top = (attr.h * context.h) + "px";
                dom_element.style.left = (attr.w * context.w) + "px";
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling overflow",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.overflow = attr;
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling padding",
            function (context, dom_element, isd_element, attr) {

                /* attr: top,left,bottom,right*/

                /* style: top right bottom left*/

                var rslt = [];

                rslt[0] = (attr[0] * context.h) + "px";
                rslt[1] = (attr[3] * context.w) + "px";
                rslt[2] = (attr[2] * context.h) + "px";
                rslt[3] = (attr[1] * context.w) + "px";

                dom_element.style.padding = rslt.join(" ");
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling showBackground",
            null
            ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling textAlign",
            function (context, dom_element, isd_element, attr) {

                var ta;
                var dir = isd_element.styleAttrs[imscStyles.byName.direction.qname];


                //////////////////////////////////////////////////////////////////////////////////////////////
                //                                                                                          //
                //              ADDED BY I2CAT                                                              //
                //                                                                                          //
                //////////////////////////////////////////////////////////////////////////////////////////////
                attr = forcedTextAlign ? forcedTextAlign : attr;
                //////////////////////////////////////////////////////////////////////////////////////////////

                /* handle UAs that do not understand start or end */

                if (attr === "start") {

                    ta = (dir === "rtl") ? "right" : "left";

                } else if (attr === "end") {

                    ta = (dir === "rtl") ? "left" : "right";

                } else {

                    ta = attr;

                }

                dom_element.style.textAlign = ta;

            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling textDecoration",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.textDecoration = attr.join(" ").replace("lineThrough", "line-through");
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling textOutline",
            function (context, dom_element, isd_element, attr) {

                if (attr === "none") {

                    dom_element.style.textShadow = "";

                } else {

                    dom_element.style.textShadow = "rgba(" +
                        attr.color[0].toString() + "," +
                        attr.color[1].toString() + "," +
                        attr.color[2].toString() + "," +
                        (attr.color[3] / 255).toString() +
                        ")" + " 0px 0px " +
                        (attr.thickness * context.h) + "px";

                }
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling unicodeBidi",
            function (context, dom_element, isd_element, attr) {

                var ub;

                if (attr === 'bidiOverride') {
                    ub = "bidi-override";
                } else {
                    ub = attr;
                }

                dom_element.style.unicodeBidi = ub;
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling visibility",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.visibility = attr;
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling wrapOption",
            function (context, dom_element, isd_element, attr) {

                if (attr === "wrap") {

                    if (isd_element.space === "preserve") {
                        dom_element.style.whiteSpace = "pre-wrap";
                    } else {
                        dom_element.style.whiteSpace = "normal";
                    }

                } else {

                    if (isd_element.space === "preserve") {

                        dom_element.style.whiteSpace = "pre";

                    } else {
                        dom_element.style.whiteSpace = "noWrap";
                    }

                }

            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling writingMode",
            function (context, dom_element, isd_element, attr) {
                if (attr === "lrtb" || attr === "lr") {

                    dom_element.style.writingMode = "horizontal-tb";

                } else if (attr === "rltb" || attr === "rl") {

                    dom_element.style.writingMode = "horizontal-tb";

                } else if (attr === "tblr") {

                    dom_element.style.writingMode = "vertical-lr";

                } else if (attr === "tbrl" || attr === "tb") {

                    dom_element.style.writingMode = "vertical-rl";

                }
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml#styling zIndex",
            function (context, dom_element, isd_element, attr) {
                dom_element.style.zIndex = attr;
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.smpte-ra.org/schemas/2052-1/2010/smpte-tt backgroundImage",
            function (context, dom_element, isd_element, attr) {

                if (context.imgResolver !== null && attr !== null) {

                    var img = document.createElement("img");

                    var uri = context.imgResolver(attr, img);

                    if (uri) img.src = uri;

                    img.height = context.regionH;
                    img.width = context.regionW;

                    dom_element.appendChild(img);
                }
            }
        ),
        new HTMLStylingMapDefintion(
            "http://www.w3.org/ns/ttml/profile/imsc1#styling forcedDisplay",
            function (context, dom_element, isd_element, attr) {

                if (context.displayForcedOnlyMode && attr === false) {
                    dom_element.style.visibility = "hidden";
                }

            }
        )
    ];

    var STYLMAP_BY_QNAME = {};

    for (var i in STYLING_MAP_DEFS) {

        STYLMAP_BY_QNAME[STYLING_MAP_DEFS[i].qname] = STYLING_MAP_DEFS[i];
    }

    function reportError(errorHandler, msg) {

        if (errorHandler && errorHandler.error && errorHandler.error(msg))
            throw msg;

    }

})(typeof exports === 'undefined' ? this.imscHTML = {} : exports,
    typeof imscNames === 'undefined' ? require("./names") : imscNames,
    typeof imscStyles === 'undefined' ? require("./styles") : imscStyles);
},{"./names":5,"./styles":6}],3:[function(require,module,exports){
/* 
 * Copyright (c) 2016, Pierre-Anthony Lemieux <pal@sandflow.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @module imscISD
 */


;
(function (imscISD, imscNames, imscStyles) { // wrapper for non-node envs

    /** 
     * Creates a canonical representation of an IMSC1 document returned by <pre>imscDoc.fromXML()</pre>
     * at a given absolute offset in seconds. This offset does not have to be one of the values returned
     * by <pre>getMediaTimeEvents()</pre>.
     * 
     * @param {Object} tt IMSC1 document
     * @param {number} offset Absolute offset (in seconds)
     * @param {?module:imscUtils.ErrorHandler} errorHandler Error callback
     * @returns {Object} Opaque in-memory representation of an ISD
     */

    var _imac = undefined;

    imscISD.generateISD = function (tt, offset, errorHandler) {

        /* TODO check for tt and offset validity */

        /* create the ISD object from the IMSC1 doc */

        var isd = new ISD(tt);

        /* process regions */

        for (var r in tt.head.layout.regions) {

            /* post-order traversal of the body tree per [construct intermediate document] */

            var c = isdProcessContentElement(tt, offset, tt.head.layout.regions[r], tt.body, null, '', tt.head.layout.regions[r], errorHandler);

            if (c !== null) {

                /* add the region to the ISD */

                isd.contents.push(c.element);
                isd.imac = _imac;// >= 0 ? _imac : _imac + 360;
            }


        }

        return isd;
    };



    function isdProcessContentElement(doc, offset, region, body, parent, inherited_region_id, elem, errorHandler) {

        /* prune if temporally inactive */
        if (offset < elem.begin || offset >= elem.end) return null;

        /* 
         * set the associated region as specified by the regionID attribute, or the 
         * inherited associated region otherwise
         */

        var associated_region_id = 'regionID' in elem && elem.regionID !== '' ? elem.regionID : inherited_region_id;

        /* prune the element if either:
         * - the element is not terminal and the associated region is neither the default
         *   region nor the parent region (this allows children to be associated with a 
         *   region later on)
         * - the element is terminal and the associated region is not the parent region
         */
        
        /* TODO: improve detection of terminal elements since <region> has no contents */

        if (parent !== null /* are we in the region element */ &&
            associated_region_id !== region.id &&
                (
                    (! ('contents' in elem)) ||
                    ('contents' in elem && elem.contents.length === 0) ||
                    associated_region_id !== ''
                )
             )
            return null;

        /* create an ISD element, including applying specified styles */

        var isd_element = new ISDContentElement(elem);

        /* apply set (animation) styling */

        for (var i in elem.sets) {

            if (offset < elem.sets[i].begin || offset >= elem.sets[i].end)
                continue;

            isd_element.styleAttrs[elem.sets[i].qname] = elem.sets[i].value;

        }
        /* 
         * keep track of specified styling attributes so that we
         * can compute them later
         */

        var spec_attr = {};

        for (var qname in isd_element.styleAttrs) {

            spec_attr[qname] = true;

            /* special rule for tts:writingMode (section 7.29.1 of XSL)
             * direction is set consistently with writingMode only
             * if writingMode sets inline-direction to LTR or RTL  
             */

            if (qname === imscStyles.byName.writingMode.qname &&
                !(imscStyles.byName.direction.qname in isd_element.styleAttrs)) {

                var wm = isd_element.styleAttrs[qname];

                if (wm === "lrtb" || wm === "lr") {

                    isd_element.styleAttrs[imscStyles.byName.direction.qname] = "ltr";

                } else if (wm === "rltb" || wm === "rl") {

                    isd_element.styleAttrs[imscStyles.byName.direction.qname] = "rtl";

                }

            }
        }

        /* inherited styling */

        if (parent !== null) {

            for (var j in imscStyles.all) {

                var sa = imscStyles.all[j];

                /* textDecoration has special inheritance rules */

                if (sa.qname === imscStyles.byName.textDecoration.qname) {

                    /* handle both textDecoration inheritance and specification */

                    var ps = parent.styleAttrs[sa.qname];
                    var es = isd_element.styleAttrs[sa.qname];
                    var outs = [];

                    if (es === undefined) {

                        outs = ps;

                    } else if (es.indexOf("none") === -1) {

                        if ((es.indexOf("noUnderline") === -1 &&
                            ps.indexOf("underline") !== -1) ||
                            es.indexOf("underline") !== -1) {

                            outs.push("underline");

                        }

                        if ((es.indexOf("noLineThrough") === -1 &&
                            ps.indexOf("lineThrough") !== -1) ||
                            es.indexOf("lineThrough") !== -1) {

                            outs.push("lineThrough");

                        }

                        if ((es.indexOf("noOverline") === -1 &&
                            ps.indexOf("overline") !== -1) ||
                            es.indexOf("overline") !== -1) {

                            outs.push("overline");

                        }

                    } else {

                        outs.push("none");

                    }

                    isd_element.styleAttrs[sa.qname] = outs;

                } else if (sa.inherit &&
                    (sa.qname in parent.styleAttrs) &&
                    !(sa.qname in isd_element.styleAttrs)) {

                    isd_element.styleAttrs[sa.qname] = parent.styleAttrs[sa.qname];

                }

            }

        }

        /* initial value styling */

        for (var k in imscStyles.all) {

            var ivs = imscStyles.all[k];

            /* skip if value is already specified */

            if (ivs.qname in isd_element.styleAttrs) continue;

            /* apply initial value to elements other than region only if non-inherited */

            if (isd_element.kind === 'region' || (ivs.inherit === false && ivs.initial !== null)) {

                isd_element.styleAttrs[ivs.qname] = ivs.parse(ivs.initial);

                /* keep track of the style as specified */

                spec_attr[ivs.qname] = true;

            }

        }

        /* compute styles (only for non-inherited styles) */
        /* TODO: get rid of spec_attr */

        for (var z in imscStyles.all) {

            var cs = imscStyles.all[z];

            if (!(cs.qname in spec_attr)) continue;

            if (cs.compute !== null) {

                var cstyle = cs.compute(
                    /*doc, parent, element, attr*/
                    doc,
                    parent,
                    isd_element,
                    isd_element.styleAttrs[cs.qname]
                    );

                if (cstyle !== null) {
                    isd_element.styleAttrs[cs.qname] = cstyle;
                } else {
                    reportError(errorHandler, "Style '" + cs.qname + "' on element '" + isd_element.kind + "' cannot be computed");
                }
            }

        }

        /* prune if tts:display is none */

        if (isd_element.styleAttrs[imscStyles.byName.display.qname] === "none")
            return null;

        /* process contents of the element */

        var contents;

        if (parent === null) {

            /* we are processing the region */

            if (body === null) {

                /* if there is no body, still process the region but with empty content */

                contents = [];

            } else {

                /*use the body element as contents */

                contents = [body];

            }

        } else if ('contents' in elem) {

            contents = elem.contents;

        }

        for (var x in contents) {

            var c = isdProcessContentElement(doc, offset, region, body, isd_element, associated_region_id, contents[x]);

            /* 
             * keep child element only if they are non-null and their region match 
             * the region of this element
             */

            if (c !== null) {

                isd_element.contents.push(c.element);

            }

        }

        /* compute used value of lineHeight="normal" */

        /*        if (isd_element.styleAttrs[imscStyles.byName.lineHeight.qname] === "normal"  ) {
         
         isd_element.styleAttrs[imscStyles.byName.lineHeight.qname] =
         isd_element.styleAttrs[imscStyles.byName.fontSize.qname] * 1.2;
         
         }
         */

        /* remove styles that are not applicable */

        for (var qnameb in isd_element.styleAttrs) {
            var da = imscStyles.byQName[qnameb];

            if (da.applies.indexOf(isd_element.kind) === -1) {
                delete isd_element.styleAttrs[qnameb];
            }
        }

        /* collapse white space if space is "default" */

        if (isd_element.kind === 'span' && isd_element.text && isd_element.space === "default") {

            var trimmedspan = isd_element.text.replace(/\s+/g, ' ');

            isd_element.text = trimmedspan;

        }

        /* trim whitespace around explicit line breaks */

        ////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //                            I2CAT --> var _imac
        //
        ///////////////////////////////////////////////////////////////////////////////////////////

        if (isd_element.kind === 'p') {

            var elist = [];

            _imac = isd_element.equirectangularLongitude ? parseFloat(isd_element.equirectangularLongitude) : undefined;

            constructSpanList(isd_element, elist);

            var l = 0;

            var state = "after_br";
            var br_pos = 0;

            while (true) {

                if (state === "after_br") {

                    if (l >= elist.length || elist[l].kind === "br") {

                        state = "before_br";
                        br_pos = l;
                        l--;

                    } else {

                        if (elist[l].space !== "preserve") {

                            elist[l].text = elist[l].text.replace(/^\s+/g, '');

                        }

                        if (elist[l].text.length > 0) {

                            state = "looking_br";
                            l++;

                        } else {

                            elist.splice(l, 1);

                        }

                    }

                } else if (state === "before_br") {

                    if (l < 0 || elist[l].kind === "br") {

                        state = "after_br";
                        l = br_pos + 1;

                        if (l >= elist.length) break;

                    } else {

                        if (elist[l].space !== "preserve") {

                            elist[l].text = elist[l].text.replace(/\s+$/g, '');

                        }

                        if (elist[l].text.length > 0) {

                            state = "after_br";
                            l = br_pos + 1;

                            if (l >= elist.length) break;

                        } else {

                            elist.splice(l, 1);
                            l--;

                        }

                    }

                } else {

                    if (l >= elist.length || elist[l].kind === "br") {

                        state = "before_br";
                        br_pos = l;
                        l--;

                    } else {

                        l++;

                    }

                }

            }
            
            pruneEmptySpans(isd_element);

        }

        /* keep element if:
         * * contains a background image
         * * <br/>
         * * if there are children
         * * if <span> and has text
         * * if region and showBackground = always
         */

        if ((isd_element.kind === 'div' && imscStyles.byName.backgroundImage.qname in isd_element.styleAttrs) ||
            isd_element.kind === 'br' ||
            ('contents' in isd_element && isd_element.contents.length > 0) ||
            (isd_element.kind === 'span' && isd_element.text !== null) ||
            (isd_element.kind === 'region' &&
                isd_element.styleAttrs[imscStyles.byName.showBackground.qname] === 'always')) {

            return {
                region_id: associated_region_id,
                element: isd_element
            };
        }

        return null;
    }

    function constructSpanList(element, elist) {

        if ('contents' in element) {

            for (var i in element.contents) {
                constructSpanList(element.contents[i], elist);
            }

        } else {

            elist.push(element);

        }

    }

    function pruneEmptySpans(element) {

        if (element.kind === 'br') {
            
            return false;
            
        } else if ('text' in element) {
            
            return  element.text.length === 0;
            
        } else if ('contents' in element) {
            
            var i = element.contents.length;

            while (i--) {
                
                if (pruneEmptySpans(element.contents[i])) {
                    element.contents.splice(i, 1);
                }
                
            }
            
            return element.contents.length === 0;

        }
    }

    function ISD(tt) {
        this.contents = [];
        this.aspectRatio = tt.aspectRatio || 16/9;
        this.imac = undefined;
    }

    function ISDContentElement(ttelem) {

        /* assume the element is a region if it does not have a kind */

        this.kind = ttelem.kind || 'region';

        //ptp manipulation
        if(this.kind === 'p'){
            this.id = ttelem.id || '';
            this.equirectangularLongitude = ttelem.equirectangularLongitude;
        }

        /* deep copy of style attributes */
        this.styleAttrs = {};

        for (var sname in ttelem.styleAttrs) {

            this.styleAttrs[sname] =
                ttelem.styleAttrs[sname];
        }

        /* TODO: clean this! */

        if ('text' in ttelem) {

            this.text = ttelem.text;

        } else if (ttelem.kind !== 'br') {
            
            this.contents = [];
        }

        if ('space' in ttelem) {

            this.space = ttelem.space;
        }
    }


    /*
     * ERROR HANDLING UTILITY FUNCTIONS
     * 
     */

    function reportInfo(errorHandler, msg) {

        if (errorHandler && errorHandler.info && errorHandler.info(msg))
            throw msg;

    }

    function reportWarning(errorHandler, msg) {

        if (errorHandler && errorHandler.warn && errorHandler.warn(msg))
            throw msg;

    }

    function reportError(errorHandler, msg) {

        if (errorHandler && errorHandler.error && errorHandler.error(msg))
            throw msg;

    }

    function reportFatal(errorHandler, msg) {

        if (errorHandler && errorHandler.fatal)
            errorHandler.fatal(msg);

        throw msg;

    }


})(typeof exports === 'undefined' ? this.imscISD = {} : exports,
    typeof imscNames === 'undefined' ? require("./names") : imscNames,
    typeof imscStyles === 'undefined' ? require("./styles") : imscStyles
    );

},{"./names":5,"./styles":6}],4:[function(require,module,exports){
/* 
 * Copyright (c) 2016, Pierre-Anthony Lemieux <pal@sandflow.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

exports.generateISD = require('./isd').generateISD;
exports.fromXML = require('./doc').fromXML;
exports.renderHTML = require('./html').render;
},{"./doc":1,"./html":2,"./isd":3}],5:[function(require,module,exports){
/* 
 * Copyright (c) 2016, Pierre-Anthony Lemieux <pal@sandflow.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @module imscNames
 */

;
(function (imscNames) { // wrapper for non-node envs

    imscNames.ns_tt = "http://www.w3.org/ns/ttml";
    imscNames.ns_tts = "http://www.w3.org/ns/ttml#styling";
    imscNames.ns_ttp = "http://www.w3.org/ns/ttml#parameter";
    imscNames.ns_xml = "http://www.w3.org/XML/1998/namespace";
    imscNames.ns_itts = "http://www.w3.org/ns/ttml/profile/imsc1#styling";
    imscNames.ns_ittp = "http://www.w3.org/ns/ttml/profile/imsc1#parameter";
    imscNames.ns_smpte = "http://www.smpte-ra.org/schemas/2052-1/2010/smpte-tt";
    imscNames.ns_ebutts = "urn:ebu:tt:style";
    
})(typeof exports === 'undefined' ? this.imscNames = {} : exports);





},{}],6:[function(require,module,exports){
/* 
 * Copyright (c) 2016, Pierre-Anthony Lemieux <pal@sandflow.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @module imscStyles
 */

;
(function (imscStyles, imscNames, imscUtils) { // wrapper for non-node envs

    function StylingAttributeDefinition(ns, name, initialValue, appliesTo, isInherit, isAnimatable, parseFunc, computeFunc) {
        this.name = name;
        this.ns = ns;
        this.qname = ns + " " + name;
        this.inherit = isInherit;
        this.animatable = isAnimatable;
        this.initial = initialValue;
        this.applies = appliesTo;
        this.parse = parseFunc;
        this.compute = computeFunc;
    }

    imscStyles.all = [

        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "backgroundColor",
                "transparent",
                ['body', 'div', 'p', 'region', 'span'],
                false,
                true,
                imscUtils.parseColor,
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "color",
                "white",
                ['span'],
                true,
                true,
                imscUtils.parseColor,
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "direction",
                "ltr",
                ['p', 'span'],
                true,
                true,
                function (str) {
                    return str;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "display",
                "auto",
                ['body', 'div', 'p', 'region', 'span'],
                false,
                true,
                function (str) {
                    return str;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "displayAlign",
                "before",
                ['region'],
                false,
                true,
                function (str) {
                    return str;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "extent",
                "auto",
                ['tt', 'region'],
                false,
                true,
                function (str) {

                    if (str === "auto") {

                        return str;

                    } else {

                        var s = str.split(" ");
                        if (s.length !== 2) return null;
                        var w = imscUtils.parseLength(s[0]);
                        var h = imscUtils.parseLength(s[1]);
                        if (!h || !w) return null;
                        return {'h': h, 'w': w};
                    }

                },
                function (doc, parent, element, attr) {

                    var h;
                    var w;

                    if (attr === "auto") {

                        h = 1;

                    } else if (attr.h.unit === "%") {

                        h = attr.h.value / 100;

                    } else if (attr.h.unit === "px") {

                        h = attr.h.value / doc.pxDimensions.h;

                    } else {

                        return null;

                    }

                    if (attr === "auto") {

                        w = 1;

                    } else if (attr.w.unit === "%") {

                        w = attr.w.value / 100;

                    } else if (attr.w.unit === "px") {

                        w = attr.w.value / doc.pxDimensions.w;

                    } else {

                        return null;

                    }

                    return {'h': h, 'w': w};
                }
        ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "fontFamily",
                "default",
                ['span'],
                true,
                true,
                function (str) {
                    var ffs = str.split(",");
                    var rslt = [];

                    for (var i in ffs) {

                        if (ffs[i].charAt(0) !== "'" && ffs[i].charAt(0) !== '"') {

                            if (ffs[i] === "default") {

                                /* per IMSC1 */

                                rslt.push("monospaceSerif");

                            } else {

                                rslt.push(ffs[i]);

                            }

                        } else {

                            rslt.push(ffs[i]);

                        }

                    }

                    return rslt;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "fontSize",
                "1c",
                ['span'],
                true,
                true,
                imscUtils.parseLength,
                function (doc, parent, element, attr) {

                    var fs;

                    if (attr.unit === "%") {

                        if (parent !== null) {

                            fs = parent.styleAttrs[imscStyles.byName.fontSize.qname] * attr.value / 100;

                        } else {

                            /* region, so percent of 1c */

                            fs = attr.value / 100 / doc.cellResolution.h;

                        }

                    } else if (attr.unit === "em") {

                        if (parent !== null) {

                            fs = parent.styleAttrs[imscStyles.byName.fontSize.qname] * attr.value;

                        } else {

                            /* region, so percent of 1c */

                            fs = attr.value / doc.cellResolution.h;

                        }

                    } else if (attr.unit === "c") {

                        fs = attr.value / doc.cellResolution.h;

                    } else if (attr.unit === "px") {

                        fs = attr.value / doc.pxDimensions.h;

                    } else {

                        return null;

                    }

                    return fs;
                }
        ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "fontStyle",
                "normal",
                ['span'],
                true,
                true,
                function (str) {
                    /* TODO: handle font style */

                    return str;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "fontWeight",
                "normal",
                ['span'],
                true,
                true,
                function (str) {
                    /* TODO: handle font weight */

                    return str;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "lineHeight",
                "normal",
                ['p'],
                true,
                true,
                function (str) {
                    if (str === "normal") {
                        return str;
                    } else {
                        return imscUtils.parseLength(str);
                    }
                },
                function (doc, parent, element, attr) {

                    var lh;

                    if (attr === "normal") {

                        /* inherit normal per https://github.com/w3c/ttml1/issues/220 */

                        lh = attr;

                    } else if (attr.unit === "%") {

                        lh = element.styleAttrs[imscStyles.byName.fontSize.qname] * attr.value / 100;

                    } else if (attr.unit === "em") {

                        lh = element.styleAttrs[imscStyles.byName.fontSize.qname] * attr.value;

                    } else if (attr.unit === "c") {

                        lh = attr.value / doc.cellResolution.h;

                    } else if (attr.unit === "px") {

                        /* TODO: handle error if no px dimensions are provided */

                        lh = attr.value / doc.pxDimensions.h;

                    } else {

                        return null;

                    }

                    /* TODO: create a Length constructor */

                    return lh;
                }
        ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "opacity",
                1.0,
                ['region'],
                false,
                true,
                parseFloat,
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "origin",
                "auto",
                ['region'],
                false,
                true,
                function (str) {

                    if (str === "auto") {

                        return str;

                    } else {

                        var s = str.split(" ");
                        if (s.length !== 2) return null;
                        var w = imscUtils.parseLength(s[0]);
                        var h = imscUtils.parseLength(s[1]);
                        if (!h || !w) return null;
                        return {'h': h, 'w': w};
                    }

                },
                function (doc, parent, element, attr) {

                    var h;
                    var w;

                    if (attr === "auto") {

                        h = 0;

                    } else if (attr.h.unit === "%") {

                        h = attr.h.value / 100;

                    } else if (attr.h.unit === "px") {

                        h = attr.h.value / doc.pxDimensions.h;

                    } else {

                        return null;

                    }

                    if (attr === "auto") {

                        w = 0;

                    } else if (attr.w.unit === "%") {

                        w = attr.w.value / 100;

                    } else if (attr.w.unit === "px") {

                        w = attr.w.value / doc.pxDimensions.w;

                    } else {

                        return null;

                    }

                    return {'h': h, 'w': w};
                }
        ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "overflow",
                "hidden",
                ['region'],
                false,
                true,
                function (str) {
                    return str;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "padding",
                "0px",
                ['region'],
                false,
                true,
                function (str) {

                    var s = str.split(" ");
                    if (s.length > 4) return null;
                    var r = [];
                    for (var i in s) {

                        var l = imscUtils.parseLength(s[i]);
                        if (!l) return null;
                        r.push(l);
                    }

                    return r;
                },
                function (doc, parent, element, attr) {

                    var padding;

                    /* TODO: make sure we are in region */

                    /*
                     * expand padding shortcuts to 
                     * [before, end, after, start]
                     * 
                     */

                    if (attr.length === 1) {

                        padding = [attr[0], attr[0], attr[0], attr[0]];

                    } else if (attr.length === 2) {

                        padding = [attr[0], attr[1], attr[0], attr[1]];

                    } else if (attr.length === 3) {

                        padding = [attr[0], attr[1], attr[2], attr[1]];

                    } else if (attr.length === 4) {

                        padding = [attr[0], attr[1], attr[2], attr[3]];

                    } else {

                        return null;

                    }

                    /* TODO: take into account tts:direction */

                    /* 
                     * transform [before, end, after, start] according to writingMode to 
                     * [top,left,bottom,right]
                     * 
                     */

                    var dir = element.styleAttrs[imscStyles.byName.writingMode.qname];

                    if (dir === "lrtb" || dir === "lr") {

                        padding = [padding[0], padding[3], padding[2], padding[1]];

                    } else if (dir === "rltb" || dir === "rl") {

                        padding = [padding[0], padding[1], padding[2], padding[3]];

                    } else if (dir === "tblr") {

                        padding = [padding[3], padding[0], padding[1], padding[2]];

                    } else if (dir === "tbrl" || dir === "tb") {

                        padding = [padding[3], padding[2], padding[1], padding[0]];

                    } else {

                        return null;

                    }

                    var out = [];

                    for (var i in padding) {

                        if (padding[i].value === 0) {

                            out[i] = 0;

                        } else if (padding[i].unit === "%") {

                            if (i === "0" || i === "2") {

                                out[i] = element.styleAttrs[imscStyles.byName.extent.qname].h * padding[i].value / 100;

                            } else {

                                out[i] = element.styleAttrs[imscStyles.byName.extent.qname].w * padding[i].value / 100;
                            }

                        } else if (padding[i].unit === "em") {

                            out[i] = element.styleAttrs[imscStyles.byName.fontSize.qname] * padding[i].value;

                        } else if (padding[i].unit === "c") {

                            out[i] = padding[i].value / doc.cellResolution.h;

                        } else if (padding[i].unit === "px") {

                            out[i] = padding[i].value / doc.pxDimensions.h;

                        } else {

                            return null;

                        }
                    }


                    return out;
                }
        ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "showBackground",
                "always",
                ['region'],
                false,
                true,
                function (str) {
                    return str;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "textAlign",
                "start",
                ['p'],
                true,
                true,
                function (str) {
                    return str;
                },
                function (doc, parent, element, attr) {
                    
                    /* Section 7.16.9 of XSL */
                    
                    if (attr === "left") {
                        
                        return "start";
                        
                    } else if (attr === "right") {
                        
                        return "end";
                        
                    } else {
                        
                        return attr;
                        
                    }
                }
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "textDecoration",
                "none",
                ['span'],
                true,
                true,
                function (str) {
                    return str.split(" ");
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "textOutline",
                "none",
                ['span'],
                true,
                true,
                function (str) {

                    /*
                     * returns {c: <color>?, thichness: <length>} | "none"
                     * 
                     */

                    if (str === "none") {

                        return str;

                    } else {

                        var r = {};
                        var s = str.split(" ");
                        if (s.length === 0 || s.length > 2) return null;
                        var c = imscUtils.parseColor(s[0]);
                       
                        r.color = c;
                        
                        if (c !== null) s.shift();

                        if (s.length !== 1) return null;

                        var l = imscUtils.parseLength(s[0]);

                        if (!l) return null;

                        r.thickness = l;

                        return r;
                    }

                },
                function (doc, parent, element, attr) {

                    /*
                     * returns {color: <color>, thickness: <norm length>}
                     * 
                     */

                    if (attr === "none") return attr;

                    var rslt = {};

                    if (attr.color === null) {
                        
                        rslt.color = element.styleAttrs[imscStyles.byName.color.qname];
                        
                    } else {
                        
                        rslt.color = attr.color;

                    }

                    if (attr.thickness.unit === "%") {

                        rslt.thickness = element.styleAttrs[imscStyles.byName.fontSize.qname] * attr.thickness.value / 100;

                    } else if (attr.thickness.unit === "em") {

                        rslt.thickness = element.styleAttrs[imscStyles.byName.fontSize.qname] * attr.thickness.value;

                    } else if (attr.thickness.unit === "c") {

                        rslt.thickness = attr.thickness.value / doc.cellResolution.h;

                    } else if (attr.thickness.unit === "px") {

                        rslt.thickness = attr.thickness.value / doc.pxDimensions.h;

                    } else {

                        return null;

                    }


                    return rslt;
                }
        ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "unicodeBidi",
                "normal",
                ['span', 'p'],
                false,
                true,
                function (str) {
                    return str;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "visibility",
                "visible",
                ['body', 'div', 'p', 'region', 'span'],
                true,
                true,
                function (str) {
                    return str;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "wrapOption",
                "wrap",
                ['span'],
                true,
                true,
                function (str) {
                    return str;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "writingMode",
                "lrtb",
                ['region'],
                false,
                true,
                function (str) {
                    return str;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_tts,
                "zIndex",
                "auto",
                ['region'],
                false,
                true,
                function (str) {
                    
                    var rslt;
                    
                    if (str === 'auto') {
                        
                        rslt = str;
                        
                    } else {
                        
                        rslt = parseInt(str);
                        
                        if (isNaN(rslt)) {
                            rslt = null;
                        }
                        
                    }
                    
                    return rslt;
                },
                null
                ),
        new StylingAttributeDefinition(
                imscNames.ns_ebutts,
                "linePadding",
                "0c",
                ['p'],
                true,
                false,
                imscUtils.parseLength,
                function (doc, parent, element, attr) {
                    if (attr.unit === "c") {

                        return attr.value / doc.cellResolution.h;

                    } else {

                        return null;

                    }
                }
        ),
        new StylingAttributeDefinition(
                imscNames.ns_ebutts,
                "multiRowAlign",
                "auto",
                ['p'],
                true,
                false,
                function (str) {
                    return str;
                },
                null
                ),

        new StylingAttributeDefinition(
                imscNames.ns_smpte,
                "backgroundImage",
                null,
                ['div'],
                false,
                false,
                function (str) {
                    return str;
                },
                null
                ),

        new StylingAttributeDefinition(
                imscNames.ns_itts,
                "forcedDisplay",
                "false",
                ['body', 'div', 'p', 'region', 'span'],
                true,
                true,
                function (str) {
                    return str === 'true' ? true : false;
                },
                null
                )
    ];

    /* TODO: allow null parse function */

    imscStyles.byQName = {};
    for (var i in imscStyles.all) {

        imscStyles.byQName[imscStyles.all[i].qname] = imscStyles.all[i];
    }

    imscStyles.byName = {};
    for (var j in imscStyles.all) {

        imscStyles.byName[imscStyles.all[j].name] = imscStyles.all[j];
    }

})(typeof exports === 'undefined' ? this.imscStyles = {} : exports,
        typeof imscNames === 'undefined' ? require("./names") : imscNames,
        typeof imscUtils === 'undefined' ? require("./utils") : imscUtils);

},{"./names":5,"./utils":7}],7:[function(require,module,exports){
/* 
 * Copyright (c) 2016, Pierre-Anthony Lemieux <pal@sandflow.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @module imscUtils
 */

;
(function (imscUtils) { // wrapper for non-node envs
    
    /* Documents the error handler interface */
    
    /**
     * @classdesc Generic interface for handling events. The interface exposes four
     * methods:
     * * <pre>info</pre>: unusual event that does not result in an inconsistent state
     * * <pre>warn</pre>: unexpected event that should not result in an inconsistent state
     * * <pre>error</pre>: unexpected event that may result in an inconsistent state
     * * <pre>fatal</pre>: unexpected event that results in an inconsistent state
     *   and termination of processing
     * Each method takes a single <pre>string</pre> describing the event as argument,
     * and returns a single <pre>boolean</pre>, which terminates processing if <pre>true</pre>.
     *
     * @name ErrorHandler
     * @class
     */


    /*
     * Parses a TTML color expression
     * 
     */

    var HEX_COLOR_RE = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?/;
    var DEC_COLOR_RE = /rgb\((\d+),(\d+),(\d+)\)/;
    var DEC_COLORA_RE = /rgba\((\d+),(\d+),(\d+),(\d+)\)/;
    var NAMED_COLOR = {
        transparent: [0, 0, 0, 0],
        black: [0, 0, 0, 255],
        silver: [192, 192, 192, 255],
        gray: [128, 128, 128, 255],
        white: [255, 255, 255, 255],
        maroon: [128, 0, 0, 255],
        red: [255, 0, 0, 255],
        purple: [128, 0, 128, 255],
        fuchsia: [255, 0, 255, 255],
        magenta: [255, 0, 255, 255],
        green: [0, 128, 0, 255],
        lime: [0, 255, 0, 255],
        olive: [128, 128, 0, 255],
        yellow: [255, 255, 0, 255],
        navy: [0, 0, 128, 255],
        blue: [0, 0, 255, 255],
        teal: [0, 128, 128, 255],
        aqua: [0, 255, 255, 255],
        cyan: [0, 255, 255, 255]
    };

    imscUtils.parseColor = function (str) {

        var m;
        var r = null;
        if (str in NAMED_COLOR) {

            r = NAMED_COLOR[str];

        } else if ((m = HEX_COLOR_RE.exec(str)) !== null) {

            r = [parseInt(m[1], 16),
                parseInt(m[2], 16),
                parseInt(m[3], 16),
                (m[4] !== undefined ? parseInt(m[4], 16) : 255)];
        } else if ((m = DEC_COLOR_RE.exec(str)) !== null) {

            r = [parseInt(m[1]),
                parseInt(m[2]),
                parseInt(m[3]),
                255];
        } else if ((m = DEC_COLORA_RE.exec(str)) !== null) {

            r = [parseInt(m[1]),
                parseInt(m[2]),
                parseInt(m[3]),
                parseInt(m[4])];
        }

        return r;
    };

    var LENGTH_RE = /^((?:\+|\-)?\d*(?:\.\d+)?)(px|em|c|%)$/;

    imscUtils.parseLength = function (str) {

        var m;

        var r = null;

        if ((m = LENGTH_RE.exec(str)) !== null) {

            r = {value: parseFloat(m[1]), unit: m[2]};
        }

        return r;
    };

})(typeof exports === 'undefined' ? this.imscUtils = {} : exports);

},{}]},{},[4])(4)
});