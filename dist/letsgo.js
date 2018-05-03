/*! letsGo | https://letsgojs.com */
(function(e, t) {
    "use strict";
    let i = function() {
        e.console.error.apply(e.console, arguments);
    };
    let n = {};
    let r = 0;
    let l = function(l, s, u, a) {
        let o = null;
        let f = function(e) {
            if (e) {
                n[o].queue.shift();
                if (n[o].queue.length > 0) {
                    c();
                } else {
                    n[o].running = false;
                }
            }
        };
        let d = function(e, t, i) {
            if (!t || i) {
                t = t ? t : "letsGo-hide";
                return (" " + e.className + " ").indexOf(" " + t + " ") > -1;
            } else if (t.indexOf("=") > -1) {
                t = t.split("=");
                return e.hasAttribute(t[0]) && e.getAttribute(t[0]) === t[1];
            } else {
                return e.hasAttribute(t) && e.getAttribute(t) === "";
            }
        };
        let m = function(e) {
            if (e.indexOf(",") > -1) {
                e = e.split(",");
                for (let t = 0; t < e.length; t++) {
                    e[t] = Number(e[t].slice(0, -1));
                }
                e = Math.max.apply(null, e);
            } else {
                e = Number(e.slice(0, -1));
            }
            return e;
        };
        let g = function(e, t, i, n, r, l) {
            let s = i ? "add" : "remove";
            if (r) {
                let r = function() {
                    e.removeEventListener("animationend", r, false);
                    if (i) {
                        e.classList.add(n);
                    }
                    e.classList.remove(n + "-" + s);
                    e.classList.remove(n + "-" + s + "-active");
                    e.classList.remove("letsGo-animate");
                    f(l);
                };
                e.classList.add("letsGo-animate");
                e.classList.add(n + "-" + s);
                if (!i) {
                    e.classList.remove(n);
                }
                setTimeout(function() {
                    if (t.transitionDuration !== "0s" || t.animationDuration !== "0s") {
                        e.classList.add(n + "-" + s + "-active");
                        let i = m(t.transitionDuration);
                        let l = m(t.animationDuration) * t.animationIterationCount;
                        let u = Math.ceil(Math.max(i, l) * 1e3);
                        setTimeout(r, u);
                        if (t.animationDuration !== "0s") {
                            e.addEventListener("animationend", r, false);
                        }
                    } else {
                        r();
                    }
                }, 0);
            } else {
                if (i) {
                    if (n.indexOf("=") > -1) {
                        n = n.split("=");
                        e.setAttribute(n[0], n[1]);
                    } else {
                        e.setAttribute(n, "");
                    }
                } else {
                    if (n.indexOf("=") > -1) {
                        n = n.split("=");
                        e.removeAttribute(n[0]);
                    } else {
                        e.removeAttribute(n);
                    }
                }
                f(l);
            }
        };
        let c = function() {
            let r = n[o].queue[0].target;
            let l = n[o].queue[0].command;
            let s = n[o].queue[0].modifier;
            let u = null;
            let a = null;
            let f = false;
            if (r.charAt(0) === "#") {
                u = "id";
                r = r.substring(1);
                let n = t.getElementById(r);
                if (n === null) {
                    return i("letsGo: no element of " + u + " '" + r + "' found on page.");
                }
                let o = e.getComputedStyle(n, null);
                if (l === "add" || l === "remove") {
                    if (s.charAt(0) === ".") {
                        a = true;
                        s = s.substring(1);
                    } else if (s.charAt(0) === "#") {
                        s = "id=" + s.substring(1);
                    }
                    if (l === "add") {
                        g(n, o, true, s, a, true);
                    } else if (l === "remove") {
                        g(n, o, false, s, a, true);
                    }
                } else if (l === "toggle") {
                    if (s.charAt(0) === ".") {
                        a = true;
                        s = s.substring(1);
                    } else if (s.charAt(0) === "#") {
                        s = "id=" + s.substring(1);
                    }
                    if (d(n, s, a)) {
                        g(n, o, false, s, a, true);
                    } else {
                        g(n, o, true, s, a, true);
                    }
                }
            } else {
                let n = [];
                if (r.charAt(0) === ".") {
                    u = "class";
                    r = r.substring(1);
                    n = t.getElementsByClassName(r);
                } else {
                    u = "tag";
                    n = t.getElementsByTagName(r);
                }
                if (n.length < 1) {
                    return i("letsGo: no element of " + u + " '" + r + "' found on page.");
                }
                if (l === "add" || l === "remove") {
                    if (s.charAt(0) === ".") {
                        a = true;
                        s = s.substring(1);
                    } else if (s.charAt(0) === "#") {
                        s = "id=" + s.substring(1);
                    }
                    if (l === "add") {
                        for (let t = 0; t < n.length; t++) {
                            let i = e.getComputedStyle(n[t], null);
                            if (t === n.length - 1) {
                                f = true;
                            }
                            g(n[t], i, true, s, a, f);
                        }
                    } else if (l === "remove") {
                        for (let t = 0; t < n.length; t++) {
                            let i = e.getComputedStyle(n[t], null);
                            if (t === n.length - 1) {
                                f = true;
                            }
                            g(n[t], i, false, s, a, f);
                        }
                    }
                } else if (l === "toggle") {
                    if (s.charAt(0) === ".") {
                        a = true;
                        s = s.substring(1);
                    } else if (s.charAt(0) === "#") {
                        s = "id=" + s.substring(1);
                    }
                    for (let t = 0; t < n.length; t++) {
                        let i = e.getComputedStyle(n[t], null);
                        if (t === n.length - 1) {
                            f = true;
                        }
                        if (d(n[t], s, a)) {
                            g(n[t], i, false, s, a, f);
                        } else {
                            g(n[t], i, true, s, a, f);
                        }
                    }
                }
            }
        };
        if (a) {
            o = ++r;
            n[o] = {
                running: false,
                queue: []
            };
        }
        o = o || r;
        n[o].queue.push({
            target: l,
            command: s,
            modifier: u
        });
        if (!n[o].running) {
            n[o].running = true;
            c();
        }
    };
    let s = function(e, t, n) {
        if (!t) {
            i("letsGo: missing 'target' parameter");
            return {
                validated: false
            };
        } else if (typeof t !== "string") {
            i("letsGo: 'target' parameter is not a string type");
            return {
                validated: false
            };
        } else if ((e === "add" || e === "remove") && !n) {
            i("letsGo: using 'add' or 'remove' commands must also have a 'modifier' parameter");
            return {
                validated: false
            };
        } else {
            return {
                validated: true,
                command: e,
                target: t,
                modifier: n || ".letsGo-hide"
            };
        }
    };
    let u = function(e, t) {
        if (e.validated !== true) {}
        l(e.target, e.command, e.modifier, t);
        return u;
    };
    u.add = function(e, t, i) {
        return u(s("add", e, t), i);
    };
    u.remove = function(e, t, i) {
        return u(s("remove", e, t), i);
    };
    u.toggle = function(e, t, i) {
        return u(s("toggle", e, t), i);
    };
    u.show = function(e) {
        return u.remove(e, ".letsGo-hide");
    };
    u.hide = function(e) {
        return u.add(e, ".letsGo-hide");
    };
    let a = {};
    a.add = function(e, t) {
        return u.add(e, t, true);
    };
    a.remove = function(e, t) {
        return u.remove(e, t, true);
    };
    a.toggle = function(e, t) {
        return u.toggle(e, t, true);
    };
    a.show = function(e) {
        return u.remove(e, ".letsGo-hide", true);
    };
    a.hide = function(e) {
        return u.add(e, ".letsGo-hide", true);
    };
    e.letsgo = a;
})(window, document);