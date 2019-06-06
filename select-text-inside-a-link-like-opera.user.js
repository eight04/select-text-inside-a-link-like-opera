// ==UserScript==
// @name Select text inside a link like Opera
// @version 5.0.3
// @description Disable link dragging and select text.
// @homepageURL https://github.com/eight04/select-text-inside-a-link-like-opera#readme
// @supportURL https://github.com/eight04/select-text-inside-a-link-like-opera/issues
// @license MIT
// @author eight <eight04@gmail.com> (http://eight04.blogspot.tw)
// @namespace eight04.blogspot.com
// @include *
// @grant GM_addStyle
// @run-at document-start
// ==/UserScript==

const IS_FIREFOX = typeof InstallTrigger !== 'undefined';
const movementTracker = IS_FIREFOX && createMovementTracker();

document.addEventListener("mousedown", e => {
  // only Firefox supports multiple range?
  if (e.shiftKey || e.altKey || e.button || e.ctrlKey && !IS_FIREFOX) {
    return;
  }
  if (e.target.nodeName === "IMG" || e.target.nodeName === "img") {
    return;
  }
  const target = findLinkTarget(e.target);
  if (!target || !target.href) {
    return;
  }
  const initX = e.pageX;
  const initY = e.pageY;
  let posX = initX;
  let posY = initY;
  let selection;
  let mouseMoves = 0;
  
  const events = {
    mousedown: uninit,
    mousemove: e => {
      posX = e.pageX;
      posY = e.pageY;
			if (!selection) {
        mouseMoves++;
        // dragstart may not fire all the time
        // https://github.com/eight04/select-text-inside-a-link-like-opera/issues/9
        if (mouseMoves >= 3) {
          startSelectText();
        }
				return;
			}
			const caretPos = caretPositionFromPoint(
        posX - window.scrollX,
        posY - window.scrollY
      );
      selection.extend(caretPos.offsetNode, caretPos.offset);
    },
    mouseup: () => {
      // delay uninit to cancel click event
      setTimeout(uninit);
    },
    click: e => {
			if (!selection) {
        return;
      }
			// fix browser clicking issue. Cancel click event if we have selected
      // something.
      const clickedTarget = findLinkTarget(e.target);
      if (clickedTarget === target) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    dragstart: e => {
      if (startSelectText()) {
        e.preventDefault();
      }
    }
  };
  
  for (const key of Object.keys(events)) {
    document.addEventListener(key, events[key], true);
  }
  
  function uninit() {
    target.classList.remove("select-text-inside-a-link");
    for (const key of Object.keys(events)) {
      document.removeEventListener(key, events[key], true);
    }    
  }
  
  function startSelectText() {
    const delta = movementTracker || {deltaX: posX - initX, deltaY: posY - initY};
    if (Math.abs(delta.deltaX) < Math.abs(delta.deltaY)) {
      uninit();
      return false;
    }
    selection = window.getSelection();
    const caretPos = caretPositionFromPoint(initX - window.scrollX, initY - window.scrollY);
    if (!selection.isCollapsed && inSelect(caretPos, selection)) {
      uninit();
      return false;
    }
    if (!e.ctrlKey) {
      selection.collapse(caretPos.offsetNode, caretPos.offset);
    } else {
      const range = new Range;
      range.setStart(caretPos.offsetNode, caretPos.offset);
      selection.addRange(range);
    }
    target.classList.add("select-text-inside-a-link");
    return true;
  }
}, true);

if (!document.contentType || !document.contentType.endsWith("/xml")) {
  document.addEventListener("DOMContentLoaded", function(){
    GM_addStyle(".select-text-inside-a-link{ -moz-user-select: text!important; }");
  });
}

function createMovementTracker() {
  // we always have to track mouse movement so we can use the delta in dragstart
  // event.
  // it is possible to calculate the movement between mousedown and dragstart
  // events in Chrome. In Firefox, the two events are fired in the same time.
  const tracker = {
    posX: 0,
    posY: 0,
    deltaX: 0,
    deltaY: 0
  };
  document.addEventListener("mousemove", onMouseMove);
  return tracker;
  
  function onMouseMove(e) {
    if (Math.abs(e.pageX - tracker.posX) < 5 && Math.abs(e.pageY - tracker.posY) < 5) {
      return;
    }
    tracker.deltaX = e.pageX - tracker.posX;
    tracker.deltaY = e.pageY - tracker.posY;
    tracker.posX = e.pageX;
    tracker.posY = e.pageY;
  }
}

function caretPositionFromPoint(x, y) {
	if (document.caretPositionFromPoint) {
		return document.caretPositionFromPoint(x, y);
	}
	var r = document.caretRangeFromPoint(x, y);
	return {
		offsetNode: r.startContainer,
		offset: r.startOffset
	};
}

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

function findLinkTarget(target) {
  while (target && target.nodeName !== "A" && target.nodeName !== "a") {
    target = target.parentNode;
  }
  return target;
}
