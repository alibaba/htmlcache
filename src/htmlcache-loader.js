/* eslint-disable */
window.LZString = (function () {
  let r = String.fromCharCode,
    o = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$',
    e = {};

  function t(r, o) {
    if (!e[r]) {
      e[r] = {};
      for (let n = 0; n < r.length; n++) e[r][r.charAt(n)] = n;
    }
    return e[r][o];
  }

  var i = {
    compress: function (o) {
      return i._compress(o, 16, function (o) {
        return r(o);
      });
    },
    _compress: function (r, o, n) {
      if (null == r) return '';
      let e,
        t,
        i,
        s = {},
        u = {},
        a = '',
        p = '',
        c = '',
        l = 2,
        f = 3,
        h = 2,
        d = [],
        m = 0,
        v = 0;
      for (i = 0; i < r.length; i += 1)
        if (
          ((a = r.charAt(i)),
          Object.prototype.hasOwnProperty.call(s, a) ||
            ((s[a] = f++), (u[a] = !0)),
          (p = c + a),
          Object.prototype.hasOwnProperty.call(s, p))
        )
          c = p;
        else {
          if (Object.prototype.hasOwnProperty.call(u, c)) {
            if (c.charCodeAt(0) < 256) {
              for (e = 0; e < h; e++)
                (m <<= 1), v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++;
              for (t = c.charCodeAt(0), e = 0; e < 8; e++)
                (m = (m << 1) | (1 & t)),
                  v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                  (t >>= 1);
            } else {
              for (t = 1, e = 0; e < h; e++)
                (m = (m << 1) | t),
                  v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                  (t = 0);
              for (t = c.charCodeAt(0), e = 0; e < 16; e++)
                (m = (m << 1) | (1 & t)),
                  v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                  (t >>= 1);
            }
            0 == --l && ((l = Math.pow(2, h)), h++), delete u[c];
          } else
            for (t = s[c], e = 0; e < h; e++)
              (m = (m << 1) | (1 & t)),
                v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                (t >>= 1);
          0 == --l && ((l = Math.pow(2, h)), h++),
            (s[p] = f++),
            (c = String(a));
        }
      if ('' !== c) {
        if (Object.prototype.hasOwnProperty.call(u, c)) {
          if (c.charCodeAt(0) < 256) {
            for (e = 0; e < h; e++)
              (m <<= 1), v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++;
            for (t = c.charCodeAt(0), e = 0; e < 8; e++)
              (m = (m << 1) | (1 & t)),
                v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                (t >>= 1);
          } else {
            for (t = 1, e = 0; e < h; e++)
              (m = (m << 1) | t),
                v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                (t = 0);
            for (t = c.charCodeAt(0), e = 0; e < 16; e++)
              (m = (m << 1) | (1 & t)),
                v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                (t >>= 1);
          }
          0 == --l && ((l = Math.pow(2, h)), h++), delete u[c];
        } else
          for (t = s[c], e = 0; e < h; e++)
            (m = (m << 1) | (1 & t)),
              v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
              (t >>= 1);
        0 == --l && ((l = Math.pow(2, h)), h++);
      }
      for (t = 2, e = 0; e < h; e++)
        (m = (m << 1) | (1 & t)),
          v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
          (t >>= 1);
      for (;;) {
        if (((m <<= 1), v == o - 1)) {
          d.push(n(m));
          break;
        }
        v++;
      }
      return d.join('');
    },
    decompress: function (r) {
      return null == r
        ? ''
        : '' == r
          ? null
          : i._decompress(r.length, 32768, function (o) {
              return r.charCodeAt(o);
            });
    },
    _decompress: function (o, n, e) {
      let t,
        i,
        s,
        u,
        a,
        p,
        c,
        l = [],
        f = 4,
        h = 4,
        d = 3,
        m = '',
        v = [],
        g = { val: e(0), position: n, index: 1 };
      for (t = 0; t < 3; t += 1) l[t] = t;
      for (s = 0, a = Math.pow(2, 2), p = 1; p != a; )
        (u = g.val & g.position),
          (g.position >>= 1),
          0 == g.position && ((g.position = n), (g.val = e(g.index++))),
          (s |= (u > 0 ? 1 : 0) * p),
          (p <<= 1);
      switch (s) {
        case 0:
          for (s = 0, a = Math.pow(2, 8), p = 1; p != a; )
            (u = g.val & g.position),
              (g.position >>= 1),
              0 == g.position && ((g.position = n), (g.val = e(g.index++))),
              (s |= (u > 0 ? 1 : 0) * p),
              (p <<= 1);
          c = r(s);
          break;
        case 1:
          for (s = 0, a = Math.pow(2, 16), p = 1; p != a; )
            (u = g.val & g.position),
              (g.position >>= 1),
              0 == g.position && ((g.position = n), (g.val = e(g.index++))),
              (s |= (u > 0 ? 1 : 0) * p),
              (p <<= 1);
          c = r(s);
          break;
        case 2:
          return '';
      }
      for (l[3] = c, i = c, v.push(c); ; ) {
        if (g.index > o) return '';
        for (s = 0, a = Math.pow(2, d), p = 1; p != a; )
          (u = g.val & g.position),
            (g.position >>= 1),
            0 == g.position && ((g.position = n), (g.val = e(g.index++))),
            (s |= (u > 0 ? 1 : 0) * p),
            (p <<= 1);
        switch ((c = s)) {
          case 0:
            for (s = 0, a = Math.pow(2, 8), p = 1; p != a; )
              (u = g.val & g.position),
                (g.position >>= 1),
                0 == g.position && ((g.position = n), (g.val = e(g.index++))),
                (s |= (u > 0 ? 1 : 0) * p),
                (p <<= 1);
            (l[h++] = r(s)), (c = h - 1), f--;
            break;
          case 1:
            for (s = 0, a = Math.pow(2, 16), p = 1; p != a; )
              (u = g.val & g.position),
                (g.position >>= 1),
                0 == g.position && ((g.position = n), (g.val = e(g.index++))),
                (s |= (u > 0 ? 1 : 0) * p),
                (p <<= 1);
            (l[h++] = r(s)), (c = h - 1), f--;
            break;
          case 2:
            return v.join('');
        }
        if ((0 == f && ((f = Math.pow(2, d)), d++), l[c])) m = l[c];
        else {
          if (c !== h) return null;
          m = i + i.charAt(0);
        }
        v.push(m),
          (l[h++] = i + m.charAt(0)),
          (i = m),
          0 == --f && ((f = Math.pow(2, d)), d++);
      }
    },
  };
  return i;
})();
window.getCookie = function (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  let arr = document.cookie.match(reg);
  return arr ? decodeURIComponent(arr[2]) : null;
};
if (window.htmlcache) {
  window.htmlcache = {
    disabled: false,
    compress: true,
    shadow: true,
    styleFilter: true,
    expire: 1000 * 60 * 60 * 24 * 7,
    target: document.body,
    source: '#root',
    ...window.htmlcache,
  };
}
window.htmlcacheLoaded = !0;
!(window.htmlcache && window.htmlcache.capturing) &&
  (function () {
    if (
      !(
        window.htmlcache &&
        window.htmlcache.cacheKey &&
        !window.htmlcache.disabled
      ) ||
      new URL(window.location.href).searchParams.get('bizpass_nohtmlcache') ||
      new URL(window.location.href).searchParams.get('nohtmlcache')
    )
      return;
    let getLocalStorage = (key) => {
      return localStorage[window.htmlcache.cacheKey + key];
    };

    function index(el) {
      return Array.from(el.parentNode.children).indexOf(el);
    }

    function selector(el) {
      let classname =
        el.className.baseVal !== undefined
          ? el.className.baseVal
          : el.className;
      if (typeof classname !== 'string') classname = '';
      let i = el.parentNode && 9 === el.parentNode.nodeType ? -1 : index(el);

      return (
        el.tagName.toLowerCase() +
        (el.id ? '#' + el.id : '') +
        (classname ? classname.trim().replace(/^| +/g, '.') : '') +
        (~i ? ':nth-child(' + (i + 1) + ')' : '')
      );
    }

    function uniq(el, arr) {
      arr = arr && arr.join ? arr : [];
      if (!el) return arr.join(' > ');
      if (9 === el.nodeType) return arr.join(' > ');
      if (1 !== el.nodeType) return arr.join(' > ');
      arr.unshift(selector(el));
      if (el.id) return arr.join(' > ');
      return uniq(el.parentNode, arr);
    }

    try {
      const cacheValid =
        typeof window.htmlcache.validKey === 'function'
          ? window.htmlcache.validKey()
          : window.htmlcache.validKey || '';
      if (
        getLocalStorage('Valid') === cacheValid &&
        getLocalStorage('Timestamp') >= Date.now() - window.htmlcache.expire
      ) {
        if (window.htmlcache.compress) {
          console.log('decomp', performance.now());
          const compressedHtml = getLocalStorage('Compressed');
          const compressedStyle = getLocalStorage('StyleCompressed');
          if (!compressedHtml) return;
          window.htmlcache.cacheHtml = LZString.decompress(compressedHtml);
          window.htmlcache.cacheStyle = LZString.decompress(compressedStyle);
        } else {
          window.htmlcache.cacheHtml = getLocalStorage('Html');
          window.htmlcache.cacheStyle = getLocalStorage('Style');
        }
        if (window.htmlcache.cacheHtml && window.htmlcache.batchKey) {
          // debugger;
          window.htmlcache.batchHtml = window.htmlcache.cacheHtml.split('\0');
          delete window.htmlcache.cacheHtml;
          const index = window.htmlcache.batchHtml.findIndex((o) => {
            const [_, key, timestamp, data] = o.match(/(.*?):(.*?):(.*)/ms);
            if (key === window.htmlcache.batchKey) {
              window.htmlcache.cacheHtml = data;
              return true;
            }
          });
          delete window.htmlcache.batchHtml[index];
        }
        if (!window.htmlcache.cacheHtml) return;
        window.htmlcache.on &&
          window.htmlcache.on.readData &&
          window.htmlcache.on.readData(window.htmlcache);
        let root = document.createElement('div');
        root.id = 'root-cached';
        root.style.position = 'absolute';
        root.style.zIndex = '2000';
        root.style.top = '0';
        root.style.width = '100vw';
        window.htmlcache.target.appendChild(root);
        if (window.htmlcache.shadow) {
          // 由于shadowroot内外选择器不互通，但style内同时包含shadowroot内外元素的样式（body），故直接在内外同时注入样式
          root.innerHTML +=
            '<style>' +
            window.htmlcache.cacheStyle +
            `${window.htmlcache.source}>*{opacity: 0 !important;}</style>`;
          root = document
            .querySelector('#root-cached')
            .attachShadow({ mode: 'open' });
        }
        root.innerHTML =
          window.htmlcache.cacheHtml +
          '<style>' +
          window.htmlcache.cacheStyle +
          `${window.htmlcache.source}>*{opacity: 0 !important;}</style>`;
        console.log('decomp', performance.now());
        const loadingEl = document.querySelector('.ui-icon-loading');
        loadingEl && loadingEl.remove();
        if (window.htmlcache.firstScreen) window.scrollTo(0, 0);
        window.htmlcache.on &&
          window.htmlcache.on.showCache &&
          window.htmlcache.on.showCache(root);
        window.htmlcache.isHit = true;
        window.htmlcache.clickInputArr = [];
        root.addEventListener('click', (e) => {
          window.htmlcache.clickInputArr = [
            {
              selector: uniq(e.target).replace(
                /#root-cached:nth-child\([0-9]+\)/,
                window.htmlcache.source,
              ),
              content: e.target.outerHTML,
            },
          ];
        });
      }
    } catch (e) {
      console.error(e);
      window.htmlcache.on &&
        window.htmlcache.on.error &&
        window.htmlcache.on.error('loader');
      const el = document.querySelector('#root-cached');
      el && el.remove();
    }
  })();
