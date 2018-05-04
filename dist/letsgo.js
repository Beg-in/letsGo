/*! letsGo | https://letsgojs.com */
(function(e, t) {
    "use strict";
    let i = function() {
        e.console.error.apply(e.console, arguments);
    };
    let n = {};
    let r = 0;
    let l = function(l, u, s, a) {
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
                t = t ? t : "lg-hide";
                return (" " + e.className + " ").indexOf(" " + t + " ") > -1;
            } else if (t.indexOf("=") > -1) {
                t = t.split("=");
                return e.hasAttribute(t[0]) && e.getAttribute(t[0]) === t[1];
            } else {
                return e.hasAttribute(t) && e.getAttribute(t) === "";
            }
        };
        let g = function(e) {
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
        let m = function(e, t, i, n, r, l) {
            let u = i ? "add" : "remove";
            if (r) {
                let r = function() {
                    e.removeEventListener("animationend", r, false);
                    if (i) {
                        e.classList.add(n);
                    }
                    e.classList.remove(n + "-" + u);
                    e.classList.remove(n + "-" + u + "-active");
                    e.classList.remove("lg-animate");
                    f(l);
                };
                e.classList.add("lg-animate");
                e.classList.add(n + "-" + u);
                if (!i) {
                    e.classList.remove(n);
                }
                setTimeout(function() {
                    if (t.transitionDuration !== "0s" || t.animationDuration !== "0s") {
                        e.classList.add(n + "-" + u + "-active");
                        let i = g(t.transitionDuration);
                        let l = g(t.animationDuration) * t.animationIterationCount;
                        let s = Math.ceil(Math.max(i, l) * 1e3);
                        setTimeout(r, s);
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
            let u = n[o].queue[0].modifier;
            let s = null;
            let a = null;
            let f = false;
            if (r.charAt(0) === "#") {
                s = "id";
                r = r.substring(1);
                let n = t.getElementById(r);
                if (n === null) {
                    return i("letsGo: no element of " + s + " '" + r + "' found on page.");
                }
                let o = e.getComputedStyle(n, null);
                if (l === "add" || l === "remove") {
                    if (u.charAt(0) === ".") {
                        a = true;
                        u = u.substring(1);
                    } else if (u.charAt(0) === "#") {
                        u = "id=" + u.substring(1);
                    }
                    if (l === "add") {
                        m(n, o, true, u, a, true);
                    } else if (l === "remove") {
                        m(n, o, false, u, a, true);
                    }
                } else if (l === "toggle") {
                    if (u.charAt(0) === ".") {
                        a = true;
                        u = u.substring(1);
                    } else if (u.charAt(0) === "#") {
                        u = "id=" + u.substring(1);
                    }
                    if (d(n, u, a)) {
                        m(n, o, false, u, a, true);
                    } else {
                        m(n, o, true, u, a, true);
                    }
                }
            } else {
                let n = [];
                if (r.charAt(0) === ".") {
                    s = "class";
                    r = r.substring(1);
                    n = t.getElementsByClassName(r);
                } else {
                    s = "tag";
                    n = t.getElementsByTagName(r);
                }
                if (n.length < 1) {
                    return i("letsGo: no element of " + s + " '" + r + "' found on page.");
                }
                if (l === "add" || l === "remove") {
                    if (u.charAt(0) === ".") {
                        a = true;
                        u = u.substring(1);
                    } else if (u.charAt(0) === "#") {
                        u = "id=" + u.substring(1);
                    }
                    if (l === "add") {
                        for (let t = 0; t < n.length; t++) {
                            let i = e.getComputedStyle(n[t], null);
                            if (t === n.length - 1) {
                                f = true;
                            }
                            m(n[t], i, true, u, a, f);
                        }
                    } else if (l === "remove") {
                        for (let t = 0; t < n.length; t++) {
                            let i = e.getComputedStyle(n[t], null);
                            if (t === n.length - 1) {
                                f = true;
                            }
                            m(n[t], i, false, u, a, f);
                        }
                    }
                } else if (l === "toggle") {
                    if (u.charAt(0) === ".") {
                        a = true;
                        u = u.substring(1);
                    } else if (u.charAt(0) === "#") {
                        u = "id=" + u.substring(1);
                    }
                    for (let t = 0; t < n.length; t++) {
                        let i = e.getComputedStyle(n[t], null);
                        if (t === n.length - 1) {
                            f = true;
                        }
                        if (d(n[t], u, a)) {
                            m(n[t], i, false, u, a, f);
                        } else {
                            m(n[t], i, true, u, a, f);
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
            command: u,
            modifier: s
        });
        if (!n[o].running) {
            n[o].running = true;
            c();
        }
    };
    let u = function(e, t, n) {
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
                modifier: n || ".lg-hide"
            };
        }
    };
    let s = function(e, t) {
        if (e.validated !== true) {}
        l(e.target, e.command, e.modifier, t);
        return s;
    };
    s.add = function(e, t, i) {
        return s(u("add", e, t), i);
    };
    s.remove = function(e, t, i) {
        return s(u("remove", e, t), i);
    };
    s.toggle = function(e, t, i) {
        return s(u("toggle", e, t), i);
    };
    s.show = function(e) {
        return s.remove(e, ".lg-hide");
    };
    s.hide = function(e) {
        return s.add(e, ".lg-hide");
    };
    let a = {};
    a.add = function(e, t) {
        return s.add(e, t, true);
    };
    a.remove = function(e, t) {
        return s.remove(e, t, true);
    };
    a.toggle = function(e, t) {
        return s.toggle(e, t, true);
    };
    a.show = function(e) {
        return s.remove(e, ".lg-hide", true);
    };
    a.hide = function(e) {
        return s.add(e, ".lg-hide", true);
    };
    e.letsgo = a;
})(window, document);