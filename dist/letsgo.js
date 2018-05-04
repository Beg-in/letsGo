/*! letsGo | https://letsgojs.com */
((e, t) => {
    let l = function() {
        e.console.error(...arguments);
    };
    let i = {};
    let r = 0;
    let s = (s, a, n, u) => {
        let o = null;
        let d = e => {
            if (e) {
                i[o].queue.shift();
                if (i[o].queue.length > 0) {
                    c();
                } else {
                    i[o].running = false;
                }
            }
        };
        let f = (e, t, l) => {
            if (!t || l) {
                t = t ? t : "lg-hide";
                return ` ${e.className} `.includes(` ${t} `);
            } else if (t.includes("=")) {
                t = t.split("=");
                return e.hasAttribute(t[0]) && e.getAttribute(t[0]) === t[1];
            } else {
                return e.hasAttribute(t) && e.getAttribute(t) === "";
            }
        };
        let m = e => {
            if (e.includes(",")) {
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
        let g = (e, t, l, i, r, s) => {
            let a = l ? "add" : "remove";
            if (r) {
                let r = () => {
                    e.removeEventListener("animationend", r, false);
                    if (l) {
                        e.classList.add(i);
                    }
                    e.classList.remove(`${i}-${a}`);
                    e.classList.remove(`${i}-${a}-active`);
                    e.classList.remove("lg-animate");
                    d(s);
                };
                e.classList.add("lg-animate");
                e.classList.add(`${i}-${a}`);
                if (!l) {
                    e.classList.remove(i);
                }
                setTimeout(() => {
                    if (t.transitionDuration !== "0s" || t.animationDuration !== "0s") {
                        e.classList.add(`${i}-${a}-active`);
                        let l = m(t.transitionDuration);
                        let s = m(t.animationDuration) * t.animationIterationCount;
                        let n = Math.ceil(Math.max(l, s) * 1e3);
                        setTimeout(r, n);
                        if (t.animationDuration !== "0s") {
                            e.addEventListener("animationend", r, false);
                        }
                    } else {
                        r();
                    }
                }, 0);
            } else {
                if (l) {
                    if (i.includes("=")) {
                        i = i.split("=");
                        e.setAttribute(i[0], i[1]);
                    } else {
                        e.setAttribute(i, "");
                    }
                } else {
                    if (i.includes("=")) {
                        i = i.split("=");
                        e.removeAttribute(i[0]);
                    } else {
                        e.removeAttribute(i);
                    }
                }
                d(s);
            }
        };
        let c = () => {
            let r = i[o].queue[0].target;
            let s = i[o].queue[0].command;
            let a = i[o].queue[0].modifier;
            let n = null;
            let u = null;
            let d = false;
            if (r.charAt(0) === "#") {
                n = "id";
                r = r.substring(1);
                let i = t.getElementById(r);
                if (i === null) {
                    return l(`letsGo: no element of ${n} '${r}' found on page.`);
                }
                let o = e.getComputedStyle(i, null);
                if (s === "add" || s === "remove") {
                    if (a.charAt(0) === ".") {
                        u = true;
                        a = a.substring(1);
                    } else if (a.charAt(0) === "#") {
                        a = `id=${a.substring(1)}`;
                    }
                    if (s === "add") {
                        g(i, o, true, a, u, true);
                    } else if (s === "remove") {
                        g(i, o, false, a, u, true);
                    }
                } else if (s === "toggle") {
                    if (a.charAt(0) === ".") {
                        u = true;
                        a = a.substring(1);
                    } else if (a.charAt(0) === "#") {
                        a = `id=${a.substring(1)}`;
                    }
                    if (f(i, a, u)) {
                        g(i, o, false, a, u, true);
                    } else {
                        g(i, o, true, a, u, true);
                    }
                }
            } else {
                let i = [];
                if (r.charAt(0) === ".") {
                    n = "class";
                    r = r.substring(1);
                    i = t.getElementsByClassName(r);
                } else {
                    n = "tag";
                    i = t.getElementsByTagName(r);
                }
                if (i.length < 1) {
                    return l(`letsGo: no element of ${n} '${r}' found on page.`);
                }
                if (s === "add" || s === "remove") {
                    if (a.charAt(0) === ".") {
                        u = true;
                        a = a.substring(1);
                    } else if (a.charAt(0) === "#") {
                        a = `id=${a.substring(1)}`;
                    }
                    if (s === "add") {
                        for (let t = 0; t < i.length; t++) {
                            let l = e.getComputedStyle(i[t], null);
                            if (t === i.length - 1) {
                                d = true;
                            }
                            g(i[t], l, true, a, u, d);
                        }
                    } else if (s === "remove") {
                        for (let t = 0; t < i.length; t++) {
                            let l = e.getComputedStyle(i[t], null);
                            if (t === i.length - 1) {
                                d = true;
                            }
                            g(i[t], l, false, a, u, d);
                        }
                    }
                } else if (s === "toggle") {
                    if (a.charAt(0) === ".") {
                        u = true;
                        a = a.substring(1);
                    } else if (a.charAt(0) === "#") {
                        a = `id=${a.substring(1)}`;
                    }
                    for (let t = 0; t < i.length; t++) {
                        let l = e.getComputedStyle(i[t], null);
                        if (t === i.length - 1) {
                            d = true;
                        }
                        if (f(i[t], a, u)) {
                            g(i[t], l, false, a, u, d);
                        } else {
                            g(i[t], l, true, a, u, d);
                        }
                    }
                }
            }
        };
        if (u) {
            o = ++r;
            i[o] = {
                running: false,
                queue: []
            };
        }
        o = o || r;
        i[o].queue.push({
            target: s,
            command: a,
            modifier: n
        });
        if (!i[o].running) {
            i[o].running = true;
            c();
        }
    };
    let a = (e, t, i) => {
        if (!t) {
            l("letsGo: missing 'target' parameter");
            return {
                validated: false
            };
        } else if (typeof t !== "string") {
            l("letsGo: 'target' parameter is not a string type");
            return {
                validated: false
            };
        } else if ((e === "add" || e === "remove") && !i) {
            l("letsGo: using 'add' or 'remove' commands must also have a 'modifier' parameter");
            return {
                validated: false
            };
        } else {
            return {
                validated: true,
                command: e,
                target: t,
                modifier: i || ".lg-hide"
            };
        }
    };
    let n = (e, t) => {
        if (e.validated !== true) {}
        s(e.target, e.command, e.modifier, t);
        return n;
    };
    n.add = ((e, t, l) => {
        return n(a("add", e, t), l);
    });
    n.remove = ((e, t, l) => {
        return n(a("remove", e, t), l);
    });
    n.toggle = ((e, t, l) => {
        return n(a("toggle", e, t), l);
    });
    n.show = (e => {
        return n.remove(e, ".lg-hide");
    });
    n.hide = (e => {
        return n.add(e, ".lg-hide");
    });
    let u = {};
    u.add = ((e, t) => n.add(e, t, true));
    u.remove = ((e, t) => n.remove(e, t, true));
    u.toggle = ((e, t) => n.toggle(e, t, true));
    u.show = (e => n.remove(e, ".lg-hide", true));
    u.hide = (e => n.add(e, ".lg-hide", true));
    e.letsGo = u;
})(window, document);