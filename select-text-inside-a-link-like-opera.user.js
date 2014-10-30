// ==UserScript==
// @name        Select text inside a link like Opera
// @namespace   eight04.blogspot.com
// @description Disable link dragging and select text.
// @include     http://*
// @include     https://*
// @version     4.0.4
// @grant		GM_addStyle
// @run-at      document-start
// ==/UserScript==

function inSelect(caretPos, selection){
	var i, len = selection.rangeCount, range;
	for (i = 0; i < len; i++) {
		range = selection.getRangeAt(i);
		if (range.isPointInRange(caretPos.offsetNode, caretPos.offset)) {
			return true;
		}
	}
	return false;
}

var force = {
	target: null,
	select: getSelection(),
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
		
			if (e.ctrlKey || e.shiftKey || e.altKey || e.button) {
				return;
			}
			
			if (!this.select.isCollapsed) {
				e.preventDefault();
				e.stopPropagation();
			}
			
		} else if (e.type == "mousedown") {
			
			if (e.ctrlKey || e.shiftKey || e.altKey || e.button) {
				return;
			}
			
			if (!this.select.isCollapsed) {
				var caretPos = document.caretPositionFromPoint(e.pageX - window.scrollX, e.pageY - window.scrollY);
				if (!inSelect(caretPos, this.select)) {
					this.select.collapse(caretPos.offsetNode, caretPos.offset);
				}
			}
			
		} else if (e.type == "mouseup") {
		
			this.checkMove = false;
		
			if (!this.target) {
				return;
			}

			this.uninit();
			
		} else if (e.type == "mousemove") {

			this.moveX = e.pageX - this.currentPos.x;
			this.moveY = e.pageY - this.currentPos.y;
			this.currentPos.x = e.pageX;
			this.currentPos.y = e.pageY;
			
			if (!this.target) {
				return;
			}
			
			var caretPos = document.caretPositionFromPoint(this.currentPos.x - window.scrollX, this.currentPos.y - window.scrollY);
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
			
			var movementX = e.pageX - this.currentPos.x;
			var movementY = e.pageY - this.currentPos.y;
			
			if (!movementX && !movementY) {
				movementX = this.moveX;
				movementY = this.moveY;
			}
			if (Math.abs(movementX) < Math.abs(movementY)) {
				return;
			}
			
			e.preventDefault();
			this.target = a;
			this.init(e);
		}
	},
	init: function(e){
	
		this.startPos.x = e.pageX;
		this.startPos.y = e.pageY;
		
		this.multiSelect = e.ctrlKey;
		
		var caretPos = document.caretPositionFromPoint(this.startPos.x - window.scrollX, this.startPos.y - window.scrollY);
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
document.addEventListener("mousedown", force, false);
document.addEventListener("click", force, true);
document.addEventListener("dragstart", force, true);
document.addEventListener("dragend", force, true);
document.addEventListener("drag", force, true);
document.addEventListener("DOMContentLoaded", function(){
	GM_addStyle(".force-select{ -moz-user-select: text!important; }");
}, false);
