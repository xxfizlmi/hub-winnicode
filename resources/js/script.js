/**
=========================================================================
=========================================================================
Template Name: Datta Able - Tailwind Admin Template
Author: CodedThemes
Support: https://codedthemes.support-hub.io/
File: script.js
=========================================================================
=========================================================================
*/
'use strict';
var flg = '0';

// Function to handle menu click events (collpase menus and it's submenu also collapse)

function menu_click() {
  // Remove click event listeners from navigation menu items
  var elem = document.querySelectorAll('.pc-navbar li');
  for (var j = 0; j < elem.length; j++) {
    elem[j].removeEventListener('click', function () {});
  }

  // Hide submenu items (when menu link not active then submenu hide)
  var elem = document.querySelectorAll('.pc-navbar li:not(.pc-trigger) .pc-submenu');
  for (var j = 0; j < elem.length; j++) {
    elem[j].style.display = 'none';
  }

  // Add click event listeners to main menu items (for first menu level collapse)
  var pc_link_click = document.querySelectorAll('.pc-navbar > li:not(.pc-caption).pc-hasmenu');
  for (var i = 0; i < pc_link_click.length; i++) {
    pc_link_click[i].addEventListener('click', function (event) {
      // Prevent parent elements from triggering their events
      event.stopPropagation();
      var targetElement = event.target;
      if (targetElement.tagName == 'SPAN') {
        targetElement = targetElement.parentNode;
      }
      // Toggle submenu visibility (active remove who has menu link not clicked and it's submenu also hide)
      if (targetElement.parentNode.classList.contains('pc-trigger')) {
        targetElement.parentNode.classList.remove('pc-trigger');
        slideUp(targetElement.parentNode.children[1], 200);
        window.setTimeout(() => {
          targetElement.parentNode.children[1].removeAttribute('style');
          targetElement.parentNode.children[1].style.display = 'none';
        }, 200);
      } else {
        // Close other open submenus
        var tc = document.querySelectorAll('li.pc-trigger');
        for (var t = 0; t < tc.length; t++) {
          var c = tc[t];
          c.classList.remove('pc-trigger');
          slideUp(c.children[1], 200);
          window.setTimeout(() => {
            c.children[1].removeAttribute('style');
            c.children[1].style.display = 'none';
          }, 200);
        }

        // Open clicked submenu (for active menu link)
        targetElement.parentNode.classList.add('pc-trigger');
        var submenu_list = targetElement.children[1];
        if (submenu_list) {
          slideDown(targetElement.parentNode.children[1], 200);
        }
      }
    });
  }

  // Initialize SimpleBar for navbar content if available
  if (document.querySelector('.navbar-content')) {
    new SimpleBar(document.querySelector('.navbar-content'));
  }

  // Add click event listeners to submenu items
  var pc_sub_link_click = document.querySelectorAll('.pc-navbar > li:not(.pc-caption) li.pc-hasmenu');
  for (var i = 0; i < pc_sub_link_click.length; i++) {
    pc_sub_link_click[i].addEventListener('click', function (event) {
      var targetElement = event.target;
      if (targetElement.tagName == 'SPAN') {
        targetElement = targetElement.parentNode;
      }
      event.stopPropagation();
      // Toggle submenu visibility
      if (targetElement.parentNode.classList.contains('pc-trigger')) {
        targetElement.parentNode.classList.remove('pc-trigger');
        slideUp(targetElement.parentNode.children[1], 200);
      } else {
        // Close other open submenus
        var tc = targetElement.parentNode.parentNode.children;
        for (var t = 0; t < tc.length; t++) {
          var c = tc[t];
          c.classList.remove('pc-trigger');
          if (c.tagName == 'LI') {
            c = c.children[0];
          }
          if (c.parentNode.classList.contains('pc-hasmenu')) {
            slideUp(c.parentNode.children[1], 200);
          }
        }

        // Open clicked submenu
        targetElement.parentNode.classList.add('pc-trigger');
        var submenu_list = targetElement.parentNode.children[1];
        if (submenu_list) {
          submenu_list.removeAttribute('style');
          slideDown(submenu_list, 200);
        }
      }
    });
  }
}


// Initialize menu click function on DOMContentLoaded (function call on page load)
document.addEventListener('DOMContentLoaded', menu_click);

// Initialize various components on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  // feather icon start
  feather.replace();
  // feather icon end

  // Check for specific layout and add scrollbar if necessary(add scrollbar from 1024 screen size in horizontal layout)
  if (document.querySelector('html').hasAttribute('data-pc-layout')) {
    if (document.querySelector('html').getAttribute('data-pc-layout') == 'horizontal') {
      var docW = window.innerWidth;
      if (docW <= 1024) {
        add_scroller();
      }
    }
  } else {
    add_scroller();
  }

  // Menu collapse click start (when click it's open and close sidebar for mobile screen)
  var mobile_collapse_over = document.querySelector('#mobile-collapse');
  if (mobile_collapse_over) {
    mobile_collapse_over.addEventListener('click', function () {
      var mobile_sidebar = document.querySelector('.pc-sidebar');
      if (mobile_sidebar) {
        if (document.querySelector('.pc-sidebar').classList.contains('mob-sidebar-active')) {
          rm_menu();
        } else {
          document.querySelector('.pc-sidebar').classList.add('mob-sidebar-active');
          // add overlay when sidebar open
          document.querySelector('.pc-sidebar').insertAdjacentHTML('beforeend', '<div class="pc-menu-overlay"></div>');
          document.querySelector('.pc-menu-overlay').addEventListener('click', function () {
            rm_menu();
          });
        }
      }
    });
  }
  // Menu collapse click end

  // header dropdown scrollbar start
  if (document.querySelector('.header-notification-scroll')) {
    new SimpleBar(document.querySelector('.header-notification-scroll'));
  }

  if (document.querySelector('.profile-notification-scroll')) {
    new SimpleBar(document.querySelector('.profile-notification-scroll'));
  }
  // header dropdown scrollbar end

  // component scrollbar start
  if (document.querySelector('.component-list-card .scroll-div')) {
    new SimpleBar(document.querySelector('.component-list-card .scroll-div'));
  }
  // component- dropdown scrollbar end

  // for sidebar close
  var sidebar_hide = document.querySelector('#sidebar-hide');
  if (sidebar_hide) {
    sidebar_hide.addEventListener('click', function () {
      if (document.querySelector('.pc-sidebar').classList.contains('pc-sidebar-hide')) {
        document.querySelector('.pc-sidebar').classList.remove('pc-sidebar-hide');
      } else {
        document.querySelector('.pc-sidebar').classList.add('pc-sidebar-hide');
      }
    });
  }

  // for input focus add when click search icon
  if (document.querySelector('.trig-drp-search')) {
    const search_drp = document.querySelector('.trig-drp-search');
    search_drp.addEventListener('shown.bs.dropdown', (event) => {
      document.querySelector('.drp-search input').focus();
    });
  }

  // layout options (when click customizer layout options according to that set value in local storage)
  setLayout();
  var if_layout = document.querySelectorAll('.theme-main-layout');
  var layoutValue = 'vertical';
  if (if_layout) {
    var preset_layout = document.querySelectorAll('.theme-main-layout > a');
    preset_layout.forEach(function (element) {
      element.addEventListener('click', function () {
        // Reload the page after setting the layout for the first time to sync in all open tabs
        location.reload();

        document.querySelectorAll('.theme-main-layout > a').forEach(function (el) {
          el.classList.remove('active');
        });
        this.classList.add('active');
        if (this.getAttribute('data-value') == 'horizontal') {
          layoutValue = 'horizontal';
        } else if (this.getAttribute('data-value') == 'compact') {
          layoutValue = 'compact';
        } else if (this.getAttribute('data-value') == 'tab') {
          layoutValue = 'tab';
        } else if (this.getAttribute('data-value') == 'color-header') {
          layoutValue = 'color-header';
        } else {
          layoutValue = 'vertical';
        }

        // Set data to localStorage
        localStorage.setItem('layout', layoutValue);

        setLayout();
      });
    });
  }
});

// Function to set the layout based on data stored in localStorage
function setLayout() {
  var layout = localStorage.getItem('layout'); // Retrieve layout data from localStorage

  // Pass the layout value to main_layout_change function
  main_layout_change(layout);

  // Load corresponding scripts or perform actions based on the layout value
  if (layout !== null && layout !== '') {
    var script = document.createElement('script');
    if (layout === 'horizontal') {
      document.querySelector('.pc-sidebar').classList.add('d-none');
      script.src = '../assets/js/layout-horizontal.js'; // Load script for horizontal layout
      document.body.appendChild(script);
    } else if (layout === 'color-header') {
      // Change logo color for color-header layout
      if (document.querySelector('.pc-sidebar .m-header .logo-lg')) {
        document.querySelector('.pc-sidebar .m-header .logo-lg').setAttribute('src', '../assets/images/logo-white.svg');
      }
    } else if (layout === 'compact') {
      script.src = '../assets/js/layout-compact.js'; // Load script for compact layout
      document.body.appendChild(script);
    } else if (layout === 'tab') {
      script.src = '../assets/js/layout-tab.js'; // Load script for tab layout
      document.body.appendChild(script);
    }
  }

  // If no layout data found in localStorage, set default layout to 'vertical'
  if (layout === null) {
    main_layout_change('vertical');
    localStorage.setItem('layout', 'vertical');
  }
}

// Function to handle menu click and scrollbar initialization
function add_scroller() {
  // Initialize scrollbar if navbar-content exists
  if (document.querySelector('.navbar-content')) {
    new SimpleBar(document.querySelector('.navbar-content'));
  }
}

// Function to hide mobile menu (sidebar hide on click overlay)
function rm_menu() {
  // Remove active class from mobile menu elements
  var sidebar = document.querySelector('.pc-sidebar');
  var topbar = document.querySelector('.topbar');

  if (sidebar) {
    sidebar.classList.remove('mob-sidebar-active');
  }
  if (topbar) {
    topbar.classList.remove('mob-sidebar-active');
  }

  // Remove menu overlay elements with error checking
  var sidebarOverlay = document.querySelector('.pc-sidebar .pc-menu-overlay');
  var topbarOverlay = document.querySelector('.topbar .pc-menu-overlay');

  if (sidebarOverlay) {
    sidebarOverlay.remove();
  }
  if (topbarOverlay) {
    topbarOverlay.remove();
  }
}

// Function to remove overlay menu
function remove_overlay_menu() {
  // Remove active class from sidebar and topbar if they exist
  var sidebar = document.querySelector('.pc-sidebar');
  var topbar = document.querySelector('.topbar');

  if (sidebar) {
    sidebar.classList.remove('pc-over-menu-active');
    var sidebarOverlay = sidebar.querySelector('.pc-menu-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.remove();
    }
  }

  if (topbar) {
    topbar.classList.remove('mob-sidebar-active');
    var topbarOverlay = topbar.querySelector('.pc-menu-overlay');
    if (topbarOverlay) {
      topbarOverlay.remove();
    }
  }
}

// Event listener to initialize tooltips, popovers, and toasts on window load
window.addEventListener('load', function () {
  // Remove pre-loader after page load with a fade-out effect
  var loader = document.querySelector('.loader-bg');
  if (loader) {
    loader.style.transition = 'opacity 0.5s ease';
    loader.style.opacity = '0';

    // Wait for the fade-out transition to complete before removing the element
    setTimeout(function () {
      loader.remove();
    }, 500); // Duration matches the CSS transition duration
  }
});

// Function to mark active menu items based on current page URL
var elem = document.querySelectorAll('.pc-sidebar .pc-navbar a');
for (var l = 0; l < elem.length; l++) {
  // Check if current URL matches menu item URL
  var pageUrl = window.location.href.split(/[?#]/)[0];
  if (elem[l].href == pageUrl && elem[l].getAttribute('href') != '') {
    // Add active class to matching menu item and its parent elements
    elem[l].parentNode.classList.add('active');
    elem[l].parentNode.parentNode.parentNode.classList.add('pc-trigger');
    elem[l].parentNode.parentNode.parentNode.classList.add('active');
    elem[l].parentNode.parentNode.style.display = 'block';
    elem[l].parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('pc-trigger');
    elem[l].parentNode.parentNode.parentNode.parentNode.style.display = 'block';
  }
}

// Change authentication logo
document.querySelectorAll('.auth-main.v2 .img-brand').forEach((img) => {
  img.setAttribute('src', '../assets/images/logo-white.svg');
});

// Function to remove CSS classes with a given prefix from a DOM node
function removeClassByPrefix(node, prefix) {
  // Create a copy of the class list to avoid issues with dynamic length
  node.classList.forEach((value) => {
    if (value.startsWith(prefix)) {
      node.classList.remove(value);
    }
  });
}

// Functions for sliding up, sliding down, and toggling visibility of elements
let slideUp = (target, duration = 0) => {
  // Slide up animation implementation
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
};

let slideDown = (target, duration = 0) => {
  // Slide down animation implementation
  target.style.removeProperty('display');
  let display = window.getComputedStyle(target).display;

  if (display === 'none') display = 'block';

  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  window.setTimeout(() => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
};

var slideToggle = (target, duration = 0) => {
  // Slide toggle animation implementation
  if (window.getComputedStyle(target).height === '0px') {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};

// =======================================================
// =======================================================

/**
 * simplebar - v6.3.1
 * Scrollbars, simpler.
 * https://grsmto.github.io/simplebar/
 *
 * Made by Adrien Denat from a fork by Jonathan Nicol
 * Under MIT License
 */

var SimpleBar = (function () {
    "use strict";
    var t = function (e, i) {
        return (
            (t =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                    function (t, e) {
                        t.__proto__ = e;
                    }) ||
                function (t, e) {
                    for (var i in e)
                        Object.prototype.hasOwnProperty.call(e, i) &&
                            (t[i] = e[i]);
                }),
            t(e, i)
        );
    };
    function e(t) {
        var e = typeof t;
        return null != t && ("object" == e || "function" == e);
    }
    var i =
            "object" == typeof global &&
            global &&
            global.Object === Object &&
            global,
        s = "object" == typeof self && self && self.Object === Object && self,
        r = i || s || Function("return this")(),
        l = function () {
            return r.Date.now();
        },
        o = /\s/;
    var n = /^\s+/;
    function a(t) {
        return t
            ? t
                  .slice(
                      0,
                      (function (t) {
                          for (var e = t.length; e-- && o.test(t.charAt(e)); );
                          return e;
                      })(t) + 1
                  )
                  .replace(n, "")
            : t;
    }
    var c = r.Symbol,
        h = Object.prototype,
        u = h.hasOwnProperty,
        d = h.toString,
        p = c ? c.toStringTag : void 0;
    var v = Object.prototype.toString;
    var f = c ? c.toStringTag : void 0;
    function m(t) {
        return null == t
            ? void 0 === t
                ? "[object Undefined]"
                : "[object Null]"
            : f && f in Object(t)
            ? (function (t) {
                  var e = u.call(t, p),
                      i = t[p];
                  try {
                      t[p] = void 0;
                      var s = !0;
                  } catch (t) {}
                  var r = d.call(t);
                  return s && (e ? (t[p] = i) : delete t[p]), r;
              })(t)
            : (function (t) {
                  return v.call(t);
              })(t);
    }
    var b = /^[-+]0x[0-9a-f]+$/i,
        g = /^0b[01]+$/i,
        x = /^0o[0-7]+$/i,
        y = parseInt;
    function E(t) {
        if ("number" == typeof t) return t;
        if (
            (function (t) {
                return (
                    "symbol" == typeof t ||
                    ((function (t) {
                        return null != t && "object" == typeof t;
                    })(t) &&
                        "[object Symbol]" == m(t))
                );
            })(t)
        )
            return NaN;
        if (e(t)) {
            var i = "function" == typeof t.valueOf ? t.valueOf() : t;
            t = e(i) ? i + "" : i;
        }
        if ("string" != typeof t) return 0 === t ? t : +t;
        t = a(t);
        var s = g.test(t);
        return s || x.test(t) ? y(t.slice(2), s ? 2 : 8) : b.test(t) ? NaN : +t;
    }
    var O = Math.max,
        w = Math.min;
    function S(t, i, s) {
        var r,
            o,
            n,
            a,
            c,
            h,
            u = 0,
            d = !1,
            p = !1,
            v = !0;
        if ("function" != typeof t) throw new TypeError("Expected a function");
        function f(e) {
            var i = r,
                s = o;
            return (r = o = void 0), (u = e), (a = t.apply(s, i));
        }
        function m(t) {
            return (u = t), (c = setTimeout(g, i)), d ? f(t) : a;
        }
        function b(t) {
            var e = t - h;
            return void 0 === h || e >= i || e < 0 || (p && t - u >= n);
        }
        function g() {
            var t = l();
            if (b(t)) return x(t);
            c = setTimeout(
                g,
                (function (t) {
                    var e = i - (t - h);
                    return p ? w(e, n - (t - u)) : e;
                })(t)
            );
        }
        function x(t) {
            return (c = void 0), v && r ? f(t) : ((r = o = void 0), a);
        }
        function y() {
            var t = l(),
                e = b(t);
            if (((r = arguments), (o = this), (h = t), e)) {
                if (void 0 === c) return m(h);
                if (p) return clearTimeout(c), (c = setTimeout(g, i)), f(h);
            }
            return void 0 === c && (c = setTimeout(g, i)), a;
        }
        return (
            (i = E(i) || 0),
            e(s) &&
                ((d = !!s.leading),
                (n = (p = "maxWait" in s) ? O(E(s.maxWait) || 0, i) : n),
                (v = "trailing" in s ? !!s.trailing : v)),
            (y.cancel = function () {
                void 0 !== c && clearTimeout(c),
                    (u = 0),
                    (r = h = o = c = void 0);
            }),
            (y.flush = function () {
                return void 0 === c ? a : x(l());
            }),
            y
        );
    }
    var A = function () {
        return (
            (A =
                Object.assign ||
                function (t) {
                    for (var e, i = 1, s = arguments.length; i < s; i++)
                        for (var r in (e = arguments[i]))
                            Object.prototype.hasOwnProperty.call(e, r) &&
                                (t[r] = e[r]);
                    return t;
                }),
            A.apply(this, arguments)
        );
    };
    function k(t) {
        return t && t.ownerDocument && t.ownerDocument.defaultView
            ? t.ownerDocument.defaultView
            : window;
    }
    function W(t) {
        return t && t.ownerDocument ? t.ownerDocument : document;
    }
    var M = function (t) {
        return Array.prototype.reduce.call(
            t,
            function (t, e) {
                var i = e.name.match(/data-simplebar-(.+)/);
                if (i) {
                    var s = i[1].replace(/\W+(.)/g, function (t, e) {
                        return e.toUpperCase();
                    });
                    switch (e.value) {
                        case "true":
                            t[s] = !0;
                            break;
                        case "false":
                            t[s] = !1;
                            break;
                        case void 0:
                            t[s] = !0;
                            break;
                        default:
                            t[s] = e.value;
                    }
                }
                return t;
            },
            {}
        );
    };
    function N(t, e) {
        var i;
        t && (i = t.classList).add.apply(i, e.split(" "));
    }
    function L(t, e) {
        t &&
            e.split(" ").forEach(function (e) {
                t.classList.remove(e);
            });
    }
    function z(t) {
        return ".".concat(t.split(" ").join("."));
    }
    var C = !(
            "undefined" == typeof window ||
            !window.document ||
            !window.document.createElement
        ),
        T = Object.freeze({
            __proto__: null,
            addClasses: N,
            canUseDOM: C,
            classNamesToQuery: z,
            getElementDocument: W,
            getElementWindow: k,
            getOptions: M,
            removeClasses: L,
        }),
        D = null,
        R = null;
    function V() {
        if (null === D) {
            if ("undefined" == typeof document) return (D = 0);
            var t = document.body,
                e = document.createElement("div");
            e.classList.add("simplebar-hide-scrollbar"), t.appendChild(e);
            var i = e.getBoundingClientRect().right;
            t.removeChild(e), (D = i);
        }
        return D;
    }
    C &&
        window.addEventListener("resize", function () {
            R !== window.devicePixelRatio &&
                ((R = window.devicePixelRatio), (D = null));
        });
    var H = k,
        j = W,
        B = M,
        _ = N,
        q = L,
        P = z,
        X = (function () {
            function t(i, s) {
                void 0 === s && (s = {});
                var r = this;
                if (
                    ((this.removePreventClickId = null),
                    (this.minScrollbarWidth = 20),
                    (this.stopScrollDelay = 175),
                    (this.isScrolling = !1),
                    (this.isMouseEntering = !1),
                    (this.isDragging = !1),
                    (this.scrollXTicking = !1),
                    (this.scrollYTicking = !1),
                    (this.wrapperEl = null),
                    (this.contentWrapperEl = null),
                    (this.contentEl = null),
                    (this.offsetEl = null),
                    (this.maskEl = null),
                    (this.placeholderEl = null),
                    (this.heightAutoObserverWrapperEl = null),
                    (this.heightAutoObserverEl = null),
                    (this.rtlHelpers = null),
                    (this.scrollbarWidth = 0),
                    (this.resizeObserver = null),
                    (this.mutationObserver = null),
                    (this.elStyles = null),
                    (this.isRtl = null),
                    (this.mouseX = 0),
                    (this.mouseY = 0),
                    (this.onMouseMove = function () {}),
                    (this.onWindowResize = function () {}),
                    (this.onStopScrolling = function () {}),
                    (this.onMouseEntered = function () {}),
                    (this.onScroll = function () {
                        var t = H(r.el);
                        r.scrollXTicking ||
                            (t.requestAnimationFrame(r.scrollX),
                            (r.scrollXTicking = !0)),
                            r.scrollYTicking ||
                                (t.requestAnimationFrame(r.scrollY),
                                (r.scrollYTicking = !0)),
                            r.isScrolling ||
                                ((r.isScrolling = !0),
                                _(r.el, r.classNames.scrolling)),
                            r.showScrollbar("x"),
                            r.showScrollbar("y"),
                            r.onStopScrolling();
                    }),
                    (this.scrollX = function () {
                        r.axis.x.isOverflowing && r.positionScrollbar("x"),
                            (r.scrollXTicking = !1);
                    }),
                    (this.scrollY = function () {
                        r.axis.y.isOverflowing && r.positionScrollbar("y"),
                            (r.scrollYTicking = !1);
                    }),
                    (this._onStopScrolling = function () {
                        q(r.el, r.classNames.scrolling),
                            r.options.autoHide &&
                                (r.hideScrollbar("x"), r.hideScrollbar("y")),
                            (r.isScrolling = !1);
                    }),
                    (this.onMouseEnter = function () {
                        r.isMouseEntering ||
                            (_(r.el, r.classNames.mouseEntered),
                            r.showScrollbar("x"),
                            r.showScrollbar("y"),
                            (r.isMouseEntering = !0)),
                            r.onMouseEntered();
                    }),
                    (this._onMouseEntered = function () {
                        q(r.el, r.classNames.mouseEntered),
                            r.options.autoHide &&
                                (r.hideScrollbar("x"), r.hideScrollbar("y")),
                            (r.isMouseEntering = !1);
                    }),
                    (this._onMouseMove = function (t) {
                        (r.mouseX = t.clientX),
                            (r.mouseY = t.clientY),
                            (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
                                r.onMouseMoveForAxis("x"),
                            (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
                                r.onMouseMoveForAxis("y");
                    }),
                    (this.onMouseLeave = function () {
                        r.onMouseMove.cancel(),
                            (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
                                r.onMouseLeaveForAxis("x"),
                            (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
                                r.onMouseLeaveForAxis("y"),
                            (r.mouseX = -1),
                            (r.mouseY = -1);
                    }),
                    (this._onWindowResize = function () {
                        (r.scrollbarWidth = r.getScrollbarWidth()),
                            r.hideNativeScrollbar();
                    }),
                    (this.onPointerEvent = function (t) {
                        var e, i;
                        r.axis.x.track.el &&
                            r.axis.y.track.el &&
                            r.axis.x.scrollbar.el &&
                            r.axis.y.scrollbar.el &&
                            ((r.axis.x.track.rect =
                                r.axis.x.track.el.getBoundingClientRect()),
                            (r.axis.y.track.rect =
                                r.axis.y.track.el.getBoundingClientRect()),
                            (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
                                (e = r.isWithinBounds(r.axis.x.track.rect)),
                            (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
                                (i = r.isWithinBounds(r.axis.y.track.rect)),
                            (e || i) &&
                                (t.stopPropagation(),
                                "pointerdown" === t.type &&
                                    "touch" !== t.pointerType &&
                                    (e &&
                                        ((r.axis.x.scrollbar.rect =
                                            r.axis.x.scrollbar.el.getBoundingClientRect()),
                                        r.isWithinBounds(
                                            r.axis.x.scrollbar.rect
                                        )
                                            ? r.onDragStart(t, "x")
                                            : r.onTrackClick(t, "x")),
                                    i &&
                                        ((r.axis.y.scrollbar.rect =
                                            r.axis.y.scrollbar.el.getBoundingClientRect()),
                                        r.isWithinBounds(
                                            r.axis.y.scrollbar.rect
                                        )
                                            ? r.onDragStart(t, "y")
                                            : r.onTrackClick(t, "y")))));
                    }),
                    (this.drag = function (e) {
                        var i, s, l, o, n, a, c, h, u, d, p;
                        if (r.draggedAxis && r.contentWrapperEl) {
                            var v = r.axis[r.draggedAxis].track,
                                f =
                                    null !==
                                        (s =
                                            null === (i = v.rect) ||
                                            void 0 === i
                                                ? void 0
                                                : i[
                                                      r.axis[r.draggedAxis]
                                                          .sizeAttr
                                                  ]) && void 0 !== s
                                        ? s
                                        : 0,
                                m = r.axis[r.draggedAxis].scrollbar,
                                b =
                                    null !==
                                        (o =
                                            null === (l = r.contentWrapperEl) ||
                                            void 0 === l
                                                ? void 0
                                                : l[
                                                      r.axis[r.draggedAxis]
                                                          .scrollSizeAttr
                                                  ]) && void 0 !== o
                                        ? o
                                        : 0,
                                g = parseInt(
                                    null !==
                                        (a =
                                            null === (n = r.elStyles) ||
                                            void 0 === n
                                                ? void 0
                                                : n[
                                                      r.axis[r.draggedAxis]
                                                          .sizeAttr
                                                  ]) && void 0 !== a
                                        ? a
                                        : "0px",
                                    10
                                );
                            e.preventDefault(), e.stopPropagation();
                            var x =
                                    ("y" === r.draggedAxis
                                        ? e.pageY
                                        : e.pageX) -
                                    (null !==
                                        (h =
                                            null === (c = v.rect) ||
                                            void 0 === c
                                                ? void 0
                                                : c[
                                                      r.axis[r.draggedAxis]
                                                          .offsetAttr
                                                  ]) && void 0 !== h
                                        ? h
                                        : 0) -
                                    r.axis[r.draggedAxis].dragOffset,
                                y =
                                    ((x =
                                        "x" === r.draggedAxis && r.isRtl
                                            ? (null !==
                                                  (d =
                                                      null === (u = v.rect) ||
                                                      void 0 === u
                                                          ? void 0
                                                          : u[
                                                                r.axis[
                                                                    r
                                                                        .draggedAxis
                                                                ].sizeAttr
                                                            ]) && void 0 !== d
                                                  ? d
                                                  : 0) -
                                              m.size -
                                              x
                                            : x) /
                                        (f - m.size)) *
                                    (b - g);
                            "x" === r.draggedAxis &&
                                r.isRtl &&
                                (y = (
                                    null === (p = t.getRtlHelpers()) ||
                                    void 0 === p
                                        ? void 0
                                        : p.isScrollingToNegative
                                )
                                    ? -y
                                    : y),
                                (r.contentWrapperEl[
                                    r.axis[r.draggedAxis].scrollOffsetAttr
                                ] = y);
                        }
                    }),
                    (this.onEndDrag = function (t) {
                        r.isDragging = !1;
                        var e = j(r.el),
                            i = H(r.el);
                        t.preventDefault(),
                            t.stopPropagation(),
                            q(r.el, r.classNames.dragging),
                            r.onStopScrolling(),
                            e.removeEventListener("mousemove", r.drag, !0),
                            e.removeEventListener("mouseup", r.onEndDrag, !0),
                            (r.removePreventClickId = i.setTimeout(function () {
                                e.removeEventListener(
                                    "click",
                                    r.preventClick,
                                    !0
                                ),
                                    e.removeEventListener(
                                        "dblclick",
                                        r.preventClick,
                                        !0
                                    ),
                                    (r.removePreventClickId = null);
                            }));
                    }),
                    (this.preventClick = function (t) {
                        t.preventDefault(), t.stopPropagation();
                    }),
                    (this.el = i),
                    (this.options = A(A({}, t.defaultOptions), s)),
                    (this.classNames = A(
                        A({}, t.defaultOptions.classNames),
                        s.classNames
                    )),
                    (this.axis = {
                        x: {
                            scrollOffsetAttr: "scrollLeft",
                            sizeAttr: "width",
                            scrollSizeAttr: "scrollWidth",
                            offsetSizeAttr: "offsetWidth",
                            offsetAttr: "left",
                            overflowAttr: "overflowX",
                            dragOffset: 0,
                            isOverflowing: !0,
                            forceVisible: !1,
                            track: {
                                size: null,
                                el: null,
                                rect: null,
                                isVisible: !1,
                            },
                            scrollbar: {
                                size: null,
                                el: null,
                                rect: null,
                                isVisible: !1,
                            },
                        },
                        y: {
                            scrollOffsetAttr: "scrollTop",
                            sizeAttr: "height",
                            scrollSizeAttr: "scrollHeight",
                            offsetSizeAttr: "offsetHeight",
                            offsetAttr: "top",
                            overflowAttr: "overflowY",
                            dragOffset: 0,
                            isOverflowing: !0,
                            forceVisible: !1,
                            track: {
                                size: null,
                                el: null,
                                rect: null,
                                isVisible: !1,
                            },
                            scrollbar: {
                                size: null,
                                el: null,
                                rect: null,
                                isVisible: !1,
                            },
                        },
                    }),
                    "object" != typeof this.el || !this.el.nodeName)
                )
                    throw new Error(
                        "Argument passed to SimpleBar must be an HTML element instead of ".concat(
                            this.el
                        )
                    );
                (this.onMouseMove = (function (t, i, s) {
                    var r = !0,
                        l = !0;
                    if ("function" != typeof t)
                        throw new TypeError("Expected a function");
                    return (
                        e(s) &&
                            ((r = "leading" in s ? !!s.leading : r),
                            (l = "trailing" in s ? !!s.trailing : l)),
                        S(t, i, { leading: r, maxWait: i, trailing: l })
                    );
                })(this._onMouseMove, 64)),
                    (this.onWindowResize = S(this._onWindowResize, 64, {
                        leading: !0,
                    })),
                    (this.onStopScrolling = S(
                        this._onStopScrolling,
                        this.stopScrollDelay
                    )),
                    (this.onMouseEntered = S(
                        this._onMouseEntered,
                        this.stopScrollDelay
                    )),
                    this.init();
            }
            return (
                (t.getRtlHelpers = function () {
                    if (t.rtlHelpers) return t.rtlHelpers;
                    var e = document.createElement("div");
                    e.innerHTML =
                        '<div class="simplebar-dummy-scrollbar-size"><div></div></div>';
                    var i = e.firstElementChild,
                        s = null == i ? void 0 : i.firstElementChild;
                    if (!s) return null;
                    document.body.appendChild(i), (i.scrollLeft = 0);
                    var r = t.getOffset(i),
                        l = t.getOffset(s);
                    i.scrollLeft = -999;
                    var o = t.getOffset(s);
                    return (
                        document.body.removeChild(i),
                        (t.rtlHelpers = {
                            isScrollOriginAtZero: r.left !== l.left,
                            isScrollingToNegative: l.left !== o.left,
                        }),
                        t.rtlHelpers
                    );
                }),
                (t.prototype.getScrollbarWidth = function () {
                    try {
                        return (this.contentWrapperEl &&
                            "none" ===
                                getComputedStyle(
                                    this.contentWrapperEl,
                                    "::-webkit-scrollbar"
                                ).display) ||
                            "scrollbarWidth" in
                                document.documentElement.style ||
                            "-ms-overflow-style" in
                                document.documentElement.style
                            ? 0
                            : V();
                    } catch (t) {
                        return V();
                    }
                }),
                (t.getOffset = function (t) {
                    var e = t.getBoundingClientRect(),
                        i = j(t),
                        s = H(t);
                    return {
                        top:
                            e.top +
                            (s.pageYOffset || i.documentElement.scrollTop),
                        left:
                            e.left +
                            (s.pageXOffset || i.documentElement.scrollLeft),
                    };
                }),
                (t.prototype.init = function () {
                    C &&
                        (this.initDOM(),
                        (this.rtlHelpers = t.getRtlHelpers()),
                        (this.scrollbarWidth = this.getScrollbarWidth()),
                        this.recalculate(),
                        this.initListeners());
                }),
                (t.prototype.initDOM = function () {
                    var t, e;
                    (this.wrapperEl = this.el.querySelector(
                        P(this.classNames.wrapper)
                    )),
                        (this.contentWrapperEl =
                            this.options.scrollableNode ||
                            this.el.querySelector(
                                P(this.classNames.contentWrapper)
                            )),
                        (this.contentEl =
                            this.options.contentNode ||
                            this.el.querySelector(
                                P(this.classNames.contentEl)
                            )),
                        (this.offsetEl = this.el.querySelector(
                            P(this.classNames.offset)
                        )),
                        (this.maskEl = this.el.querySelector(
                            P(this.classNames.mask)
                        )),
                        (this.placeholderEl = this.findChild(
                            this.wrapperEl,
                            P(this.classNames.placeholder)
                        )),
                        (this.heightAutoObserverWrapperEl =
                            this.el.querySelector(
                                P(this.classNames.heightAutoObserverWrapperEl)
                            )),
                        (this.heightAutoObserverEl = this.el.querySelector(
                            P(this.classNames.heightAutoObserverEl)
                        )),
                        (this.axis.x.track.el = this.findChild(
                            this.el,
                            ""
                                .concat(P(this.classNames.track))
                                .concat(P(this.classNames.horizontal))
                        )),
                        (this.axis.y.track.el = this.findChild(
                            this.el,
                            ""
                                .concat(P(this.classNames.track))
                                .concat(P(this.classNames.vertical))
                        )),
                        (this.axis.x.scrollbar.el =
                            (null === (t = this.axis.x.track.el) || void 0 === t
                                ? void 0
                                : t.querySelector(
                                      P(this.classNames.scrollbar)
                                  )) || null),
                        (this.axis.y.scrollbar.el =
                            (null === (e = this.axis.y.track.el) || void 0 === e
                                ? void 0
                                : e.querySelector(
                                      P(this.classNames.scrollbar)
                                  )) || null),
                        this.options.autoHide ||
                            (_(
                                this.axis.x.scrollbar.el,
                                this.classNames.visible
                            ),
                            _(
                                this.axis.y.scrollbar.el,
                                this.classNames.visible
                            ));
                }),
                (t.prototype.initListeners = function () {
                    var t,
                        e = this,
                        i = H(this.el);
                    if (
                        (this.el.addEventListener(
                            "mouseenter",
                            this.onMouseEnter
                        ),
                        this.el.addEventListener(
                            "pointerdown",
                            this.onPointerEvent,
                            !0
                        ),
                        this.el.addEventListener("mousemove", this.onMouseMove),
                        this.el.addEventListener(
                            "mouseleave",
                            this.onMouseLeave
                        ),
                        null === (t = this.contentWrapperEl) ||
                            void 0 === t ||
                            t.addEventListener("scroll", this.onScroll),
                        i.addEventListener("resize", this.onWindowResize),
                        this.contentEl)
                    ) {
                        if (window.ResizeObserver) {
                            var s = !1,
                                r = i.ResizeObserver || ResizeObserver;
                            (this.resizeObserver = new r(function () {
                                s &&
                                    i.requestAnimationFrame(function () {
                                        e.recalculate();
                                    });
                            })),
                                this.resizeObserver.observe(this.el),
                                this.resizeObserver.observe(this.contentEl),
                                i.requestAnimationFrame(function () {
                                    s = !0;
                                });
                        }
                        (this.mutationObserver = new i.MutationObserver(
                            function () {
                                i.requestAnimationFrame(function () {
                                    e.recalculate();
                                });
                            }
                        )),
                            this.mutationObserver.observe(this.contentEl, {
                                childList: !0,
                                subtree: !0,
                                characterData: !0,
                            });
                    }
                }),
                (t.prototype.recalculate = function () {
                    if (
                        this.heightAutoObserverEl &&
                        this.contentEl &&
                        this.contentWrapperEl &&
                        this.wrapperEl &&
                        this.placeholderEl
                    ) {
                        var t = H(this.el);
                        (this.elStyles = t.getComputedStyle(this.el)),
                            (this.isRtl = "rtl" === this.elStyles.direction);
                        var e = this.contentEl.offsetWidth,
                            i = this.heightAutoObserverEl.offsetHeight <= 1,
                            s =
                                this.heightAutoObserverEl.offsetWidth <= 1 ||
                                e > 0,
                            r = this.contentWrapperEl.offsetWidth,
                            l = this.elStyles.overflowX,
                            o = this.elStyles.overflowY;
                        (this.contentEl.style.padding = ""
                            .concat(this.elStyles.paddingTop, " ")
                            .concat(this.elStyles.paddingRight, " ")
                            .concat(this.elStyles.paddingBottom, " ")
                            .concat(this.elStyles.paddingLeft)),
                            (this.wrapperEl.style.margin = "-"
                                .concat(this.elStyles.paddingTop, " -")
                                .concat(this.elStyles.paddingRight, " -")
                                .concat(this.elStyles.paddingBottom, " -")
                                .concat(this.elStyles.paddingLeft));
                        var n = this.contentEl.scrollHeight,
                            a = this.contentEl.scrollWidth;
                        (this.contentWrapperEl.style.height = i
                            ? "auto"
                            : "100%"),
                            (this.placeholderEl.style.width = s
                                ? "".concat(e || a, "px")
                                : "auto"),
                            (this.placeholderEl.style.height = "".concat(
                                n,
                                "px"
                            ));
                        var c = this.contentWrapperEl.offsetHeight;
                        (this.axis.x.isOverflowing = 0 !== e && a > e),
                            (this.axis.y.isOverflowing = n > c),
                            (this.axis.x.isOverflowing =
                                "hidden" !== l && this.axis.x.isOverflowing),
                            (this.axis.y.isOverflowing =
                                "hidden" !== o && this.axis.y.isOverflowing),
                            (this.axis.x.forceVisible =
                                "x" === this.options.forceVisible ||
                                !0 === this.options.forceVisible),
                            (this.axis.y.forceVisible =
                                "y" === this.options.forceVisible ||
                                !0 === this.options.forceVisible),
                            this.hideNativeScrollbar();
                        var h = this.axis.x.isOverflowing
                                ? this.scrollbarWidth
                                : 0,
                            u = this.axis.y.isOverflowing
                                ? this.scrollbarWidth
                                : 0;
                        (this.axis.x.isOverflowing =
                            this.axis.x.isOverflowing && a > r - u),
                            (this.axis.y.isOverflowing =
                                this.axis.y.isOverflowing && n > c - h),
                            (this.axis.x.scrollbar.size =
                                this.getScrollbarSize("x")),
                            (this.axis.y.scrollbar.size =
                                this.getScrollbarSize("y")),
                            this.axis.x.scrollbar.el &&
                                (this.axis.x.scrollbar.el.style.width =
                                    "".concat(
                                        this.axis.x.scrollbar.size,
                                        "px"
                                    )),
                            this.axis.y.scrollbar.el &&
                                (this.axis.y.scrollbar.el.style.height =
                                    "".concat(
                                        this.axis.y.scrollbar.size,
                                        "px"
                                    )),
                            this.positionScrollbar("x"),
                            this.positionScrollbar("y"),
                            this.toggleTrackVisibility("x"),
                            this.toggleTrackVisibility("y");
                    }
                }),
                (t.prototype.getScrollbarSize = function (t) {
                    var e, i;
                    if (
                        (void 0 === t && (t = "y"),
                        !this.axis[t].isOverflowing || !this.contentEl)
                    )
                        return 0;
                    var s,
                        r = this.contentEl[this.axis[t].scrollSizeAttr],
                        l =
                            null !==
                                (i =
                                    null === (e = this.axis[t].track.el) ||
                                    void 0 === e
                                        ? void 0
                                        : e[this.axis[t].offsetSizeAttr]) &&
                            void 0 !== i
                                ? i
                                : 0,
                        o = l / r;
                    return (
                        (s = Math.max(
                            ~~(o * l),
                            this.options.scrollbarMinSize
                        )),
                        this.options.scrollbarMaxSize &&
                            (s = Math.min(s, this.options.scrollbarMaxSize)),
                        s
                    );
                }),
                (t.prototype.positionScrollbar = function (e) {
                    var i, s, r;
                    void 0 === e && (e = "y");
                    var l = this.axis[e].scrollbar;
                    if (
                        this.axis[e].isOverflowing &&
                        this.contentWrapperEl &&
                        l.el &&
                        this.elStyles
                    ) {
                        var o =
                                this.contentWrapperEl[
                                    this.axis[e].scrollSizeAttr
                                ],
                            n =
                                (null === (i = this.axis[e].track.el) ||
                                void 0 === i
                                    ? void 0
                                    : i[this.axis[e].offsetSizeAttr]) || 0,
                            a = parseInt(
                                this.elStyles[this.axis[e].sizeAttr],
                                10
                            ),
                            c =
                                this.contentWrapperEl[
                                    this.axis[e].scrollOffsetAttr
                                ];
                        (c =
                            "x" === e &&
                            this.isRtl &&
                            (null === (s = t.getRtlHelpers()) || void 0 === s
                                ? void 0
                                : s.isScrollOriginAtZero)
                                ? -c
                                : c),
                            "x" === e &&
                                this.isRtl &&
                                (c = (
                                    null === (r = t.getRtlHelpers()) ||
                                    void 0 === r
                                        ? void 0
                                        : r.isScrollingToNegative
                                )
                                    ? c
                                    : -c);
                        var h = c / (o - a),
                            u = ~~((n - l.size) * h);
                        (u = "x" === e && this.isRtl ? -u + (n - l.size) : u),
                            (l.el.style.transform =
                                "x" === e
                                    ? "translate3d(".concat(u, "px, 0, 0)")
                                    : "translate3d(0, ".concat(u, "px, 0)"));
                    }
                }),
                (t.prototype.toggleTrackVisibility = function (t) {
                    void 0 === t && (t = "y");
                    var e = this.axis[t].track.el,
                        i = this.axis[t].scrollbar.el;
                    e &&
                        i &&
                        this.contentWrapperEl &&
                        (this.axis[t].isOverflowing || this.axis[t].forceVisible
                            ? ((e.style.visibility = "visible"),
                              (this.contentWrapperEl.style[
                                  this.axis[t].overflowAttr
                              ] = "scroll"),
                              this.el.classList.add(
                                  ""
                                      .concat(this.classNames.scrollable, "-")
                                      .concat(t)
                              ))
                            : ((e.style.visibility = "hidden"),
                              (this.contentWrapperEl.style[
                                  this.axis[t].overflowAttr
                              ] = "hidden"),
                              this.el.classList.remove(
                                  ""
                                      .concat(this.classNames.scrollable, "-")
                                      .concat(t)
                              )),
                        this.axis[t].isOverflowing
                            ? (i.style.display = "block")
                            : (i.style.display = "none"));
                }),
                (t.prototype.showScrollbar = function (t) {
                    void 0 === t && (t = "y"),
                        this.axis[t].isOverflowing &&
                            !this.axis[t].scrollbar.isVisible &&
                            (_(
                                this.axis[t].scrollbar.el,
                                this.classNames.visible
                            ),
                            (this.axis[t].scrollbar.isVisible = !0));
                }),
                (t.prototype.hideScrollbar = function (t) {
                    void 0 === t && (t = "y"),
                        this.isDragging ||
                            (this.axis[t].isOverflowing &&
                                this.axis[t].scrollbar.isVisible &&
                                (q(
                                    this.axis[t].scrollbar.el,
                                    this.classNames.visible
                                ),
                                (this.axis[t].scrollbar.isVisible = !1)));
                }),
                (t.prototype.hideNativeScrollbar = function () {
                    this.offsetEl &&
                        ((this.offsetEl.style[this.isRtl ? "left" : "right"] =
                            this.axis.y.isOverflowing ||
                            this.axis.y.forceVisible
                                ? "-".concat(this.scrollbarWidth, "px")
                                : "0px"),
                        (this.offsetEl.style.bottom =
                            this.axis.x.isOverflowing ||
                            this.axis.x.forceVisible
                                ? "-".concat(this.scrollbarWidth, "px")
                                : "0px"));
                }),
                (t.prototype.onMouseMoveForAxis = function (t) {
                    void 0 === t && (t = "y");
                    var e = this.axis[t];
                    e.track.el &&
                        e.scrollbar.el &&
                        ((e.track.rect = e.track.el.getBoundingClientRect()),
                        (e.scrollbar.rect =
                            e.scrollbar.el.getBoundingClientRect()),
                        this.isWithinBounds(e.track.rect)
                            ? (this.showScrollbar(t),
                              _(e.track.el, this.classNames.hover),
                              this.isWithinBounds(e.scrollbar.rect)
                                  ? _(e.scrollbar.el, this.classNames.hover)
                                  : q(e.scrollbar.el, this.classNames.hover))
                            : (q(e.track.el, this.classNames.hover),
                              this.options.autoHide && this.hideScrollbar(t)));
                }),
                (t.prototype.onMouseLeaveForAxis = function (t) {
                    void 0 === t && (t = "y"),
                        q(this.axis[t].track.el, this.classNames.hover),
                        q(this.axis[t].scrollbar.el, this.classNames.hover),
                        this.options.autoHide && this.hideScrollbar(t);
                }),
                (t.prototype.onDragStart = function (t, e) {
                    var i;
                    void 0 === e && (e = "y"), (this.isDragging = !0);
                    var s = j(this.el),
                        r = H(this.el),
                        l = this.axis[e].scrollbar,
                        o = "y" === e ? t.pageY : t.pageX;
                    (this.axis[e].dragOffset =
                        o -
                        ((null === (i = l.rect) || void 0 === i
                            ? void 0
                            : i[this.axis[e].offsetAttr]) || 0)),
                        (this.draggedAxis = e),
                        _(this.el, this.classNames.dragging),
                        s.addEventListener("mousemove", this.drag, !0),
                        s.addEventListener("mouseup", this.onEndDrag, !0),
                        null === this.removePreventClickId
                            ? (s.addEventListener(
                                  "click",
                                  this.preventClick,
                                  !0
                              ),
                              s.addEventListener(
                                  "dblclick",
                                  this.preventClick,
                                  !0
                              ))
                            : (r.clearTimeout(this.removePreventClickId),
                              (this.removePreventClickId = null));
                }),
                (t.prototype.onTrackClick = function (t, e) {
                    var i,
                        s,
                        r,
                        l,
                        o = this;
                    void 0 === e && (e = "y");
                    var n = this.axis[e];
                    if (
                        this.options.clickOnTrack &&
                        n.scrollbar.el &&
                        this.contentWrapperEl
                    ) {
                        t.preventDefault();
                        var a = H(this.el);
                        this.axis[e].scrollbar.rect =
                            n.scrollbar.el.getBoundingClientRect();
                        var c =
                                null !==
                                    (s =
                                        null ===
                                            (i = this.axis[e].scrollbar.rect) ||
                                        void 0 === i
                                            ? void 0
                                            : i[this.axis[e].offsetAttr]) &&
                                void 0 !== s
                                    ? s
                                    : 0,
                            h = parseInt(
                                null !==
                                    (l =
                                        null === (r = this.elStyles) ||
                                        void 0 === r
                                            ? void 0
                                            : r[this.axis[e].sizeAttr]) &&
                                    void 0 !== l
                                    ? l
                                    : "0px",
                                10
                            ),
                            u =
                                this.contentWrapperEl[
                                    this.axis[e].scrollOffsetAttr
                                ],
                            d =
                                ("y" === e
                                    ? this.mouseY - c
                                    : this.mouseX - c) < 0
                                    ? -1
                                    : 1,
                            p = -1 === d ? u - h : u + h,
                            v = function () {
                                o.contentWrapperEl &&
                                    (-1 === d
                                        ? u > p &&
                                          ((u -= 40),
                                          (o.contentWrapperEl[
                                              o.axis[e].scrollOffsetAttr
                                          ] = u),
                                          a.requestAnimationFrame(v))
                                        : u < p &&
                                          ((u += 40),
                                          (o.contentWrapperEl[
                                              o.axis[e].scrollOffsetAttr
                                          ] = u),
                                          a.requestAnimationFrame(v)));
                            };
                        v();
                    }
                }),
                (t.prototype.getContentElement = function () {
                    return this.contentEl;
                }),
                (t.prototype.getScrollElement = function () {
                    return this.contentWrapperEl;
                }),
                (t.prototype.removeListeners = function () {
                    var t = H(this.el);
                    this.el.removeEventListener(
                        "mouseenter",
                        this.onMouseEnter
                    ),
                        this.el.removeEventListener(
                            "pointerdown",
                            this.onPointerEvent,
                            !0
                        ),
                        this.el.removeEventListener(
                            "mousemove",
                            this.onMouseMove
                        ),
                        this.el.removeEventListener(
                            "mouseleave",
                            this.onMouseLeave
                        ),
                        this.contentWrapperEl &&
                            this.contentWrapperEl.removeEventListener(
                                "scroll",
                                this.onScroll
                            ),
                        t.removeEventListener("resize", this.onWindowResize),
                        this.mutationObserver &&
                            this.mutationObserver.disconnect(),
                        this.resizeObserver && this.resizeObserver.disconnect(),
                        this.onMouseMove.cancel(),
                        this.onWindowResize.cancel(),
                        this.onStopScrolling.cancel(),
                        this.onMouseEntered.cancel();
                }),
                (t.prototype.unMount = function () {
                    this.removeListeners();
                }),
                (t.prototype.isWithinBounds = function (t) {
                    return (
                        this.mouseX >= t.left &&
                        this.mouseX <= t.left + t.width &&
                        this.mouseY >= t.top &&
                        this.mouseY <= t.top + t.height
                    );
                }),
                (t.prototype.findChild = function (t, e) {
                    var i =
                        t.matches ||
                        t.webkitMatchesSelector ||
                        t.mozMatchesSelector ||
                        t.msMatchesSelector;
                    return Array.prototype.filter.call(
                        t.children,
                        function (t) {
                            return i.call(t, e);
                        }
                    )[0];
                }),
                (t.rtlHelpers = null),
                (t.defaultOptions = {
                    forceVisible: !1,
                    clickOnTrack: !0,
                    scrollbarMinSize: 25,
                    scrollbarMaxSize: 0,
                    ariaLabel: "scrollable content",
                    tabIndex: 0,
                    classNames: {
                        contentEl: "simplebar-content",
                        contentWrapper: "simplebar-content-wrapper",
                        offset: "simplebar-offset",
                        mask: "simplebar-mask",
                        wrapper: "simplebar-wrapper",
                        placeholder: "simplebar-placeholder",
                        scrollbar: "simplebar-scrollbar",
                        track: "simplebar-track",
                        heightAutoObserverWrapperEl:
                            "simplebar-height-auto-observer-wrapper",
                        heightAutoObserverEl: "simplebar-height-auto-observer",
                        visible: "simplebar-visible",
                        horizontal: "simplebar-horizontal",
                        vertical: "simplebar-vertical",
                        hover: "simplebar-hover",
                        dragging: "simplebar-dragging",
                        scrolling: "simplebar-scrolling",
                        scrollable: "simplebar-scrollable",
                        mouseEntered: "simplebar-mouse-entered",
                    },
                    scrollableNode: null,
                    contentNode: null,
                    autoHide: !0,
                }),
                (t.getOptions = B),
                (t.helpers = T),
                t
            );
        })(),
        Y = X.helpers,
        F = Y.getOptions,
        I = Y.addClasses,
        U = Y.canUseDOM,
        $ = (function (e) {
            function i() {
                for (var t = [], s = 0; s < arguments.length; s++)
                    t[s] = arguments[s];
                var r = e.apply(this, t) || this;
                return i.instances.set(t[0], r), r;
            }
            return (
                (function (e, i) {
                    if ("function" != typeof i && null !== i)
                        throw new TypeError(
                            "Class extends value " +
                                String(i) +
                                " is not a constructor or null"
                        );
                    function s() {
                        this.constructor = e;
                    }
                    t(e, i),
                        (e.prototype =
                            null === i
                                ? Object.create(i)
                                : ((s.prototype = i.prototype), new s()));
                })(i, e),
                (i.initDOMLoadedElements = function () {
                    document.removeEventListener(
                        "DOMContentLoaded",
                        this.initDOMLoadedElements
                    ),
                        window.removeEventListener(
                            "load",
                            this.initDOMLoadedElements
                        ),
                        Array.prototype.forEach.call(
                            document.querySelectorAll("[data-simplebar]"),
                            function (t) {
                                "init" === t.getAttribute("data-simplebar") ||
                                    i.instances.has(t) ||
                                    new i(t, F(t.attributes));
                            }
                        );
                }),
                (i.removeObserver = function () {
                    var t;
                    null === (t = i.globalObserver) ||
                        void 0 === t ||
                        t.disconnect();
                }),
                (i.prototype.initDOM = function () {
                    var t,
                        e,
                        i,
                        s = this;
                    if (
                        !Array.prototype.filter.call(
                            this.el.children,
                            function (t) {
                                return t.classList.contains(
                                    s.classNames.wrapper
                                );
                            }
                        ).length
                    ) {
                        for (
                            this.wrapperEl = document.createElement("div"),
                                this.contentWrapperEl =
                                    document.createElement("div"),
                                this.offsetEl = document.createElement("div"),
                                this.maskEl = document.createElement("div"),
                                this.contentEl = document.createElement("div"),
                                this.placeholderEl =
                                    document.createElement("div"),
                                this.heightAutoObserverWrapperEl =
                                    document.createElement("div"),
                                this.heightAutoObserverEl =
                                    document.createElement("div"),
                                I(this.wrapperEl, this.classNames.wrapper),
                                I(
                                    this.contentWrapperEl,
                                    this.classNames.contentWrapper
                                ),
                                I(this.offsetEl, this.classNames.offset),
                                I(this.maskEl, this.classNames.mask),
                                I(this.contentEl, this.classNames.contentEl),
                                I(
                                    this.placeholderEl,
                                    this.classNames.placeholder
                                ),
                                I(
                                    this.heightAutoObserverWrapperEl,
                                    this.classNames.heightAutoObserverWrapperEl
                                ),
                                I(
                                    this.heightAutoObserverEl,
                                    this.classNames.heightAutoObserverEl
                                );
                            this.el.firstChild;

                        )
                            this.contentEl.appendChild(this.el.firstChild);
                        this.contentWrapperEl.appendChild(this.contentEl),
                            this.offsetEl.appendChild(this.contentWrapperEl),
                            this.maskEl.appendChild(this.offsetEl),
                            this.heightAutoObserverWrapperEl.appendChild(
                                this.heightAutoObserverEl
                            ),
                            this.wrapperEl.appendChild(
                                this.heightAutoObserverWrapperEl
                            ),
                            this.wrapperEl.appendChild(this.maskEl),
                            this.wrapperEl.appendChild(this.placeholderEl),
                            this.el.appendChild(this.wrapperEl),
                            null === (t = this.contentWrapperEl) ||
                                void 0 === t ||
                                t.setAttribute(
                                    "tabindex",
                                    this.options.tabIndex.toString()
                                ),
                            null === (e = this.contentWrapperEl) ||
                                void 0 === e ||
                                e.setAttribute("role", "region"),
                            null === (i = this.contentWrapperEl) ||
                                void 0 === i ||
                                i.setAttribute(
                                    "aria-label",
                                    this.options.ariaLabel
                                );
                    }
                    if (!this.axis.x.track.el || !this.axis.y.track.el) {
                        var r = document.createElement("div"),
                            l = document.createElement("div");
                        I(r, this.classNames.track),
                            I(l, this.classNames.scrollbar),
                            r.appendChild(l),
                            (this.axis.x.track.el = r.cloneNode(!0)),
                            I(this.axis.x.track.el, this.classNames.horizontal),
                            (this.axis.y.track.el = r.cloneNode(!0)),
                            I(this.axis.y.track.el, this.classNames.vertical),
                            this.el.appendChild(this.axis.x.track.el),
                            this.el.appendChild(this.axis.y.track.el);
                    }
                    X.prototype.initDOM.call(this),
                        this.el.setAttribute("data-simplebar", "init");
                }),
                (i.prototype.unMount = function () {
                    X.prototype.unMount.call(this), i.instances.delete(this.el);
                }),
                (i.initHtmlApi = function () {
                    (this.initDOMLoadedElements =
                        this.initDOMLoadedElements.bind(this)),
                        "undefined" != typeof MutationObserver &&
                            ((this.globalObserver = new MutationObserver(
                                i.handleMutations
                            )),
                            this.globalObserver.observe(document, {
                                childList: !0,
                                subtree: !0,
                            })),
                        "complete" === document.readyState ||
                        ("loading" !== document.readyState &&
                            !document.documentElement.doScroll)
                            ? window.setTimeout(this.initDOMLoadedElements)
                            : (document.addEventListener(
                                  "DOMContentLoaded",
                                  this.initDOMLoadedElements
                              ),
                              window.addEventListener(
                                  "load",
                                  this.initDOMLoadedElements
                              ));
                }),
                (i.handleMutations = function (t) {
                    t.forEach(function (t) {
                        t.addedNodes.forEach(function (t) {
                            1 === t.nodeType &&
                                (t.hasAttribute("data-simplebar")
                                    ? !i.instances.has(t) &&
                                      document.documentElement.contains(t) &&
                                      new i(t, F(t.attributes))
                                    : t
                                          .querySelectorAll("[data-simplebar]")
                                          .forEach(function (t) {
                                              "init" !==
                                                  t.getAttribute(
                                                      "data-simplebar"
                                                  ) &&
                                                  !i.instances.has(t) &&
                                                  document.documentElement.contains(
                                                      t
                                                  ) &&
                                                  new i(t, F(t.attributes));
                                          }));
                        }),
                            t.removedNodes.forEach(function (t) {
                                var e;
                                1 === t.nodeType &&
                                    ("init" === t.getAttribute("data-simplebar")
                                        ? !document.documentElement.contains(
                                              t
                                          ) &&
                                          (null === (e = i.instances.get(t)) ||
                                              void 0 === e ||
                                              e.unMount())
                                        : Array.prototype.forEach.call(
                                              t.querySelectorAll(
                                                  '[data-simplebar="init"]'
                                              ),
                                              function (t) {
                                                  var e;
                                                  !document.documentElement.contains(
                                                      t
                                                  ) &&
                                                      (null ===
                                                          (e =
                                                              i.instances.get(
                                                                  t
                                                              )) ||
                                                          void 0 === e ||
                                                          e.unMount());
                                              }
                                          ));
                            });
                    });
                }),
                (i.instances = new WeakMap()),
                i
            );
        })(X);
    return U && $.initHtmlApi(), $;
})();


/**
=========================================================================
=========================================================================
Template Name: Datta Able - Tailwind Admin Template
Author: CodedThemes
Support: https://codedthemes.support-hub.io/
File: themes.js
=========================================================================
=========================================================================
*/

'use strict';

var rtl_flag = false;
var dark_flag = false;

document.addEventListener('DOMContentLoaded', function () {
  if (typeof Storage !== 'undefined') {
    layout_change(localStorage.getItem('theme'));
  }
});
// Function to change layout dark/light settings
function layout_change_default() {
  // Determine initial layout based on user's color scheme preference
  let dark_layout = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  // Apply the determined layout
  layout_change(dark_layout);

  // Set the active state for the default layout button
  const btn_control = document.querySelector('.theme-layout .btn[data-value="default"]');
  if (btn_control) {
    btn_control.classList.add('active');
  }

  // Listen for changes in the user's color scheme preference and adjust layout accordingly
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    dark_layout = event.matches ? 'dark' : 'light';
    layout_change(dark_layout);
  });
}

// This event listener executes when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Check if elements with class 'preset-color' exist (switch preset-1 to preset-10 colors and change main colors according to preset-* value)
  var if_exist = document.querySelectorAll('.preset-color');
  if (if_exist) {
    // Iterate over preset color links and add click event listeners
    var preset_color = document.querySelectorAll('.preset-color > a');
    for (var h = 0; h < preset_color.length; h++) {
      var c = preset_color[h];
      c.addEventListener('click', function (event) {
        var targetElement = event.target;
        if (targetElement.tagName == 'I') {
          targetElement = targetElement.parentNode;
        }
        // Extract the preset value and call preset_change function
        var presetValue = targetElement.getAttribute('data-value');
        preset_change(presetValue);
      });
    }

    var layout_btn = document.querySelectorAll('.theme-layout .btn');
    for (var t = 0; t < layout_btn.length; t++) {
      if (layout_btn[t]) {
        layout_btn[t].addEventListener('click', function (event) {
          event.stopPropagation();
          var targetElement = event.target;

          if (targetElement.tagName == 'SPAN') {
            targetElement = targetElement.parentNode;
          }
          if (targetElement.getAttribute('data-value') == 'true') {
            localStorage.setItem('theme', 'light');
            document.documentElement.setAttribute('data-theme', 'light'); // Update theme immediately
          } else {
            localStorage.setItem('theme', 'dark');
            document.documentElement.setAttribute('data-theme', 'dark'); // Update theme immediately
          }
        });
      }
    }

  }

  // Initialize SimpleBar on elements with class 'pct-body' for custom scrollbar
  if (document.querySelector('.pct-body')) {
    new SimpleBar(document.querySelector('.pct-body'));
  }

  // Reset layout on button click
  var layout_reset = document.querySelector('#layoutreset');
  if (layout_reset) {
    layout_reset.addEventListener('click', function (e) {
      localStorage.clear();
      location.reload();
      localStorage.setItem('layout', 'vertical');
    });
  }

  // ========================================
  
  var if_exist = document.querySelectorAll('.header-color');
  if (if_exist) {
    var preset_color = document.querySelectorAll('.header-color > a');
    for (var h = 0; h < preset_color.length; h++) {
      var c = preset_color[h];
      c.addEventListener('click', function (event) {
        var targetElement = event.target;
        if (targetElement.tagName == 'SPAN' || targetElement.tagName == 'I') {
          targetElement = targetElement.parentNode;
        }
        var temp = targetElement.getAttribute('data-value');
        header_change(temp);
      });
    }
  }

  var if_exist = document.querySelectorAll('.navbar-color');
  if (if_exist) {
    var preset_color = document.querySelectorAll('.navbar-color > a');
    for (var h = 0; h < preset_color.length; h++) {
      var c = preset_color[h];
      c.addEventListener('click', function (event) {
        var targetElement = event.target;
        if (targetElement.tagName == 'SPAN' || targetElement.tagName == 'I') {
          targetElement = targetElement.parentNode;
        }
        var temp = targetElement.getAttribute('data-value');
        navbar_change(temp);
      });
    }
  }

  var if_exist = document.querySelectorAll('.logo-color');
  if (if_exist) {
    var preset_color = document.querySelectorAll('.logo-color > a');
    for (var h = 0; h < preset_color.length; h++) {
      var c = preset_color[h];
      c.addEventListener('click', function (event) {
        var targetElement = event.target;
        if (targetElement.tagName == 'SPAN' || targetElement.tagName == 'I') {
          targetElement = targetElement.parentNode;
        }
        var temp = targetElement.getAttribute('data-value');
        logo_change(temp);
      });
    }
  }

  var if_exist = document.querySelectorAll('.caption-color');
  if (if_exist) {
    var preset_color = document.querySelectorAll('.caption-color > a');
    for (var h = 0; h < preset_color.length; h++) {
      var c = preset_color[h];
      c.addEventListener('click', function (event) {
        var targetElement = event.target;
        if (targetElement.tagName == 'SPAN' || targetElement.tagName == 'I') {
          targetElement = targetElement.parentNode;
        }
        var temp = targetElement.getAttribute('data-value');
        caption_change(temp);
      });
    }
  }

  var if_exist = document.querySelectorAll('.navbar-img');
  if (if_exist) {
    var preset_color = document.querySelectorAll('.navbar-img > a');
    for (var h = 0; h < preset_color.length; h++) {
      var c = preset_color[h];
      c.addEventListener('click', function (event) {
        var targetElement = event.target;
        if (targetElement.tagName == 'SPAN' || targetElement.tagName == 'I') {
          targetElement = targetElement.parentNode;
        }
        var temp = targetElement.getAttribute('data-value');
        nav_image_change(temp);
      });
    }
  }

  var if_exist = document.querySelectorAll('.drp-menu-icon');
  if (if_exist) {
    var preset_color = document.querySelectorAll('.drp-menu-icon > a');
    for (var h = 0; h < preset_color.length; h++) {
      var c = preset_color[h];
      c.addEventListener('click', function (event) {
        var targetElement = event.target;
        if (targetElement.tagName == 'SPAN' || targetElement.tagName == 'I') {
          targetElement = targetElement.parentNode;
        }
        var temp = targetElement.getAttribute('data-value');
        drp_menu_icon_change(temp);
      });
    }
  }

  var if_exist = document.querySelectorAll('.drp-menu-link-icon');
  if (if_exist) {
    var preset_color = document.querySelectorAll('.drp-menu-link-icon > a');
    for (var h = 0; h < preset_color.length; h++) {
      var c = preset_color[h];
      c.addEventListener('click', function (event) {
        var targetElement = event.target;
        if (targetElement.tagName == 'SPAN' || targetElement.tagName == 'I') {
          targetElement = targetElement.parentNode;
        }
        var temp = targetElement.getAttribute('data-value');
        drp_menu_link_icon_change(temp);
      });
    }
  }
  // ========================================
});



// Functions to handle layout caption change (caption hide/show in sidebar)
function layout_caption_change(value) {
  // Set the attribute on the <html> element based on the value
  if (value == 'true') {
    document.getElementsByTagName('html')[0].setAttribute('data-pc-sidebar-caption', 'true');
  } else {
    document.getElementsByTagName('html')[0].setAttribute('data-pc-sidebar-caption', 'false');
  }

  // Update button states to reflect the current value
  var control = document.querySelector('.theme-nav-caption .btn.active');
  if (control) {
    control.classList.remove('active');
  }
  var newActiveButton = document.querySelector(`.theme-nav-caption .btn[data-value='${value}']`);
  if (newActiveButton) {
    newActiveButton.classList.add('active');
  }
}

// Functions to handle layout preset change (active class add/remove from preset-color according to click)
function preset_change(value) {
  // Set attribute based on value and update active preset color link
  document.getElementsByTagName('html')[0].setAttribute('class', value);
  var control = document.querySelector('.pct-offcanvas');
  if (control) {
    document.querySelector('.preset-color > a.active').classList.remove('active');
    document.querySelector(".preset-color > a[data-value='" + value + "']").classList.add('active');
  }
}

// Functions to handle main layout change (active class add/remove from theme-main-layout according to click)
function main_layout_change(value) {
  // Set the 'data-pc-layout' attribute on the <html> element based on the passed value
  document.getElementsByTagName('html')[0].setAttribute('data-pc-layout', value);

  // Check if the off-canvas menu control element exists
  var control = document.querySelector('.pct-offcanvas');
  if (control) {
    // Find and remove the 'active' class from the currently active link in the main layout section
    var activeLink = document.querySelector('.theme-main-layout > a.active');
    if (activeLink) {
      activeLink.classList.remove('active');
    }

    // Find the new active link based on the value passed to the function and add the 'active' class to it
    var newActiveLink = document.querySelector(".theme-main-layout > a[data-value='" + value + "']");
    if (newActiveLink) {
      newActiveLink.classList.add('active');
    }
  }
}

// Function to handle layout direction change (LTR/RTL)
function layout_rtl_change(value) {
  // Get the HTML element
  var htmlElement = document.getElementsByTagName('html')[0];

  // Determine if RTL is enabled
  if (value === 'true') {
    rtl_flag = true; // Set global RTL flag
    htmlElement.setAttribute('data-pc-direction', 'rtl');
    htmlElement.setAttribute('dir', 'rtl');
    htmlElement.setAttribute('lang', 'ar');

    // Update button states for RTL
    var activeButton = document.querySelector('.theme-direction .btn.active');
    if (activeButton) {
      activeButton.classList.remove('active');
    }
    var rtlButton = document.querySelector(".theme-direction .btn[data-value='true']");
    if (rtlButton) {
      rtlButton.classList.add('active');
    }
  } else {
    rtl_flag = false; // Reset global RTL flag
    htmlElement.setAttribute('data-pc-direction', 'ltr');
    htmlElement.setAttribute('dir', 'ltr');
    htmlElement.removeAttribute('lang');

    // Update button states for LTR
    var activeButton = document.querySelector('.theme-direction .btn.active');
    if (activeButton) {
      activeButton.classList.remove('active');
    }
    var ltrButton = document.querySelector(".theme-direction .btn[data-value='false']");
    if (ltrButton) {
      ltrButton.classList.add('active');
    }
  }
}

// Function to handle layout change (dark/light) and update related elements
function layout_change(layout) {
  // Set the theme layout attribute on the <html> tag
  document.getElementsByTagName('html')[0].setAttribute('data-pc-theme', layout);

  // Remove the 'active' class from the default layout button if it exists
  var btn_control = document.querySelector('.theme-layout .btn[data-value="default"]');
  if (btn_control) {
    btn_control.classList.remove('active');
  }

  // Determine which logos and buttons to update based on the selected layout (dark or light)
  var isDark = layout === 'dark';
  dark_flag = isDark;

  // Update the logos to match the selected layout
  var logoSrc = isDark ? '../assets/images/logo-white.svg' : '../assets/images/logo-dark.svg';

  // Helper function to update a specific element's logo if it exists
  function updateLogo(selector) {
    var element = document.querySelector(selector);
    if (element) {
      element.setAttribute('src', logoSrc);
    }
  }

  // Update logos in the sidebar, navbar, auth footer, and general footer
  // updateLogo('.pc-sidebar .m-header .logo-lg');
  updateLogo('.navbar-brand .logo-lg');
  updateLogo('.auth-main.v1 .auth-sidefooter img');
  updateLogo('.auth-logo');
  updateLogo('.footer-top .footer-logo');

  // Manage the active state of theme layout buttons
  var activeControl = document.querySelector('.theme-layout .btn.active');
  if (activeControl) {
    activeControl.classList.remove('active');
  }

  // Set the correct button as active based on the layout
  var newActiveControl = document.querySelector(`.theme-layout .btn[data-value='${isDark ? 'false' : 'true'}']`);
  if (newActiveControl) {
    newActiveControl.classList.add('active');
  }
}

// Function to toggle box container class based on value (true/false)
function change_box_container(value) {
  // Check if the main content area exists
  var contentElement = document.querySelector('.pc-content');
  var footerElement = document.querySelector('.footer-wrapper');

  if (contentElement && footerElement) {
    // Toggle classes based on the value passed
    if (value === 'true') {
      contentElement.classList.add('container');
      footerElement.classList.add('container');
      footerElement.classList.remove('container-fluid');
    } else {
      contentElement.classList.remove('container');
      footerElement.classList.remove('container');
      footerElement.classList.add('container-fluid');
    }

    // Update active button state in the theme container controls
    var activeButton = document.querySelector('.theme-container .btn.active');
    if (activeButton) {
      activeButton.classList.remove('active');
    }

    var newActiveButton = document.querySelector(`.theme-container .btn[data-value='${value}']`);
    if (newActiveButton) {
      newActiveButton.classList.add('active');
    }
  }
}

// ===================
function layout_theme_sidebar_change(value) {
  if (value == 'true') {
    document.getElementsByTagName('html')[0].setAttribute('data-pc-sidebar_theme', 'true');
    if (document.querySelector('.pc-sidebar .m-header .logo-lg')) {
      document.querySelector('.pc-sidebar .m-header .logo-lg').setAttribute('src', '../assets/images/logo-dark.svg');
    }
    var control = document.querySelector('.theme-nav-layout .btn.active');
    if (control) {
      document.querySelector('.theme-nav-layout .btn.active').classList.remove('active');
      document.querySelector(".theme-nav-layout .btn[data-value='true']").classList.add('active');
    }
  } else {
    document.getElementsByTagName('html')[0].setAttribute('data-pc-sidebar_theme', 'false');
    if (document.querySelector('.pc-sidebar .m-header .logo-lg')) {
      document.querySelector('.pc-sidebar .m-header .logo-lg').setAttribute('src', '../assets/images/logo-white.svg');
    }
    var control = document.querySelector('.theme-nav-layout .btn.active');
    if (control) {
      document.querySelector('.theme-nav-layout .btn.active').classList.remove('active');
      document.querySelector(".theme-nav-layout .btn[data-value='false']").classList.add('active');
    }
  }
}
function header_change(value) {
  document.getElementsByTagName('html')[0].setAttribute('data-pc-header', value);
  var control = document.querySelector('.pct-offcanvas');
  if (control) {
    document.querySelector('.header-color > a.active').classList.remove('active');
    document.querySelector(".header-color > a[data-value='" + value + "']").classList.add('active');
  }
}
function navbar_change(value) {
  document.getElementsByTagName('html')[0].setAttribute('data-pc-navbar', value);
  var control = document.querySelector('.pct-offcanvas');
  if (control) {
    document.querySelector('.navbar-color > a.active').classList.remove('active');
    document.querySelector(".navbar-color > a[data-value='" + value + "']").classList.add('active');
  }
}
function logo_change(value) {
  document.getElementsByTagName('html')[0].setAttribute('data-pc-logo', value);
  var control = document.querySelector('.pct-offcanvas');
  if (control) {
    document.querySelector('.logo-color > a.active').classList.remove('active');
    document.querySelector(".logo-color > a[data-value='" + value + "']").classList.add('active');
  }
}
function caption_change(value) {
  document.getElementsByTagName('html')[0].setAttribute('data-pc-caption', value);
  var control = document.querySelector('.pct-offcanvas');
  if (control) {
    document.querySelector('.caption-color > a.active').classList.remove('active');
    document.querySelector(".caption-color > a[data-value='" + value + "']").classList.add('active');
  }
}
function drp_menu_icon_change(value) {
  document.getElementsByTagName('html')[0].setAttribute('data-pc-drp-menu-icon', value);
  var control = document.querySelector('.pct-offcanvas');
  if (control) {
    document.querySelector('.drp-menu-icon > a.active').classList.remove('active');
    document.querySelector(".drp-menu-icon > a[data-value='" + value + "']").classList.add('active');
  }
}
function drp_menu_link_icon_change(value) {
  document.getElementsByTagName('html')[0].setAttribute('data-pc-drp-menu-link-icon', value);
  var control = document.querySelector('.pct-offcanvas');
  if (control) {
    document.querySelector('.drp-menu-link-icon > a.active').classList.remove('active');
    document.querySelector(".drp-menu-link-icon > a[data-value='" + value + "']").classList.add('active');
  }
}
function nav_image_change(value) {
  document.getElementsByTagName('html')[0].setAttribute('data-pc-navimg', value);
  var control = document.querySelector('.pct-offcanvas');
  if (control) {
    document.querySelector('.navbar-img > a.active').classList.remove('active');
    document.querySelector(".navbar-img > a[data-value='" + value + "']").classList.add('active');
  }
}


!(function (e, n) {
    "object" == typeof exports && "object" == typeof module
        ? (module.exports = n())
        : "function" == typeof define && define.amd
        ? define([], n)
        : "object" == typeof exports
        ? (exports.feather = n())
        : (e.feather = n());
})("undefined" != typeof self ? self : this, function () {
    return (function (e) {
        var n = {};
        function i(t) {
            if (n[t]) return n[t].exports;
            var l = (n[t] = { i: t, l: !1, exports: {} });
            return e[t].call(l.exports, l, l.exports, i), (l.l = !0), l.exports;
        }
        return (
            (i.m = e),
            (i.c = n),
            (i.d = function (e, n, t) {
                i.o(e, n) ||
                    Object.defineProperty(e, n, {
                        configurable: !1,
                        enumerable: !0,
                        get: t,
                    });
            }),
            (i.r = function (e) {
                Object.defineProperty(e, "__esModule", { value: !0 });
            }),
            (i.n = function (e) {
                var n =
                    e && e.__esModule
                        ? function () {
                              return e.default;
                          }
                        : function () {
                              return e;
                          };
                return i.d(n, "a", n), n;
            }),
            (i.o = function (e, n) {
                return Object.prototype.hasOwnProperty.call(e, n);
            }),
            (i.p = ""),
            i((i.s = 80))
        );
    })([
        function (e, n, i) {
            (function (n) {
                var i = "object",
                    t = function (e) {
                        return e && e.Math == Math && e;
                    };
                e.exports =
                    t(typeof globalThis == i && globalThis) ||
                    t(typeof window == i && window) ||
                    t(typeof self == i && self) ||
                    t(typeof n == i && n) ||
                    Function("return this")();
            }).call(this, i(75));
        },
        function (e, n) {
            var i = {}.hasOwnProperty;
            e.exports = function (e, n) {
                return i.call(e, n);
            };
        },
        function (e, n, i) {
            var t = i(0),
                l = i(11),
                r = i(33),
                o = i(62),
                a = t.Symbol,
                c = l("wks");
            e.exports = function (e) {
                return (
                    c[e] || (c[e] = (o && a[e]) || (o ? a : r)("Symbol." + e))
                );
            };
        },
        function (e, n, i) {
            var t = i(6);
            e.exports = function (e) {
                if (!t(e)) throw TypeError(String(e) + " is not an object");
                return e;
            };
        },
        function (e, n) {
            e.exports = function (e) {
                try {
                    return !!e();
                } catch (e) {
                    return !0;
                }
            };
        },
        function (e, n, i) {
            var t = i(8),
                l = i(7),
                r = i(10);
            e.exports = t
                ? function (e, n, i) {
                      return l.f(e, n, r(1, i));
                  }
                : function (e, n, i) {
                      return (e[n] = i), e;
                  };
        },
        function (e, n) {
            e.exports = function (e) {
                return "object" == typeof e
                    ? null !== e
                    : "function" == typeof e;
            };
        },
        function (e, n, i) {
            var t = i(8),
                l = i(35),
                r = i(3),
                o = i(18),
                a = Object.defineProperty;
            n.f = t
                ? a
                : function (e, n, i) {
                      if ((r(e), (n = o(n, !0)), r(i), l))
                          try {
                              return a(e, n, i);
                          } catch (e) {}
                      if ("get" in i || "set" in i)
                          throw TypeError("Accessors not supported");
                      return "value" in i && (e[n] = i.value), e;
                  };
        },
        function (e, n, i) {
            var t = i(4);
            e.exports = !t(function () {
                return (
                    7 !=
                    Object.defineProperty({}, "a", {
                        get: function () {
                            return 7;
                        },
                    }).a
                );
            });
        },
        function (e, n) {
            e.exports = {};
        },
        function (e, n) {
            e.exports = function (e, n) {
                return {
                    enumerable: !(1 & e),
                    configurable: !(2 & e),
                    writable: !(4 & e),
                    value: n,
                };
            };
        },
        function (e, n, i) {
            var t = i(0),
                l = i(19),
                r = i(17),
                o = t["__core-js_shared__"] || l("__core-js_shared__", {});
            (e.exports = function (e, n) {
                return o[e] || (o[e] = void 0 !== n ? n : {});
            })("versions", []).push({
                version: "3.1.3",
                mode: r ? "pure" : "global",
                copyright: "© 2019 Denis Pushkarev (zloirock.ru)",
            });
        },
        function (e, n, i) {
            "use strict";
            Object.defineProperty(n, "__esModule", { value: !0 });
            var t = o(i(43)),
                l = o(i(41)),
                r = o(i(40));
            function o(e) {
                return e && e.__esModule ? e : { default: e };
            }
            n.default = Object.keys(l.default)
                .map(function (e) {
                    return new t.default(e, l.default[e], r.default[e]);
                })
                .reduce(function (e, n) {
                    return (e[n.name] = n), e;
                }, {});
        },
        function (e, n) {
            e.exports = [
                "constructor",
                "hasOwnProperty",
                "isPrototypeOf",
                "propertyIsEnumerable",
                "toLocaleString",
                "toString",
                "valueOf",
            ];
        },
        function (e, n, i) {
            var t = i(72),
                l = i(20);
            e.exports = function (e) {
                return t(l(e));
            };
        },
        function (e, n) {
            e.exports = {};
        },
        function (e, n, i) {
            var t = i(11),
                l = i(33),
                r = t("keys");
            e.exports = function (e) {
                return r[e] || (r[e] = l(e));
            };
        },
        function (e, n) {
            e.exports = !1;
        },
        function (e, n, i) {
            var t = i(6);
            e.exports = function (e, n) {
                if (!t(e)) return e;
                var i, l;
                if (
                    n &&
                    "function" == typeof (i = e.toString) &&
                    !t((l = i.call(e)))
                )
                    return l;
                if ("function" == typeof (i = e.valueOf) && !t((l = i.call(e))))
                    return l;
                if (
                    !n &&
                    "function" == typeof (i = e.toString) &&
                    !t((l = i.call(e)))
                )
                    return l;
                throw TypeError("Can't convert object to primitive value");
            };
        },
        function (e, n, i) {
            var t = i(0),
                l = i(5);
            e.exports = function (e, n) {
                try {
                    l(t, e, n);
                } catch (i) {
                    t[e] = n;
                }
                return n;
            };
        },
        function (e, n) {
            e.exports = function (e) {
                if (void 0 == e) throw TypeError("Can't call method on " + e);
                return e;
            };
        },
        function (e, n) {
            var i = Math.ceil,
                t = Math.floor;
            e.exports = function (e) {
                return isNaN((e = +e)) ? 0 : (e > 0 ? t : i)(e);
            };
        },
        function (e, n, i) {
            var t;
            /*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
            /*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
            !(function () {
                "use strict";
                var i = (function () {
                    function e() {}
                    function n(e, n) {
                        for (var i = n.length, t = 0; t < i; ++t) l(e, n[t]);
                    }
                    e.prototype = Object.create(null);
                    var i = {}.hasOwnProperty;
                    var t = /\s+/;
                    function l(e, l) {
                        if (l) {
                            var r = typeof l;
                            "string" === r
                                ? (function (e, n) {
                                      for (
                                          var i = n.split(t),
                                              l = i.length,
                                              r = 0;
                                          r < l;
                                          ++r
                                      )
                                          e[i[r]] = !0;
                                  })(e, l)
                                : Array.isArray(l)
                                ? n(e, l)
                                : "object" === r
                                ? (function (e, n) {
                                      for (var t in n)
                                          i.call(n, t) && (e[t] = !!n[t]);
                                  })(e, l)
                                : "number" === r &&
                                  (function (e, n) {
                                      e[n] = !0;
                                  })(e, l);
                        }
                    }
                    return function () {
                        for (
                            var i = arguments.length, t = Array(i), l = 0;
                            l < i;
                            l++
                        )
                            t[l] = arguments[l];
                        var r = new e();
                        n(r, t);
                        var o = [];
                        for (var a in r) r[a] && o.push(a);
                        return o.join(" ");
                    };
                })();
                void 0 !== e && e.exports
                    ? (e.exports = i)
                    : void 0 ===
                          (t = function () {
                              return i;
                          }.apply(n, [])) || (e.exports = t);
            })();
        },
        function (e, n, i) {
            var t = i(7).f,
                l = i(1),
                r = i(2)("toStringTag");
            e.exports = function (e, n, i) {
                e &&
                    !l((e = i ? e : e.prototype), r) &&
                    t(e, r, { configurable: !0, value: n });
            };
        },
        function (e, n, i) {
            var t = i(20);
            e.exports = function (e) {
                return Object(t(e));
            };
        },
        function (e, n, i) {
            var t = i(1),
                l = i(24),
                r = i(16),
                o = i(63),
                a = r("IE_PROTO"),
                c = Object.prototype;
            e.exports = o
                ? Object.getPrototypeOf
                : function (e) {
                      return (
                          (e = l(e)),
                          t(e, a)
                              ? e[a]
                              : "function" == typeof e.constructor &&
                                e instanceof e.constructor
                              ? e.constructor.prototype
                              : e instanceof Object
                              ? c
                              : null
                      );
                  };
        },
        function (e, n, i) {
            "use strict";
            var t,
                l,
                r,
                o = i(25),
                a = i(5),
                c = i(1),
                p = i(2),
                y = i(17),
                h = p("iterator"),
                x = !1;
            [].keys &&
                ("next" in (r = [].keys())
                    ? (l = o(o(r))) !== Object.prototype && (t = l)
                    : (x = !0)),
                void 0 == t && (t = {}),
                y ||
                    c(t, h) ||
                    a(t, h, function () {
                        return this;
                    }),
                (e.exports = {
                    IteratorPrototype: t,
                    BUGGY_SAFARI_ITERATORS: x,
                });
        },
        function (e, n, i) {
            var t = i(21),
                l = Math.min;
            e.exports = function (e) {
                return e > 0 ? l(t(e), 9007199254740991) : 0;
            };
        },
        function (e, n, i) {
            var t = i(1),
                l = i(14),
                r = i(68),
                o = i(15),
                a = r(!1);
            e.exports = function (e, n) {
                var i,
                    r = l(e),
                    c = 0,
                    p = [];
                for (i in r) !t(o, i) && t(r, i) && p.push(i);
                for (; n.length > c; )
                    t(r, (i = n[c++])) && (~a(p, i) || p.push(i));
                return p;
            };
        },
        function (e, n, i) {
            var t = i(0),
                l = i(11),
                r = i(5),
                o = i(1),
                a = i(19),
                c = i(36),
                p = i(37),
                y = p.get,
                h = p.enforce,
                x = String(c).split("toString");
            l("inspectSource", function (e) {
                return c.call(e);
            }),
                (e.exports = function (e, n, i, l) {
                    var c = !!l && !!l.unsafe,
                        p = !!l && !!l.enumerable,
                        y = !!l && !!l.noTargetGet;
                    "function" == typeof i &&
                        ("string" != typeof n ||
                            o(i, "name") ||
                            r(i, "name", n),
                        (h(i).source = x.join("string" == typeof n ? n : ""))),
                        e !== t
                            ? (c ? !y && e[n] && (p = !0) : delete e[n],
                              p ? (e[n] = i) : r(e, n, i))
                            : p
                            ? (e[n] = i)
                            : a(n, i);
                })(Function.prototype, "toString", function () {
                    return (
                        ("function" == typeof this && y(this).source) ||
                        c.call(this)
                    );
                });
        },
        function (e, n) {
            var i = {}.toString;
            e.exports = function (e) {
                return i.call(e).slice(8, -1);
            };
        },
        function (e, n, i) {
            var t = i(8),
                l = i(73),
                r = i(10),
                o = i(14),
                a = i(18),
                c = i(1),
                p = i(35),
                y = Object.getOwnPropertyDescriptor;
            n.f = t
                ? y
                : function (e, n) {
                      if (((e = o(e)), (n = a(n, !0)), p))
                          try {
                              return y(e, n);
                          } catch (e) {}
                      if (c(e, n)) return r(!l.f.call(e, n), e[n]);
                  };
        },
        function (e, n, i) {
            var t = i(0),
                l = i(31).f,
                r = i(5),
                o = i(29),
                a = i(19),
                c = i(71),
                p = i(65);
            e.exports = function (e, n) {
                var i,
                    y,
                    h,
                    x,
                    s,
                    u = e.target,
                    d = e.global,
                    f = e.stat;
                if ((i = d ? t : f ? t[u] || a(u, {}) : (t[u] || {}).prototype))
                    for (y in n) {
                        if (
                            ((x = n[y]),
                            (h = e.noTargetGet
                                ? (s = l(i, y)) && s.value
                                : i[y]),
                            !p(d ? y : u + (f ? "." : "#") + y, e.forced) &&
                                void 0 !== h)
                        ) {
                            if (typeof x == typeof h) continue;
                            c(x, h);
                        }
                        (e.sham || (h && h.sham)) && r(x, "sham", !0),
                            o(i, y, x, e);
                    }
            };
        },
        function (e, n) {
            var i = 0,
                t = Math.random();
            e.exports = function (e) {
                return "Symbol(".concat(
                    void 0 === e ? "" : e,
                    ")_",
                    (++i + t).toString(36)
                );
            };
        },
        function (e, n, i) {
            var t = i(0),
                l = i(6),
                r = t.document,
                o = l(r) && l(r.createElement);
            e.exports = function (e) {
                return o ? r.createElement(e) : {};
            };
        },
        function (e, n, i) {
            var t = i(8),
                l = i(4),
                r = i(34);
            e.exports =
                !t &&
                !l(function () {
                    return (
                        7 !=
                        Object.defineProperty(r("div"), "a", {
                            get: function () {
                                return 7;
                            },
                        }).a
                    );
                });
        },
        function (e, n, i) {
            var t = i(11);
            e.exports = t("native-function-to-string", Function.toString);
        },
        function (e, n, i) {
            var t,
                l,
                r,
                o = i(76),
                a = i(0),
                c = i(6),
                p = i(5),
                y = i(1),
                h = i(16),
                x = i(15),
                s = a.WeakMap;
            if (o) {
                var u = new s(),
                    d = u.get,
                    f = u.has,
                    g = u.set;
                (t = function (e, n) {
                    return g.call(u, e, n), n;
                }),
                    (l = function (e) {
                        return d.call(u, e) || {};
                    }),
                    (r = function (e) {
                        return f.call(u, e);
                    });
            } else {
                var v = h("state");
                (x[v] = !0),
                    (t = function (e, n) {
                        return p(e, v, n), n;
                    }),
                    (l = function (e) {
                        return y(e, v) ? e[v] : {};
                    }),
                    (r = function (e) {
                        return y(e, v);
                    });
            }
            e.exports = {
                set: t,
                get: l,
                has: r,
                enforce: function (e) {
                    return r(e) ? l(e) : t(e, {});
                },
                getterFor: function (e) {
                    return function (n) {
                        var i;
                        if (!c(n) || (i = l(n)).type !== e)
                            throw TypeError(
                                "Incompatible receiver, " + e + " required"
                            );
                        return i;
                    };
                },
            };
        },
        function (e, n, i) {
            "use strict";
            Object.defineProperty(n, "__esModule", { value: !0 });
            var t =
                    Object.assign ||
                    function (e) {
                        for (var n = 1; n < arguments.length; n++) {
                            var i = arguments[n];
                            for (var t in i)
                                Object.prototype.hasOwnProperty.call(i, t) &&
                                    (e[t] = i[t]);
                        }
                        return e;
                    },
                l = o(i(22)),
                r = o(i(12));
            function o(e) {
                return e && e.__esModule ? e : { default: e };
            }
            n.default = function () {
                var e =
                    arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {};
                if ("undefined" == typeof document)
                    throw new Error(
                        "`feather.replace()` only works in a browser environment."
                    );
                var n = document.querySelectorAll("[data-feather]");
                Array.from(n).forEach(function (n) {
                    return (function (e) {
                        var n =
                                arguments.length > 1 && void 0 !== arguments[1]
                                    ? arguments[1]
                                    : {},
                            i = (function (e) {
                                return Array.from(e.attributes).reduce(
                                    function (e, n) {
                                        return (e[n.name] = n.value), e;
                                    },
                                    {}
                                );
                            })(e),
                            o = i["data-feather"];
                        if (
                            (delete i["data-feather"], void 0 !== r.default[o])
                        ) {
                            var a = r.default[o].toSvg(
                                    t({}, n, i, {
                                        class: (0, l.default)(n.class, i.class),
                                    })
                                ),
                                c = new DOMParser()
                                    .parseFromString(a, "image/svg+xml")
                                    .querySelector("svg");
                            e.parentNode.replaceChild(c, e);
                        } else console.warn("feather: '" + o + "' is not a valid icon");
                    })(n, e);
                });
            };
        },
        function (e, n, i) {
            "use strict";
            Object.defineProperty(n, "__esModule", { value: !0 });
            var t,
                l = i(12),
                r = (t = l) && t.__esModule ? t : { default: t };
            n.default = function (e) {
                var n =
                    arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : {};
                if (
                    (console.warn(
                        "feather.toSvg() is deprecated. Please use feather.icons[name].toSvg() instead."
                    ),
                    !e)
                )
                    throw new Error(
                        "The required `key` (icon name) parameter is missing."
                    );
                if (!r.default[e])
                    throw new Error(
                        "No icon matching '" +
                            e +
                            "'. See the complete list of icons at https://feathericons.com"
                    );
                return r.default[e].toSvg(n);
            };
        },
        function (e) {
            e.exports = {
                activity: ["pulse", "health", "action", "motion"],
                airplay: ["stream", "cast", "mirroring"],
                "alert-circle": ["warning", "alert", "danger"],
                "alert-octagon": ["warning", "alert", "danger"],
                "alert-triangle": ["warning", "alert", "danger"],
                "align-center": ["text alignment", "center"],
                "align-justify": ["text alignment", "justified"],
                "align-left": ["text alignment", "left"],
                "align-right": ["text alignment", "right"],
                anchor: [],
                archive: ["index", "box"],
                "at-sign": ["mention", "at", "email", "message"],
                award: ["achievement", "badge"],
                aperture: ["camera", "photo"],
                "bar-chart": ["statistics", "diagram", "graph"],
                "bar-chart-2": ["statistics", "diagram", "graph"],
                battery: ["power", "electricity"],
                "battery-charging": ["power", "electricity"],
                bell: ["alarm", "notification", "sound"],
                "bell-off": ["alarm", "notification", "silent"],
                bluetooth: ["wireless"],
                "book-open": ["read", "library"],
                book: ["read", "dictionary", "booklet", "magazine", "library"],
                bookmark: ["read", "clip", "marker", "tag"],
                box: ["cube"],
                briefcase: ["work", "bag", "baggage", "folder"],
                calendar: ["date"],
                camera: ["photo"],
                cast: ["chromecast", "airplay"],
                "chevron-down": ["expand"],
                "chevron-up": ["collapse"],
                circle: ["off", "zero", "record"],
                clipboard: ["copy"],
                clock: ["time", "watch", "alarm"],
                "cloud-drizzle": ["weather", "shower"],
                "cloud-lightning": ["weather", "bolt"],
                "cloud-rain": ["weather"],
                "cloud-snow": ["weather", "blizzard"],
                cloud: ["weather"],
                codepen: ["logo"],
                codesandbox: ["logo"],
                code: ["source", "programming"],
                coffee: [
                    "drink",
                    "cup",
                    "mug",
                    "tea",
                    "cafe",
                    "hot",
                    "beverage",
                ],
                columns: ["layout"],
                command: ["keyboard", "cmd", "terminal", "prompt"],
                compass: ["navigation", "safari", "travel", "direction"],
                copy: ["clone", "duplicate"],
                "corner-down-left": ["arrow", "return"],
                "corner-down-right": ["arrow"],
                "corner-left-down": ["arrow"],
                "corner-left-up": ["arrow"],
                "corner-right-down": ["arrow"],
                "corner-right-up": ["arrow"],
                "corner-up-left": ["arrow"],
                "corner-up-right": ["arrow"],
                cpu: ["processor", "technology"],
                "credit-card": ["purchase", "payment", "cc"],
                crop: ["photo", "image"],
                crosshair: ["aim", "target"],
                database: ["storage", "memory"],
                delete: ["remove"],
                disc: ["album", "cd", "dvd", "music"],
                "dollar-sign": ["currency", "money", "payment"],
                droplet: ["water"],
                edit: ["pencil", "change"],
                "edit-2": ["pencil", "change"],
                "edit-3": ["pencil", "change"],
                eye: ["view", "watch"],
                "eye-off": ["view", "watch", "hide", "hidden"],
                "external-link": ["outbound"],
                facebook: ["logo", "social"],
                "fast-forward": ["music"],
                figma: ["logo", "design", "tool"],
                "file-minus": ["delete", "remove", "erase"],
                "file-plus": ["add", "create", "new"],
                "file-text": ["data", "txt", "pdf"],
                film: ["movie", "video"],
                filter: ["funnel", "hopper"],
                flag: ["report"],
                "folder-minus": ["directory"],
                "folder-plus": ["directory"],
                folder: ["directory"],
                framer: ["logo", "design", "tool"],
                frown: ["emoji", "face", "bad", "sad", "emotion"],
                gift: ["present", "box", "birthday", "party"],
                "git-branch": ["code", "version control"],
                "git-commit": ["code", "version control"],
                "git-merge": ["code", "version control"],
                "git-pull-request": ["code", "version control"],
                github: ["logo", "version control"],
                gitlab: ["logo", "version control"],
                globe: ["world", "browser", "language", "translate"],
                "hard-drive": ["computer", "server", "memory", "data"],
                hash: ["hashtag", "number", "pound"],
                headphones: ["music", "audio", "sound"],
                heart: ["like", "love", "emotion"],
                "help-circle": ["question mark"],
                hexagon: ["shape", "node.js", "logo"],
                home: ["house", "living"],
                image: ["picture"],
                inbox: ["email"],
                instagram: ["logo", "camera"],
                key: ["password", "login", "authentication", "secure"],
                layers: ["stack"],
                layout: ["window", "webpage"],
                "life-buoy": ["help", "life ring", "support"],
                link: ["chain", "url"],
                "link-2": ["chain", "url"],
                linkedin: ["logo", "social media"],
                list: ["options"],
                lock: ["security", "password", "secure"],
                "log-in": ["sign in", "arrow", "enter"],
                "log-out": ["sign out", "arrow", "exit"],
                mail: ["email", "message"],
                "map-pin": ["location", "navigation", "travel", "marker"],
                map: ["location", "navigation", "travel"],
                maximize: ["fullscreen"],
                "maximize-2": ["fullscreen", "arrows", "expand"],
                meh: ["emoji", "face", "neutral", "emotion"],
                menu: ["bars", "navigation", "hamburger"],
                "message-circle": ["comment", "chat"],
                "message-square": ["comment", "chat"],
                "mic-off": ["record", "sound", "mute"],
                mic: ["record", "sound", "listen"],
                minimize: ["exit fullscreen", "close"],
                "minimize-2": ["exit fullscreen", "arrows", "close"],
                minus: ["subtract"],
                monitor: ["tv", "screen", "display"],
                moon: ["dark", "night"],
                "more-horizontal": ["ellipsis"],
                "more-vertical": ["ellipsis"],
                "mouse-pointer": ["arrow", "cursor"],
                move: ["arrows"],
                music: ["note"],
                navigation: ["location", "travel"],
                "navigation-2": ["location", "travel"],
                octagon: ["stop"],
                package: ["box", "container"],
                paperclip: ["attachment"],
                pause: ["music", "stop"],
                "pause-circle": ["music", "audio", "stop"],
                "pen-tool": ["vector", "drawing"],
                percent: ["discount"],
                "phone-call": ["ring"],
                "phone-forwarded": ["call"],
                "phone-incoming": ["call"],
                "phone-missed": ["call"],
                "phone-off": ["call", "mute"],
                "phone-outgoing": ["call"],
                phone: ["call"],
                play: ["music", "start"],
                "pie-chart": ["statistics", "diagram"],
                "play-circle": ["music", "start"],
                plus: ["add", "new"],
                "plus-circle": ["add", "new"],
                "plus-square": ["add", "new"],
                pocket: ["logo", "save"],
                power: ["on", "off"],
                printer: ["fax", "office", "device"],
                radio: ["signal"],
                "refresh-cw": ["synchronise", "arrows"],
                "refresh-ccw": ["arrows"],
                repeat: ["loop", "arrows"],
                rewind: ["music"],
                "rotate-ccw": ["arrow"],
                "rotate-cw": ["arrow"],
                rss: ["feed", "subscribe"],
                save: ["floppy disk"],
                scissors: ["cut"],
                search: ["find", "magnifier", "magnifying glass"],
                send: [
                    "message",
                    "mail",
                    "email",
                    "paper airplane",
                    "paper aeroplane",
                ],
                settings: ["cog", "edit", "gear", "preferences"],
                "share-2": ["network", "connections"],
                shield: ["security", "secure"],
                "shield-off": ["security", "insecure"],
                "shopping-bag": ["ecommerce", "cart", "purchase", "store"],
                "shopping-cart": ["ecommerce", "cart", "purchase", "store"],
                shuffle: ["music"],
                "skip-back": ["music"],
                "skip-forward": ["music"],
                slack: ["logo"],
                slash: ["ban", "no"],
                sliders: ["settings", "controls"],
                smartphone: ["cellphone", "device"],
                smile: ["emoji", "face", "happy", "good", "emotion"],
                speaker: ["audio", "music"],
                star: ["bookmark", "favorite", "like"],
                "stop-circle": ["media", "music"],
                sun: ["brightness", "weather", "light"],
                sunrise: ["weather", "time", "morning", "day"],
                sunset: ["weather", "time", "evening", "night"],
                tablet: ["device"],
                tag: ["label"],
                target: ["logo", "bullseye"],
                terminal: ["code", "command line", "prompt"],
                thermometer: [
                    "temperature",
                    "celsius",
                    "fahrenheit",
                    "weather",
                ],
                "thumbs-down": ["dislike", "bad", "emotion"],
                "thumbs-up": ["like", "good", "emotion"],
                "toggle-left": ["on", "off", "switch"],
                "toggle-right": ["on", "off", "switch"],
                tool: ["settings", "spanner"],
                trash: ["garbage", "delete", "remove", "bin"],
                "trash-2": ["garbage", "delete", "remove", "bin"],
                triangle: ["delta"],
                truck: ["delivery", "van", "shipping", "transport", "lorry"],
                tv: ["television", "stream"],
                twitch: ["logo"],
                twitter: ["logo", "social"],
                type: ["text"],
                umbrella: ["rain", "weather"],
                unlock: ["security"],
                "user-check": ["followed", "subscribed"],
                "user-minus": ["delete", "remove", "unfollow", "unsubscribe"],
                "user-plus": ["new", "add", "create", "follow", "subscribe"],
                "user-x": [
                    "delete",
                    "remove",
                    "unfollow",
                    "unsubscribe",
                    "unavailable",
                ],
                user: ["person", "account"],
                users: ["group"],
                "video-off": ["camera", "movie", "film"],
                video: ["camera", "movie", "film"],
                voicemail: ["phone"],
                volume: ["music", "sound", "mute"],
                "volume-1": ["music", "sound"],
                "volume-2": ["music", "sound"],
                "volume-x": ["music", "sound", "mute"],
                watch: ["clock", "time"],
                "wifi-off": ["disabled"],
                wifi: ["connection", "signal", "wireless"],
                wind: ["weather", "air"],
                "x-circle": [
                    "cancel",
                    "close",
                    "delete",
                    "remove",
                    "times",
                    "clear",
                ],
                "x-octagon": [
                    "delete",
                    "stop",
                    "alert",
                    "warning",
                    "times",
                    "clear",
                ],
                "x-square": [
                    "cancel",
                    "close",
                    "delete",
                    "remove",
                    "times",
                    "clear",
                ],
                x: ["cancel", "close", "delete", "remove", "times", "clear"],
                youtube: ["logo", "video", "play"],
                "zap-off": ["flash", "camera", "lightning"],
                zap: ["flash", "camera", "lightning"],
                "zoom-in": ["magnifying glass"],
                "zoom-out": ["magnifying glass"],
            };
        },
        function (e) {
            e.exports = {
                activity:
                    '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
                airplay:
                    '<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon>',
                "alert-circle":
                    '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
                "alert-octagon":
                    '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
                "alert-triangle":
                    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
                "align-center":
                    '<line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line>',
                "align-justify":
                    '<line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line>',
                "align-left":
                    '<line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line>',
                "align-right":
                    '<line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line>',
                anchor: '<circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>',
                aperture:
                    '<circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>',
                archive:
                    '<polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line>',
                "arrow-down-circle":
                    '<circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line>',
                "arrow-down-left":
                    '<line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline>',
                "arrow-down-right":
                    '<line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline>',
                "arrow-down":
                    '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>',
                "arrow-left-circle":
                    '<circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line>',
                "arrow-left":
                    '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
                "arrow-right-circle":
                    '<circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line>',
                "arrow-right":
                    '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
                "arrow-up-circle":
                    '<circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line>',
                "arrow-up-left":
                    '<line x1="17" y1="17" x2="7" y2="7"></line><polyline points="7 17 7 7 17 7"></polyline>',
                "arrow-up-right":
                    '<line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline>',
                "arrow-up":
                    '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>',
                "at-sign":
                    '<circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>',
                award: '<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>',
                "bar-chart-2":
                    '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>',
                "bar-chart":
                    '<line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line>',
                "battery-charging":
                    '<path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><line x1="23" y1="13" x2="23" y2="11"></line><polyline points="11 6 7 12 13 12 9 18"></polyline>',
                battery:
                    '<rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line>',
                "bell-off":
                    '<path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
                bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
                bluetooth:
                    '<polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"></polyline>',
                bold: '<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>',
                "book-open":
                    '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
                book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
                bookmark:
                    '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>',
                box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
                briefcase:
                    '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
                calendar:
                    '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
                "camera-off":
                    '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path>',
                camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>',
                cast: '<path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path><line x1="2" y1="20" x2="2.01" y2="20"></line>',
                "check-circle":
                    '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
                "check-square":
                    '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
                check: '<polyline points="20 6 9 17 4 12"></polyline>',
                "chevron-down": '<polyline points="6 9 12 15 18 9"></polyline>',
                "chevron-left":
                    '<polyline points="15 18 9 12 15 6"></polyline>',
                "chevron-right":
                    '<polyline points="9 18 15 12 9 6"></polyline>',
                "chevron-up": '<polyline points="18 15 12 9 6 15"></polyline>',
                "chevrons-down":
                    '<polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline>',
                "chevrons-left":
                    '<polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline>',
                "chevrons-right":
                    '<polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline>',
                "chevrons-up":
                    '<polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline>',
                chrome: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>',
                circle: '<circle cx="12" cy="12" r="10"></circle>',
                clipboard:
                    '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>',
                clock: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
                "cloud-drizzle":
                    '<line x1="8" y1="19" x2="8" y2="21"></line><line x1="8" y1="13" x2="8" y2="15"></line><line x1="16" y1="19" x2="16" y2="21"></line><line x1="16" y1="13" x2="16" y2="15"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="12" y1="15" x2="12" y2="17"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>',
                "cloud-lightning":
                    '<path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline>',
                "cloud-off":
                    '<path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
                "cloud-rain":
                    '<line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>',
                "cloud-snow":
                    '<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="8" y1="20" x2="8.01" y2="20"></line><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="12" y1="22" x2="12.01" y2="22"></line><line x1="16" y1="16" x2="16.01" y2="16"></line><line x1="16" y1="20" x2="16.01" y2="20"></line>',
                cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>',
                code: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
                codepen:
                    '<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line>',
                codesandbox:
                    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
                coffee: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>',
                columns:
                    '<path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>',
                command:
                    '<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>',
                compass:
                    '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>',
                copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
                "corner-down-left":
                    '<polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path>',
                "corner-down-right":
                    '<polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path>',
                "corner-left-down":
                    '<polyline points="14 15 9 20 4 15"></polyline><path d="M20 4h-7a4 4 0 0 0-4 4v12"></path>',
                "corner-left-up":
                    '<polyline points="14 9 9 4 4 9"></polyline><path d="M20 20h-7a4 4 0 0 1-4-4V4"></path>',
                "corner-right-down":
                    '<polyline points="10 15 15 20 20 15"></polyline><path d="M4 4h7a4 4 0 0 1 4 4v12"></path>',
                "corner-right-up":
                    '<polyline points="10 9 15 4 20 9"></polyline><path d="M4 20h7a4 4 0 0 0 4-4V4"></path>',
                "corner-up-left":
                    '<polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>',
                "corner-up-right":
                    '<polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>',
                cpu: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>',
                "credit-card":
                    '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>',
                crop: '<path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>',
                crosshair:
                    '<circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line>',
                database:
                    '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>',
                delete: '<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line>',
                disc: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>',
                "divide-circle":
                    '<line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line><circle cx="12" cy="12" r="10"></circle>',
                "divide-square":
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line>',
                divide: '<circle cx="12" cy="6" r="2"></circle><line x1="5" y1="12" x2="19" y2="12"></line><circle cx="12" cy="18" r="2"></circle>',
                "dollar-sign":
                    '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
                "download-cloud":
                    '<polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>',
                download:
                    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>',
                dribbble:
                    '<circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>',
                droplet:
                    '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>',
                "edit-2":
                    '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>',
                "edit-3":
                    '<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>',
                edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>',
                "external-link":
                    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',
                "eye-off":
                    '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
                eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>',
                facebook:
                    '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>',
                "fast-forward":
                    '<polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon>',
                feather:
                    '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line>',
                figma: '<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path>',
                "file-minus":
                    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line>',
                "file-plus":
                    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line>',
                "file-text":
                    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
                file: '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline>',
                film: '<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line>',
                filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>',
                flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>',
                "folder-minus":
                    '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="9" y1="14" x2="15" y2="14"></line>',
                "folder-plus":
                    '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line>',
                folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>',
                framer: '<path d="M5 16V9h14V2H5l14 14h-7m-7 0l7 7v-7m-7 0h7"></path>',
                frown: '<circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>',
                gift: '<polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>',
                "git-branch":
                    '<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>',
                "git-commit":
                    '<circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line>',
                "git-merge":
                    '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path>',
                "git-pull-request":
                    '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line>',
                github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>',
                gitlab: '<path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path>',
                globe: '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
                grid: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',
                "hard-drive":
                    '<line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line>',
                hash: '<line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>',
                headphones:
                    '<path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>',
                heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
                "help-circle":
                    '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>',
                hexagon:
                    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>',
                home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
                image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>',
                inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>',
                info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
                instagram:
                    '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>',
                italic: '<line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line>',
                key: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>',
                layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>',
                layout: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>',
                "life-buoy":
                    '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>',
                "link-2":
                    '<path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line>',
                link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>',
                linkedin:
                    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>',
                list: '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>',
                loader: '<line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>',
                lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
                "log-in":
                    '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line>',
                "log-out":
                    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>',
                mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
                "map-pin":
                    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>',
                map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>',
                "maximize-2":
                    '<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>',
                maximize:
                    '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>',
                meh: '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>',
                menu: '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>',
                "message-circle":
                    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>',
                "message-square":
                    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
                "mic-off":
                    '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>',
                mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>',
                "minimize-2":
                    '<polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line>',
                minimize:
                    '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>',
                "minus-circle":
                    '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line>',
                "minus-square":
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line>',
                minus: '<line x1="5" y1="12" x2="19" y2="12"></line>',
                monitor:
                    '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
                moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
                "more-horizontal":
                    '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>',
                "more-vertical":
                    '<circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>',
                "mouse-pointer":
                    '<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path>',
                move: '<polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>',
                music: '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
                "navigation-2":
                    '<polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>',
                navigation:
                    '<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>',
                octagon:
                    '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>',
                package:
                    '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
                paperclip:
                    '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>',
                "pause-circle":
                    '<circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line>',
                pause: '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>',
                "pen-tool":
                    '<path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle>',
                percent:
                    '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>',
                "phone-call":
                    '<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                "phone-forwarded":
                    '<polyline points="19 1 23 5 19 9"></polyline><line x1="15" y1="5" x2="23" y2="5"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                "phone-incoming":
                    '<polyline points="16 2 16 8 22 8"></polyline><line x1="23" y1="1" x2="16" y2="8"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                "phone-missed":
                    '<line x1="23" y1="1" x2="17" y2="7"></line><line x1="17" y1="1" x2="23" y2="7"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                "phone-off":
                    '<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line>',
                "phone-outgoing":
                    '<polyline points="23 7 23 1 17 1"></polyline><line x1="16" y1="8" x2="23" y2="1"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                "pie-chart":
                    '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>',
                "play-circle":
                    '<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>',
                play: '<polygon points="5 3 19 12 5 21 5 3"></polygon>',
                "plus-circle":
                    '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>',
                "plus-square":
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>',
                plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
                pocket: '<path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path><polyline points="8 10 12 14 16 10"></polyline>',
                power: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line>',
                printer:
                    '<polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>',
                radio: '<circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>',
                "refresh-ccw":
                    '<polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>',
                "refresh-cw":
                    '<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>',
                repeat: '<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>',
                rewind: '<polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon>',
                "rotate-ccw":
                    '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>',
                "rotate-cw":
                    '<polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>',
                rss: '<path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle>',
                save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>',
                scissors:
                    '<circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line>',
                search: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
                send: '<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>',
                server: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>',
                settings:
                    '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
                "share-2":
                    '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>',
                share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line>',
                "shield-off":
                    '<path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"></path><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
                shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
                "shopping-bag":
                    '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>',
                "shopping-cart":
                    '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
                shuffle:
                    '<polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line>',
                sidebar:
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>',
                "skip-back":
                    '<polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line>',
                "skip-forward":
                    '<polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line>',
                slack: '<path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path>',
                slash: '<circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>',
                sliders:
                    '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>',
                smartphone:
                    '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>',
                smile: '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>',
                speaker:
                    '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line>',
                square: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>',
                star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
                "stop-circle":
                    '<circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect>',
                sun: '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>',
                sunrise:
                    '<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline>',
                sunset: '<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline>',
                table: '<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>',
                tablet: '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>',
                tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>',
                target: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
                terminal:
                    '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>',
                thermometer:
                    '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>',
                "thumbs-down":
                    '<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>',
                "thumbs-up":
                    '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>',
                "toggle-left":
                    '<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="8" cy="12" r="3"></circle>',
                "toggle-right":
                    '<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle>',
                tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
                "trash-2":
                    '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>',
                trash: '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>',
                trello: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect>',
                "trending-down":
                    '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline>',
                "trending-up":
                    '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',
                triangle:
                    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>',
                truck: '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>',
                tv: '<rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>',
                twitch: '<path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path>',
                twitter:
                    '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>',
                type: '<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>',
                umbrella:
                    '<path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>',
                underline:
                    '<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line>',
                unlock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>',
                "upload-cloud":
                    '<polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline>',
                upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>',
                "user-check":
                    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>',
                "user-minus":
                    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line>',
                "user-plus":
                    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>',
                "user-x":
                    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line>',
                user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
                users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
                "video-off":
                    '<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
                video: '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>',
                voicemail:
                    '<circle cx="5.5" cy="11.5" r="4.5"></circle><circle cx="18.5" cy="11.5" r="4.5"></circle><line x1="5.5" y1="16" x2="18.5" y2="16"></line>',
                "volume-1":
                    '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>',
                "volume-2":
                    '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>',
                "volume-x":
                    '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>',
                volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>',
                watch: '<circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path>',
                "wifi-off":
                    '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
                wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
                wind: '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>',
                "x-circle":
                    '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
                "x-octagon":
                    '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
                "x-square":
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line>',
                x: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
                youtube:
                    '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>',
                "zap-off":
                    '<polyline points="12.41 6.75 13 2 10.57 4.92"></polyline><polyline points="18.57 12.91 21 10 15.66 10"></polyline><polyline points="8 8 3 14 12 14 11 22 16 16"></polyline><line x1="1" y1="1" x2="23" y2="23"></line>',
                zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
                "zoom-in":
                    '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line>',
                "zoom-out":
                    '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line>',
            };
        },
        function (e) {
            e.exports = {
                xmlns: "http://www.w3.org/2000/svg",
                width: 24,
                height: 24,
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": 2,
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
            };
        },
        function (e, n, i) {
            "use strict";
            Object.defineProperty(n, "__esModule", { value: !0 });
            var t =
                    Object.assign ||
                    function (e) {
                        for (var n = 1; n < arguments.length; n++) {
                            var i = arguments[n];
                            for (var t in i)
                                Object.prototype.hasOwnProperty.call(i, t) &&
                                    (e[t] = i[t]);
                        }
                        return e;
                    },
                l = (function () {
                    function e(e, n) {
                        for (var i = 0; i < n.length; i++) {
                            var t = n[i];
                            (t.enumerable = t.enumerable || !1),
                                (t.configurable = !0),
                                "value" in t && (t.writable = !0),
                                Object.defineProperty(e, t.key, t);
                        }
                    }
                    return function (n, i, t) {
                        return i && e(n.prototype, i), t && e(n, t), n;
                    };
                })(),
                r = a(i(22)),
                o = a(i(42));
            function a(e) {
                return e && e.__esModule ? e : { default: e };
            }
            var c = (function () {
                function e(n, i) {
                    var l =
                        arguments.length > 2 && void 0 !== arguments[2]
                            ? arguments[2]
                            : [];
                    !(function (e, n) {
                        if (!(e instanceof n))
                            throw new TypeError(
                                "Cannot call a class as a function"
                            );
                    })(this, e),
                        (this.name = n),
                        (this.contents = i),
                        (this.tags = l),
                        (this.attrs = t({}, o.default, {
                            class: "feather feather-" + n,
                        }));
                }
                return (
                    l(e, [
                        {
                            key: "toSvg",
                            value: function () {
                                var e =
                                    arguments.length > 0 &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {};
                                return (
                                    "<svg " +
                                    (function (e) {
                                        return Object.keys(e)
                                            .map(function (n) {
                                                return n + '="' + e[n] + '"';
                                            })
                                            .join(" ");
                                    })(
                                        t({}, this.attrs, e, {
                                            class: (0, r.default)(
                                                this.attrs.class,
                                                e.class
                                            ),
                                        })
                                    ) +
                                    ">" +
                                    this.contents +
                                    "</svg>"
                                );
                            },
                        },
                        {
                            key: "toString",
                            value: function () {
                                return this.contents;
                            },
                        },
                    ]),
                    e
                );
            })();
            n.default = c;
        },
        function (e, n, i) {
            "use strict";
            var t = o(i(12)),
                l = o(i(39)),
                r = o(i(38));
            function o(e) {
                return e && e.__esModule ? e : { default: e };
            }
            e.exports = {
                icons: t.default,
                toSvg: l.default,
                replace: r.default,
            };
        },
        function (e, n, i) {
            e.exports = i(0);
        },
        function (e, n, i) {
            var t = i(2)("iterator"),
                l = !1;
            try {
                var r = 0,
                    o = {
                        next: function () {
                            return { done: !!r++ };
                        },
                        return: function () {
                            l = !0;
                        },
                    };
                (o[t] = function () {
                    return this;
                }),
                    Array.from(o, function () {
                        throw 2;
                    });
            } catch (e) {}
            e.exports = function (e, n) {
                if (!n && !l) return !1;
                var i = !1;
                try {
                    var r = {};
                    (r[t] = function () {
                        return {
                            next: function () {
                                return { done: (i = !0) };
                            },
                        };
                    }),
                        e(r);
                } catch (e) {}
                return i;
            };
        },
        function (e, n, i) {
            var t = i(30),
                l = i(2)("toStringTag"),
                r =
                    "Arguments" ==
                    t(
                        (function () {
                            return arguments;
                        })()
                    );
            e.exports = function (e) {
                var n, i, o;
                return void 0 === e
                    ? "Undefined"
                    : null === e
                    ? "Null"
                    : "string" ==
                      typeof (i = (function (e, n) {
                          try {
                              return e[n];
                          } catch (e) {}
                      })((n = Object(e)), l))
                    ? i
                    : r
                    ? t(n)
                    : "Object" == (o = t(n)) && "function" == typeof n.callee
                    ? "Arguments"
                    : o;
            };
        },
        function (e, n, i) {
            var t = i(47),
                l = i(9),
                r = i(2)("iterator");
            e.exports = function (e) {
                if (void 0 != e) return e[r] || e["@@iterator"] || l[t(e)];
            };
        },
        function (e, n, i) {
            "use strict";
            var t = i(18),
                l = i(7),
                r = i(10);
            e.exports = function (e, n, i) {
                var o = t(n);
                o in e ? l.f(e, o, r(0, i)) : (e[o] = i);
            };
        },
        function (e, n, i) {
            var t = i(2),
                l = i(9),
                r = t("iterator"),
                o = Array.prototype;
            e.exports = function (e) {
                return void 0 !== e && (l.Array === e || o[r] === e);
            };
        },
        function (e, n, i) {
            var t = i(3);
            e.exports = function (e, n, i, l) {
                try {
                    return l ? n(t(i)[0], i[1]) : n(i);
                } catch (n) {
                    var r = e.return;
                    throw (void 0 !== r && t(r.call(e)), n);
                }
            };
        },
        function (e, n) {
            e.exports = function (e) {
                if ("function" != typeof e)
                    throw TypeError(String(e) + " is not a function");
                return e;
            };
        },
        function (e, n, i) {
            var t = i(52);
            e.exports = function (e, n, i) {
                if ((t(e), void 0 === n)) return e;
                switch (i) {
                    case 0:
                        return function () {
                            return e.call(n);
                        };
                    case 1:
                        return function (i) {
                            return e.call(n, i);
                        };
                    case 2:
                        return function (i, t) {
                            return e.call(n, i, t);
                        };
                    case 3:
                        return function (i, t, l) {
                            return e.call(n, i, t, l);
                        };
                }
                return function () {
                    return e.apply(n, arguments);
                };
            };
        },
        function (e, n, i) {
            "use strict";
            var t = i(53),
                l = i(24),
                r = i(51),
                o = i(50),
                a = i(27),
                c = i(49),
                p = i(48);
            e.exports = function (e) {
                var n,
                    i,
                    y,
                    h,
                    x = l(e),
                    s = "function" == typeof this ? this : Array,
                    u = arguments.length,
                    d = u > 1 ? arguments[1] : void 0,
                    f = void 0 !== d,
                    g = 0,
                    v = p(x);
                if (
                    (f && (d = t(d, u > 2 ? arguments[2] : void 0, 2)),
                    void 0 == v || (s == Array && o(v)))
                )
                    for (i = new s((n = a(x.length))); n > g; g++)
                        c(i, g, f ? d(x[g], g) : x[g]);
                else
                    for (h = v.call(x), i = new s(); !(y = h.next()).done; g++)
                        c(i, g, f ? r(h, d, [y.value, g], !0) : y.value);
                return (i.length = g), i;
            };
        },
        function (e, n, i) {
            var t = i(32),
                l = i(54);
            t(
                {
                    target: "Array",
                    stat: !0,
                    forced: !i(46)(function (e) {
                        Array.from(e);
                    }),
                },
                { from: l }
            );
        },
        function (e, n, i) {
            var t = i(6),
                l = i(3);
            e.exports = function (e, n) {
                if ((l(e), !t(n) && null !== n))
                    throw TypeError(
                        "Can't set " + String(n) + " as a prototype"
                    );
            };
        },
        function (e, n, i) {
            var t = i(56);
            e.exports =
                Object.setPrototypeOf ||
                ("__proto__" in {}
                    ? (function () {
                          var e,
                              n = !1,
                              i = {};
                          try {
                              (e = Object.getOwnPropertyDescriptor(
                                  Object.prototype,
                                  "__proto__"
                              ).set).call(i, []),
                                  (n = i instanceof Array);
                          } catch (e) {}
                          return function (i, l) {
                              return (
                                  t(i, l),
                                  n ? e.call(i, l) : (i.__proto__ = l),
                                  i
                              );
                          };
                      })()
                    : void 0);
        },
        function (e, n, i) {
            var t = i(0).document;
            e.exports = t && t.documentElement;
        },
        function (e, n, i) {
            var t = i(28),
                l = i(13);
            e.exports =
                Object.keys ||
                function (e) {
                    return t(e, l);
                };
        },
        function (e, n, i) {
            var t = i(8),
                l = i(7),
                r = i(3),
                o = i(59);
            e.exports = t
                ? Object.defineProperties
                : function (e, n) {
                      r(e);
                      for (var i, t = o(n), a = t.length, c = 0; a > c; )
                          l.f(e, (i = t[c++]), n[i]);
                      return e;
                  };
        },
        function (e, n, i) {
            var t = i(3),
                l = i(60),
                r = i(13),
                o = i(15),
                a = i(58),
                c = i(34),
                p = i(16)("IE_PROTO"),
                y = function () {},
                h = function () {
                    var e,
                        n = c("iframe"),
                        i = r.length;
                    for (
                        n.style.display = "none",
                            a.appendChild(n),
                            n.src = String("javascript:"),
                            (e = n.contentWindow.document).open(),
                            e.write("<script>document.F=Object</script>"),
                            e.close(),
                            h = e.F;
                        i--;

                    )
                        delete h.prototype[r[i]];
                    return h();
                };
            (e.exports =
                Object.create ||
                function (e, n) {
                    var i;
                    return (
                        null !== e
                            ? ((y.prototype = t(e)),
                              (i = new y()),
                              (y.prototype = null),
                              (i[p] = e))
                            : (i = h()),
                        void 0 === n ? i : l(i, n)
                    );
                }),
                (o[p] = !0);
        },
        function (e, n, i) {
            var t = i(4);
            e.exports =
                !!Object.getOwnPropertySymbols &&
                !t(function () {
                    return !String(Symbol());
                });
        },
        function (e, n, i) {
            var t = i(4);
            e.exports = !t(function () {
                function e() {}
                return (
                    (e.prototype.constructor = null),
                    Object.getPrototypeOf(new e()) !== e.prototype
                );
            });
        },
        function (e, n, i) {
            "use strict";
            var t = i(26).IteratorPrototype,
                l = i(61),
                r = i(10),
                o = i(23),
                a = i(9),
                c = function () {
                    return this;
                };
            e.exports = function (e, n, i) {
                var p = n + " Iterator";
                return (
                    (e.prototype = l(t, { next: r(1, i) })),
                    o(e, p, !1, !0),
                    (a[p] = c),
                    e
                );
            };
        },
        function (e, n, i) {
            var t = i(4),
                l = /#|\.prototype\./,
                r = function (e, n) {
                    var i = a[o(e)];
                    return (
                        i == p ||
                        (i != c && ("function" == typeof n ? t(n) : !!n))
                    );
                },
                o = (r.normalize = function (e) {
                    return String(e).replace(l, ".").toLowerCase();
                }),
                a = (r.data = {}),
                c = (r.NATIVE = "N"),
                p = (r.POLYFILL = "P");
            e.exports = r;
        },
        function (e, n) {
            n.f = Object.getOwnPropertySymbols;
        },
        function (e, n, i) {
            var t = i(21),
                l = Math.max,
                r = Math.min;
            e.exports = function (e, n) {
                var i = t(e);
                return i < 0 ? l(i + n, 0) : r(i, n);
            };
        },
        function (e, n, i) {
            var t = i(14),
                l = i(27),
                r = i(67);
            e.exports = function (e) {
                return function (n, i, o) {
                    var a,
                        c = t(n),
                        p = l(c.length),
                        y = r(o, p);
                    if (e && i != i) {
                        for (; p > y; ) if ((a = c[y++]) != a) return !0;
                    } else
                        for (; p > y; y++)
                            if ((e || y in c) && c[y] === i) return e || y || 0;
                    return !e && -1;
                };
            };
        },
        function (e, n, i) {
            var t = i(28),
                l = i(13).concat("length", "prototype");
            n.f =
                Object.getOwnPropertyNames ||
                function (e) {
                    return t(e, l);
                };
        },
        function (e, n, i) {
            var t = i(0),
                l = i(69),
                r = i(66),
                o = i(3),
                a = t.Reflect;
            e.exports =
                (a && a.ownKeys) ||
                function (e) {
                    var n = l.f(o(e)),
                        i = r.f;
                    return i ? n.concat(i(e)) : n;
                };
        },
        function (e, n, i) {
            var t = i(1),
                l = i(70),
                r = i(31),
                o = i(7);
            e.exports = function (e, n) {
                for (var i = l(n), a = o.f, c = r.f, p = 0; p < i.length; p++) {
                    var y = i[p];
                    t(e, y) || a(e, y, c(n, y));
                }
            };
        },
        function (e, n, i) {
            var t = i(4),
                l = i(30),
                r = "".split;
            e.exports = t(function () {
                return !Object("z").propertyIsEnumerable(0);
            })
                ? function (e) {
                      return "String" == l(e) ? r.call(e, "") : Object(e);
                  }
                : Object;
        },
        function (e, n, i) {
            "use strict";
            var t = {}.propertyIsEnumerable,
                l = Object.getOwnPropertyDescriptor,
                r = l && !t.call({ 1: 2 }, 1);
            n.f = r
                ? function (e) {
                      var n = l(this, e);
                      return !!n && n.enumerable;
                  }
                : t;
        },
        function (e, n, i) {
            "use strict";
            var t = i(32),
                l = i(64),
                r = i(25),
                o = i(57),
                a = i(23),
                c = i(5),
                p = i(29),
                y = i(2),
                h = i(17),
                x = i(9),
                s = i(26),
                u = s.IteratorPrototype,
                d = s.BUGGY_SAFARI_ITERATORS,
                f = y("iterator"),
                g = function () {
                    return this;
                };
            e.exports = function (e, n, i, y, s, v, m) {
                l(i, n, y);
                var w,
                    M,
                    b,
                    z = function (e) {
                        if (e === s && O) return O;
                        if (!d && e in H) return H[e];
                        switch (e) {
                            case "keys":
                            case "values":
                            case "entries":
                                return function () {
                                    return new i(this, e);
                                };
                        }
                        return function () {
                            return new i(this);
                        };
                    },
                    A = n + " Iterator",
                    k = !1,
                    H = e.prototype,
                    V = H[f] || H["@@iterator"] || (s && H[s]),
                    O = (!d && V) || z(s),
                    j = ("Array" == n && H.entries) || V;
                if (
                    (j &&
                        ((w = r(j.call(new e()))),
                        u !== Object.prototype &&
                            w.next &&
                            (h ||
                                r(w) === u ||
                                (o
                                    ? o(w, u)
                                    : "function" != typeof w[f] && c(w, f, g)),
                            a(w, A, !0, !0),
                            h && (x[A] = g))),
                    "values" == s &&
                        V &&
                        "values" !== V.name &&
                        ((k = !0),
                        (O = function () {
                            return V.call(this);
                        })),
                    (h && !m) || H[f] === O || c(H, f, O),
                    (x[n] = O),
                    s)
                )
                    if (
                        ((M = {
                            values: z("values"),
                            keys: v ? O : z("keys"),
                            entries: z("entries"),
                        }),
                        m)
                    )
                        for (b in M) (!d && !k && b in H) || p(H, b, M[b]);
                    else t({ target: n, proto: !0, forced: d || k }, M);
                return M;
            };
        },
        function (e, n) {
            var i;
            i = (function () {
                return this;
            })();
            try {
                i = i || Function("return this")() || (0, eval)("this");
            } catch (e) {
                "object" == typeof window && (i = window);
            }
            e.exports = i;
        },
        function (e, n, i) {
            var t = i(0),
                l = i(36),
                r = t.WeakMap;
            e.exports = "function" == typeof r && /native code/.test(l.call(r));
        },
        function (e, n, i) {
            var t = i(21),
                l = i(20);
            e.exports = function (e, n, i) {
                var r,
                    o,
                    a = String(l(e)),
                    c = t(n),
                    p = a.length;
                return c < 0 || c >= p
                    ? i
                        ? ""
                        : void 0
                    : (r = a.charCodeAt(c)) < 55296 ||
                      r > 56319 ||
                      c + 1 === p ||
                      (o = a.charCodeAt(c + 1)) < 56320 ||
                      o > 57343
                    ? i
                        ? a.charAt(c)
                        : r
                    : i
                    ? a.slice(c, c + 2)
                    : o - 56320 + ((r - 55296) << 10) + 65536;
            };
        },
        function (e, n, i) {
            "use strict";
            var t = i(77),
                l = i(37),
                r = i(74),
                o = l.set,
                a = l.getterFor("String Iterator");
            r(
                String,
                "String",
                function (e) {
                    o(this, {
                        type: "String Iterator",
                        string: String(e),
                        index: 0,
                    });
                },
                function () {
                    var e,
                        n = a(this),
                        i = n.string,
                        l = n.index;
                    return l >= i.length
                        ? { value: void 0, done: !0 }
                        : ((e = t(i, l, !0)),
                          (n.index += e.length),
                          { value: e, done: !1 });
                }
            );
        },
        function (e, n, i) {
            i(78), i(55);
            var t = i(45);
            e.exports = t.Array.from;
        },
        function (e, n, i) {
            i(79), (e.exports = i(44));
        },
    ]);
});
//# sourceMappingURL=feather.min.js.map

