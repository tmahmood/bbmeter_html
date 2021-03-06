var $root = $('html, body');
var idg = null;

function Core() {
	// this is the core application class
}

var core = new Core();

$(function(){

	idg = new IDGenerator('ele');
	//initDataTables();
	initDatePickers();
	initUIElements();

	notification_Event();
	goToTop_Event();
	selectRow_event();
	Window_Event();
	Init_ReplaceWithBtn();
	init_UpdateInline();
	onBackPage();
	delayed_init();
});

function onBackPage() {
	$(document).on('click', '#backpage', function(ev){
		ev.preventDefault();
		window.history.back();
	});
}

function delayed_init() {
	if (calllater.length === 0) {
		return;
	}
	for (var i = calllater.length - 1; i >= 0; i--) {
		call = calllater[i];
		if (typeof call == 'function') {
			call();

		} else {
			var myFunc = window[call];
			myFunc();
		}
	}
}

function init_UpdateInline() {
	$(document).on('click', '.updateinline', function(ev){
		ev.preventDefault();
		updateInlineContent(this);
	});
	checkAllUpdateInlineLinks();
}

function checkAllUpdateInlineLinks() {
	$('.updateinline').each(function(idx, elm){
		if ($(elm).attr('autoinit') != undefined) {
			updateInlineContent(elm);
		}
	});
}


function updateInlineContent(elm) {
	var $elm = $(elm);

	if ($elm.attr('loadat') != undefined) {
		var $target = $('#' + $elm.attr('loadat'));
	} else {
		var $target = $elm;
	}

	$target.empty().append('...');

	$.get(elm.href, function(res){

		$target.empty().append(res);
		if ($elm.attr('ondone')) {
			var call = $elm.attr('ondone')
			var myFunc = window[call];
			myFunc(elm);
		}
	});
}

function Init_ReplaceWithBtn() {

	$('.replacewithbtn').each(function(idx, elm){
		$elm = $(elm);
		id = idg.getNextId();

		href = $elm.attr('href');
		txt = $elm.attr('text');
		targetid = '#' + elm.id;

		a = createElement({
			element: 'a',
			id: id,
			class: 'btn',
			text: txt,
			attr: { href: href }
		});

		$(targetid).after(a);

		$elm.hide();

		// trigger the origin's click
		$(document).on('click', '#' + id, function(ev){
			ev.preventDefault();
			$(targetid).trigger('click');
		});
	});

}

function replaceWithBtn(target) {
	$target = $(target);
	url = $target.prop('href');
	title = $target.text();
	askqs = target.title;
	role = $target.attr('role');
	nobuttons = $target.attr('nobuttons');
}


function selectRow_event () {
	$(document).on('click', '.multisel td:first-child', function(){
		$(this).parent().toggleClass( "rowselected" );
	});
}

function initDatePickers () {
	$('.datepicker').datepicker({
		dateFormat: "yy-mm-dd",
		changeMonth: true,
		changeYear: true });
}

function goToTop_Event () {
	$(document).on('click', '.gototopbtn a', function(ev){
		ev.preventDefault();
		$root.animate({
			scrollTop: $('#' + this.href.split('#').pop()).offset().top
		}, 500);
	});
}


function gotoAnchor(anchor) {
	$(document).on('click', anchor, function(ev){
		ev.preventDefault();
		$root.animate({
			scrollTop: $('#' + this.href.split('#').pop()).offset().top
		}, 500);
	});
}


function notification_Event () {
	$(document).on('click', '#notifications li', function(){
		$(this).hide();
	});
}

function formatNiceDate (datestring) {
	date = datestring.split(' ').shift();

	var d = new Date(Date.parse(date));
	var month=new Array();

	month[0]="January";
	month[1]="February";
	month[2]="March";
	month[3]="April";
	month[4]="May";
	month[5]="June";
	month[6]="July";
	month[7]="August";
	month[8]="September";
	month[9]="October";
	month[10]="November";
	month[11]="December";
	var n = month[d.getMonth()];

	return n + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function notification (message, type, keepit) {
	if (message === '') {
		return;
	}

	if (message == 'You are not logged in') {
		window.location = location;
	}

	if (keepit == undefined && ['error', 'warn'].indexOf(type) >= 0) {
		keepit = true;
	}

	div = createElement( { element:'div', attr: { class: type, keepit: keepit } } );
	checkurl = message.split('|');
	$(div).append(checkurl[0]);

	if (checkurl.length  > 1) {
		a = createElement({ element: 'a', attr: { href: checkurl[1] }, text: 'click here' });
		$(div).append(a);
	}

	$('#notifications').show();
	$('#notifications').append(div);

	if (keepit === true) {
		$(document).on('click', '#notifications', function (ev) {
			$('#notifications').hide().empty();
		});
	} else {
		setTimeout(function() {
			$('#notifications div').each(function(idx, elm) {
				$elm = $(elm);
				if ($elm.attr('keepit') == undefined) {
					$elm.empty().hide();
				}
			});
		}, 5000);
	}
}

function initUIElements () {
	$('select').select2();
	$('#tabs').tabs();
	updateSelectElement();
}

function updateSelectElement() {
	$('select').each(function(idx, elm) {
		$elm = $(elm);
		$existing = $('#' + elm.id + '_old');
		if ($existing.length > 0) {
			$elm.select2('val', $existing.val());
		}
	});
}


function showAjaxLoader($elm) {

	div = createElement({
							element: 'div',
							attr: { style: 'text-align: center;' }
						});
	img = getImage('ajax-loader.gif');
	$(div).append(img);
	return $elm.empty().append(div);
}

function toInt(v)
{
	return 1 * v;
}


Core.prototype.list_values = function(dict) {
	return $.map(dict, function(key, value) {
		return value;
	});
};

Core.prototype.list_keys = function(dict) {
	return $.map(dict, function(key, value) {
		return key;
	});
}

Core.prototype.exectueStringAsFunction = function(funcname, window) {
	var args = [].slice.call(arguments).splice(2);
	var namespaces = funcname.split(".");
	var func = namespaces.pop();
	for(var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(this, args);
};

Core.prototype.moveTo = function(toelm, pad) {
	if (pad == undefined) {
		pad = 0;
	}
	$root.animate({
		scrollTop: $(toelm).offset().top + pad
	}, 500);
};


///////////////////////////////////////////////////////////////////////
//
function getBasicTable(headers) {
	////////////
	var tbl = createElement({element: 'table'});
	var thd = createElement({element: 'thead'});
	var tr  = createElement({element: 'tr'});
	var tbody = createElement({ element: 'tbody' });
	for (var k in headers) {
		var th = headers[k];
		var thr = createElement({element: 'th', text: th});
		$(tr).append(thr);
	}
	//////////////////////////////////
	$(thd).append(tr);
	$(tbl).append(thd);
	$(tbl).append(tbody);
	return tbl;
}

function addTableRow(table, cols, asheader) {
	$tbody = $(table).find('tbody');
	var tr = createElement({ element: 'tr' });
	$tbody.append(tr);
	tdtype = asheader == undefined ? 'td' : 'th';
	for (var i=0; i < cols.length; i++) {
		var col = cols[i];
		var td = createElement({ element: tdtype, text: col });
		if (!isNaN(col)) {
			$(td).addClass('number');
		}
		$(tr).append(td);
	}
	return table;
}


function addTableFooter(table, cols) {
	$table = $(table);
	tbody = createElement({ element: 'tfoot' });
	$table.append(tbody);
	$tbody = $(tbody);
	var tr = createElement({ element: 'tr' });
	$tbody.append(tr);
	for (var i=0; i < cols.length; i++) {
		var col = cols[i];
		var td = createElement({ element: 'th', text: col });
		$(tr).append(td);
	}
	return table;
}

function createElement (opt) {
	el = document.createElement(opt.element);
	for (attr in opt.attr) {
		$(el).attr(attr, opt.attr[attr]);
	}

	for (prop in opt.prop) {
		$(el).prop(prop, opt.prop[prop]);
	}

	if (opt.text != undefined) {
		if (typeof(opt.text) == "object") {
			$(el).append(opt.text);
		} else {
			$(el).text(opt.text);
		}
	}

	if (opt.class != undefined) {
		$(el).addClass(opt.class);
	}

	if (opt.id != undefined) {
		el.id = opt.id;
	}
	return el;
}
// creates image btn
function getImageBtn (prop) {
	if (!('url' in prop) ) {
		return 'no url provided';
	}

	if (!('id' in prop)) {
		prop.id = idg.getNextId();
	}

	if (!('title' in prop)) {
		prop.title = 'title' + prop.id;
	}

	if (!('class' in prop)) {
		prop.class = "image_button_" + prop.id;
	}

	a = document.createElement('a');
	a.href = prop.url;
	a.id = prop.id;
	$(a).addClass(prop.class);
	a.title = prop.title;


	if ('extra' in prop) {
		for (k in prop.extra) {
			$(a).attr(k, prop.extra[k]);
		}
	}

	$(a).append(getImage(prop.img));
	return a;
}

function getImage (img, alt) {
	imge = document.createElement('img');
	imge.src = 'assets/imgs/' + img;
	if (alt != undefined) {
		imge.alt = alt;
	}
	return imge;
}


function FilterTable(tablename, filterbox, nocolumn) {
	this.tablename = tablename;
	this.filterbox = filterbox;
	this.nocolumn  = nocolumn;
	this.lastreplace = {};
}

FilterTable.prototype.filterTable = function() {
	var me = this;
	$(document).on('keyup', me.filterbox, function(e) {
		searchtxt = $(this).prop('value');
		$(me.tablename + ' tbody tr').hide();
		for (var i=1; i <= me.nocolumn; i++) {
			$(me.tablename + ' tbody td:nth-child(' + i + ')').filter(function(index){
				if(me.matchSearchText(me.searchtxt, $(this))){
					$(this).parent().show();
				}
			});
		}
	});
}

FilterTable.prototype.highlightSearchResults = function() {
	txt = $(this.filterbox).val();
	for (var i=1; i <= this.nocolumn; i++) {
		var me = this;
		$(this.tablename + ' tr td:nth-child(' + i + ')').each(function(idx, elm){
			me.doSearch(elm, txt);
		});
	}
}

FilterTable.prototype.doSearch = function(elm, txt) {
	if (txt == undefined) {
		return;
	}

	var $elm = $(elm);
	var etxt = $elm.text();
	if (etxt.toLowerCase().indexOf(txt.toLowerCase()) !== -1) {

		if ($elm.find('a').length > 0) {
			var $a = $elm.find('a');
			var at = $a.text();
			at = at.replace(txt, '<b>' + txt + '</b>', 'i');
			$a.empty().append(at);
		} else {
			var position = etxt.indexOf(txt);
			var tlen = txt.length;
			var foundtxt = '<b>' + etxt.substr(position, tlen) + '</b>';
			etxt = etxt.replace(txt, foundtxt, 'i');
			$elm.empty().append(etxt);
		}
	}
}


FilterTable.prototype.matchSearchText = function (searchtext, $elm) {
	return $elm.text().toLowerCase().indexOf(searchtxt.toLowerCase()) !== -1;
}


/// class IDGenerator
/// Generate unique ID
function IDGenerator(prefix) {
	this.prefix = prefix;
	this.last_idx = 0;
	this.last_id = prefix + this.last_idx;

	while ($('#' + this.last_id).length > 0) {
		this.last_idx++;
		this.last_id = prefix + this.last_idx;
	}
}
// we are expecting these ID are not created manually anywhere
// so not checking if it exists already.
IDGenerator.prototype.getNextId = function(){
	newid = this.prefix + this.last_idx;
	this.last_idx++;
	return newid;
}


/* Modernizr 2.8.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-flexboxlegacy-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-cssclasses-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.8.2',

    Modernizr = {},

    enableClasses = true,

    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  = document.createElement('input')  ,

    smile = ':)',

    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),

    ns = {'svg': 'http://www.w3.org/2000/svg'},

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, 


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },



    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

            var isSupported = eventName in element;

        if ( !isSupported ) {
                if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

                    if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),


    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { 
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }

    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

            if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

            } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }    tests['flexbox'] = function() {
      return testPropsAll('flexWrap');
    };


    tests['flexboxlegacy'] = function() {
        return testPropsAll('boxDirection');
    };


    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };



    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };


    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };



    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };

    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB", window);
    };

    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };


    tests['rgba'] = function() {
        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
            setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
                setCss('background:url(https://),url(https://),red url(https://)');

            return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };



    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
                setCssAll('opacity:.55');

                    return (/^0.55$/).test(mStyle.opacity);
    };


    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
                       (str1 + '-webkit- '.split(' ').join(str2 + str1) +
                       prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

                        if ( ret && 'webkitPerspective' in docElement.style ) {

                      injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };



    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
          var style = document.getElementById('smodernizr'),
              sheet = style.sheet || style.styleSheet,
              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };

    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
          bool = node.offsetHeight >= 3;
        });

        return bool;
    };
    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

            try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                            bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                                                    bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };


    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    function webforms() {
                                            Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
                                  attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
                            Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                                                    if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                                        bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                                                                                  (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                                                                                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                                        bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                                        bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        }
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    Modernizr.input || webforms();


     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
                                              return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; 
     };


    setCss('');
    modElem = inputElem = null;

    ;(function(window, document) {
                var version = '3.7.0';

            var options = window.html5 || {};

            var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

            var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

            var supportsHtml5Styles;

            var expando = '_html5shiv';

            var expanID = 0;

            var expandoData = {};

            var supportsUnknownElements;

        (function() {
          try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
                    supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
                        (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
          } catch(e) {
                    supportsHtml5Styles = true;
            supportsUnknownElements = true;
          }

        }());

            function addStyleSheet(ownerDocument, cssText) {
          var p = ownerDocument.createElement('p'),
          parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

          p.innerHTML = 'x<style>' + cssText + '</style>';
          return parent.insertBefore(p.lastChild, parent.firstChild);
        }

            function getElements() {
          var elements = html5.elements;
          return typeof elements == 'string' ? elements.split(' ') : elements;
        }

            function getExpandoData(ownerDocument) {
          var data = expandoData[ownerDocument[expando]];
          if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
          }
          return data;
        }

            function createElement(nodeName, ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
          }
          if (!data) {
            data = getExpandoData(ownerDocument);
          }
          var node;

          if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
          } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
          } else {
            node = data.createElem(nodeName);
          }

                                                    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

            function createDocumentFragment(ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
          }
          data = data || getExpandoData(ownerDocument);
          var clone = data.frag.cloneNode(),
          i = 0,
          elems = getElements(),
          l = elems.length;
          for(;i<l;i++){
            clone.createElement(elems[i]);
          }
          return clone;
        }

            function shivMethods(ownerDocument, data) {
          if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
          }


          ownerDocument.createElement = function(nodeName) {
                    if (!html5.shivMethods) {
              return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
          };

          ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                                                          'var n=f.cloneNode(),c=n.createElement;' +
                                                          'h.shivMethods&&(' +
                                                                                                                getElements().join().replace(/[\w\-]+/g, function(nodeName) {
            data.createElem(nodeName);
            data.frag.createElement(nodeName);
            return 'c("' + nodeName + '")';
          }) +
            ');return n}'
                                                         )(html5, data.frag);
        }

            function shivDocument(ownerDocument) {
          if (!ownerDocument) {
            ownerDocument = document;
          }
          var data = getExpandoData(ownerDocument);

          if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument,
                                                                                'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                                                                                    'mark{background:#FF0;color:#000}' +
                                                                                    'template{display:none}'
                                         );
          }
          if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
          }
          return ownerDocument;
        }

            var html5 = {

                'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

                'version': version,

                'shivCSS': (options.shivCSS !== false),

                'supportsUnknownElements': supportsUnknownElements,

                'shivMethods': (options.shivMethods !== false),

                'type': 'default',

                'shivDocument': shivDocument,

                createElement: createElement,

                createDocumentFragment: createDocumentFragment
        };

            window.html5 = html5;

            shivDocument(document);

    }(this, document));

    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;


    Modernizr.hasEvent      = isEventSupported;

    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };

    Modernizr.testAllProps  = testPropsAll;


    Modernizr.testStyles    = injectElementWithStyles;    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                                                    (enableClasses ? ' js ' + classes.join(' ') : '');

    return Modernizr;

})(this, this.document);
/*yepnope1.5.4|WTFPL*/
(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);
Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0));};
;
function StorageManagement() {
	this.storage = localStorage;
}

StorageManagement.prototype.getItem = function(key) {
	return this.storage.getItem(key);
};

StorageManagement.prototype.setItem = function(key, val) {
	this.storage.setItem(key, val);
};

StorageManagement.prototype.removeItem = function(key, val) {
	this.storage.removeItem(key);
};


function Window_Event () {
	$(document).on('click', '.askconfirm', function(ev){
		ev.preventDefault();
		createConfirmationWindow(this);
	});

	$(document).on('click', '.ajaxwindow', function(ev){
		ev.preventDefault();
		createAjaxPageWindow(this);
	});

	$(document).on('click', '.editwindow', function(ev){
		ev.preventDefault();
		createInputWindow(this);
	});
}

function checkWindowElementExists(elmid) {
	if ($('#' + elmid).length === 0) {
		$('main').append('<div id="' + elmid + '"></div>');
		return true;
	}
	return false;
}

function getWindowSize($target) {
	if ($target.attr('size') !== undefined) {
		size = $target.attr('size');
		if (size == 'max') {
			width = $(window).width() - 40;
			height = $(window).height() - 40;
		} else {
			sizes = $target.attr('size').split('x');
			width = sizes[0] * 1;
			height = sizes[1] * 1;
		}
	} else {
		width = 600;
		height = 300;
	}
	return [width, height];
}

/*
<a href="url/[id]" class="editwindow" size="500x550"
	datafn="callback_to_get_form_elements"
	onsave="callbact_on_form_submission">[TEXT]</a>
*/

function InputWindow(target) {

	checkWindowElementExists('inputwindow');
	this.$inputwindow = $('#inputwindow');

	this.target = target;
	this.$target = $(target);
	this.url = target.href;
	this.title = this.$target.text();
	this.size = getWindowSize(this.$target);
}

InputWindow.prototype.initiate = function() {
	this.$inputwindow.empty();
	this.cfg = {
		model: true,
		title: this.title,
		width: this.size[0],
		height: this.size[1]
	};
	return this;
};

InputWindow.prototype.initFunctions = function() {

	var datafn = this.$target.attr('datafn');
	fn = window[datafn];
	this.inputs = fn(this.target);
	if (this.inputs === false) {
		throw 'No matching elements found';
	}

	fn = this.$target.attr('onsave');
	this.onsave = window[fn];
	return this;
};

InputWindow.prototype.buildForm = function() {
	fset = createElement({ element: 'fieldset' });
	divmain = createElement({ element: 'div', class: 'impform' });
	$(divmain).append(fset);
	this.$inputwindow.append($(divmain));
	for (var i = 0; i < this.inputs.length; i++) {
		$item = $(this.inputs[i]);
		label = $item.attr('label');
		id = idg.getNextId();
		div = createElement({ element: 'div' });
		lbl = createElement({
			element: 'label',
			attr: { 'for': id },
			text: label
		});
		$(div).append(lbl);
		if ($item.attr('role') == 'text') {
			txt = $item.text();
		} else {
			txt = $item.val();
		}
		el = createElement({
			element: 'input',
			id: id,
			attr: {
				type: 'text',
				name: $item.attr('name'),
				value: txt
			}
		});
		$(div).append(el);
		$(fset).append(div);
	}
	return this;
};

InputWindow.prototype.display = function() {
	this.$inputwindow.dialog(this.cfg);
	var oninit = this.$target.attr('oninit');
	if (oninit in window) {
		var oifn = window[oninit];
		oifn(this.$target);
	}
	return this;
};

InputWindow.prototype.addButtons = function() {
	var me = this;
	this.cfg.buttons = {
		Save: function() {
			d = me.$inputwindow.find('fieldset').serialize();
			$.post(me.url, d, function(res){
					if (me.onsave !== undefined) {
						me.onsave(res);
					}
					notification(res.m, res.s == 1 ? "info": "error");
					me.$inputwindow.dialog('close');
			}).fail(function(res){
				notification(res, 'error');
			});
		}
	};
	return this;
};

/*
<a href="url/[id]" class="ajaxwindow" size="500x550"
	onint="callback_on_window_load">[TEXT]</a>
	use callOnAjaxWindowFormSubmit to handle form submits
*/

function createInputWindow(target) {
	inpw = new InputWindow(target);
	inpw.initiate()
		.initFunctions()
		.buildForm()
		.addButtons()
		.display();
}

function createAjaxPageWindow(target) {
	aj = new AjaxWindow(target)
			.initiate()
			.setWindowProperties()
			.setEventProcessing()
			.display();
}

function AjaxWindow(target) {
	checkWindowElementExists('ajaxwindow');
	this.target = target;
	this.$ajaxwindow = $('#ajaxwindow');
	this.$target = $(this.target);
	this.url = this.$target.prop('href');
	this.title = this.$target.text();
	this.askqs = this.target.title;
	this.role = this.$target.attr('role');
	this.nobuttons = this.$target.attr('nobuttons');
	this.oninit = this.$target.attr('oninit');
}

AjaxWindow.prototype.initiate = function(){

	size = getWindowSize(this.$target);
	showAjaxLoader(this.$ajaxwindow);
	this.loadContent();
	return this;
};

AjaxWindow.prototype.loadContent = function() {
	me = this;
	$.get(me.url, function(res){
		me.$ajaxwindow.empty().append(res);
		var fn = window[me.oninit];
		if(typeof fn === 'function') {
			fn(me.$ajaxwindow, me.url, me.target);
		}
	});
};


AjaxWindow.prototype.setWindowProperties = function(){
	this.cfg = {
		modal: true,
		title: this.title,
		width: size[0],
		height: size[1]
	};
	return this;
};

AjaxWindow.prototype.setEventProcessing = function(){
	if (!this.usingDefaultDialogButtons()) {
		if (this.role !== '') {
			var fn = window[this.role];
			if(typeof fn === 'function') {
				fn(this.$ajaxwindow, this.url);
			}
		}
	}
	return this;
};

AjaxWindow.prototype.display = function() {
	this.$ajaxwindow.dialog(this.cfg);
	return this;
};

AjaxWindow.prototype.usingDefaultDialogButtons = function() {
	if(!(this.nobuttons === undefined || this.nobuttons == 'false')) {
		return false;
	}
	me = this;
	$.extend(me.cfg, {
		buttons: {
			OK: function() {
				src = this;
				$(src).dialog("close");
				if (me.role === undefined) {
					window.location = me.$target.prop('href');
				} else {
					$.get(me.$target.prop('href'), function (res) {
						var myFunc = window[me.role];
						myFunc(res);
					});
				}
			},
			Cancel: function() {
				$(this).dialog("close");
			}
		},
	});
	return true;
};

function ConfirmationWindow(target) {
	//
	// <a href="action_url" class="askconfirm" title="confirmation text"
	// size="WxH" onconfirm="callback_function">[Dialog Title]</a>
	//
	checkWindowElementExists('askconfirm');
	this.target = target;
	this.$target = $(target);
	this.$windowcontainer = $('#askconfirm');
	this.title = this.$target.text();
	this.ask_question = target.title;
	this.size = getWindowSize(this.$target);
}

ConfirmationWindow.prototype.initiate = function() {

	if (this.$target.attr('role') !== undefined) {
		console.log("Please change to 'onconfirm' > "  + this.title);
		onconfirm = this.$target.attr('role');
	} else {
		onconfirm = this.$target.attr('onconfirm');
	}

	if (onconfirm !== '') {
		this.onconfirm = onconfirm;
	}

	this.$windowcontainer.empty().append(this.ask_question);
	return this;
};

ConfirmationWindow.prototype.display = function() {

	me = this;
	this.$windowcontainer.dialog({
		title: me.title,
		width: me.size[0],
		height: me.size[1],
		buttons: {
			Yes: function() {
				$(this).dialog("close");

				if (me.onconfirm === undefined) {
					window.location = me.$target.prop('href');
					return;
				}

				$.get(me.$target.prop('href'), function (res) {
					var myFunc = window[me.onconfirm];
					myFunc(res);
				});
			},
			Cancel: function() {
				$(this).dialog("close");
			}
		},
	});
	return this;
};

function createConfirmationWindow(target) {
	cnf = new ConfirmationWindow(target).initiate().display();
}


function callOnAjaxWindowFormSubmit(formid, callafter) {
	$(document).on('submit', formid, function(){
		$rf = $(formid);
		d = $rf.serialize();
		$.post($rf.prop('action'), d, function(res) {
			$('#ajaxwindow').dialog('close');
			message = res.message === undefined ? res.m : res.message;
			if (res.s == 1 || res.success == 1) {
				notification(message, 'success');
			} else {
				notification(message, 'error', true);
			}
			if (callafter !== undefined) {
				callafter(res);
			}
		}, 'json');
		return false;
	});
}
