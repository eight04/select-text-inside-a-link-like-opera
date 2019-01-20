Select text inside a link like Opera
====================================

[![Build Status](https://travis-ci.com/eight04/select-text-inside-a-link-like-opera.svg?branch=master)](https://travis-ci.com/eight04/select-text-inside-a-link-like-opera)

By installing this script, you can select text inside a link without dragging them around if the cursor was moved horizontally.

![](https://i.imgur.com/f7TgRur.png)
![](https://i.imgur.com/NSqXG5n.png)

Installation
------------

[Greasy Fork](https://greasyfork.org/en/scripts/789-select-text-inside-a-link-like-opera)

Compatibility
-------------

This script supports Firefox and Chrome. However, things become tricky in Firefox.

In Firefox, we can't detect the movement of the cursor *after* the mousedown event, so we actually use the movement *before* the mouse click. If you move the cursor vertically to a link, stop, then drag the link horizontally, the script will detect the movement as vertical and it won't prevent the link from being dragged.

Changelog
---------

* 5.0.0 (Jan 20, 2019)

  - Rewrite.
  - Fix: don't collapse selection if the target is not a link.

* 4.0.12 (Nov 18, 2014)

	- Enhance: Only prevent click if text is selected.
  
* 4.0.11 (Nov 18, 2014)

	- Fix: Form button issue.
  
* 4.0.10 (Nov 17, 2014)

	- Fix: DeviantArt issue. Use capture on "mousedown".
  
* 4.0.9 (Nov 17, 2014)

	- Fix: Firefox clicking issue. (This might break some sites!)
  
* 4.0.8 (Nov 17, 2014)

	- Fix: No effect in firefox's responsive design viewer.
  
* 4.0.7 (Nov 17, 2014)

	- Support Chrome!
  
* 4.0.6 (Nov 12, 2014)

	- Fix: Unable to click links after selecting.
  
* 4.0.5 (Nov 11, 2014)

	- Fix: Unable to drag image.
  
* 4.0.4 (Oct 30, 2014)

	- Fix: Unable to drag selected text.
  
* 4.0.3 (Oct 19, 2014)

	- Cleanup some old code.
	- Add a new method to detect dragging direction.
  
* 4.0.2 (Oct 19, 2014)

	- Fix: Prevent click event when selecting.
  
* 4.0.1

	- Fix: Position calculating bug.
  
* 4.0 (Sep 29, 2014)

	- Now the script will only work if you drag horizontally.
  
* 3.0.1 (Aug 17, 2014)

	- Change the timing of uninit. Will uninit each time mouseup.
  
* 3.0 (Aug 17, 2014)

	- Rewrite with my coding style.
