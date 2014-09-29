// ==UserScript==
// @name        Select text inside a link like Opera
// @namespace   eight04.blogspot.com
// @description Disable link dragging and select text.
// @include     http://*
// @include     https://*
// @version     4.0
// @grant		GM_addStyle
// @run-at      document-start
// ==/UserScript==

var force = {
	target: null,
	select: getSelection(),
	preventClick: false,
	currentPos: {
		x: null,
		y: null
	},
	startPos: {
		x: null,
		y: null
	},
	handleEvent: function(e){
		if (e.type == "click") {
		
			if (this.preventClick) {
				e.preventDefault();
				e.stopPropagation();
				this.preventClick = false;
			}
			
		} else if (e.type == "mouseup") {
		
			if (!this.target) {
				return;
			}

			if (this.select.toString()) {
				this.preventClick = true;
			}
			
			this.uninit();
			
		} else if (e.type == "mousemove") {
			
			this.currentPos.x = e.pageX;
			this.currentPos.y = e.pageY;
			
			if (!this.target) {
				return;
			}

			var caretPos = document.caretPositionFromPoint(this.currentPos.x, this.currentPos.y);
			if (!this.multiSelect) {
				this.select.extend(caretPos.offsetNode, caretPos.offset);
			} else {
				this.range.setEnd(caretPos.offsetNode, caretPos.offset);
			}
			
		} else if (e.type == "dragstart") {
		
			if (e.button || e.altKey || e.shiftKey) {
				return;
			}
			
			if (e.target.nodeName == "IMG") {
				return;
			}
			
			var a = e.target;
			while (a.nodeName != "A" && a.nodeName != "HTML") {
				a = a.parentNode;
			}
			
			if (!a.href) {
				return;
			}
			
			// console.log(this.currentPos.x - e.pageX, this.currentPos.y - e.pageY)
			
			if (Math.abs(e.pageX - this.currentPos.x) <= Math.abs(e.pageY - this.currentPos.y)) {
				return;
			}
			
			e.preventDefault();
			this.init(e, a);
		}
	},
	init: function(e, a){
	
		this.target = a;
		this.startPos.x = e.pageX;
		this.startPos.y = e.pageY;
		
		this.multiSelect = e.ctrlKey;
		
		var caretPos = document.caretPositionFromPoint(this.startPos.x, this.startPos.y);
		if (!this.multiSelect) {
			this.select.collapse(caretPos.offsetNode, caretPos.offset);
		} else {
			this.range = new Range();
			this.range.setEnd(caretPos.offsetNode, caretPos.offset);
			this.range.collapse();
			this.select.addRange(this.range);
		}
		
		this.target.classList.add("force-select");
		
	},
	uninit: function(){
	
		this.target.classList.remove("force-select");
		this.target = null;
		this.range = null;
		this.multiSelect = false;
		
	}
};

document.addEventListener("mousemove", force, false);
document.addEventListener("mouseup", force, false);
document.addEventListener("click", force, true);
document.addEventListener("dragstart", force, true);
document.addEventListener("DOMContentLoaded", function(){
	GM_addStyle(".force-select{ -moz-user-select: text!important; }");
}, false);
