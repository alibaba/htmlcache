/* eslint-disable no-param-reassign */
import injectHTMLCacheLoader from './inject-loader';

const dataAttrRegex =
  window?.htmlcache?.dataAttrRegex || / data-[^ "=]+="[^"]*"/gm;
export function storageSense() {
  const list = new Array(localStorage.length)
    .fill(0)
    .map((_, i) => {
      return [
        localStorage.key(i),
        (localStorage.key(i) + localStorage[localStorage.key(i)]).length,
      ];
    })
    .sort((a, b) => b[1] - a[1]);
  const total = list.reduce((p, c) => p + c[1], 0);
  return {
    total,
    message: `${total}|${list
      .slice(0, 10)
      .map((o) => `${o[0]}=${o[1]}`)
      .join('|')}`,
    list,
  };
}
export function replayClick() {
  if (!window.htmlcache) return;
  window.htmlcache.clickInputArr?.forEach?.(({ selector, content }) => {
    const currTarget = document.querySelector(selector);
    if (
      currTarget &&
      currTarget.outerHTML.replace(dataAttrRegex, '') ===
        content.replace(dataAttrRegex, '')
    ) {
      console.log('Click Replayed:', currTarget);
      currTarget.click();
    }
  });
  delete window.htmlcache.clickInputArr;
}

export function removeHtmlCache() {
  if (!(window.htmlcache && window.htmlcache.cacheKey)) return;
  document.querySelector('#root-cached')?.remove?.();
  setTimeout(() => {
    if (window.htmlcache.replayClick) replayClick();
  }, 32);
  localStorage.removeItem(`${window.htmlcache.cacheKey}Compressed`);
  localStorage.removeItem(`${window.htmlcache.cacheKey}StyleCompressed`);
  localStorage.removeItem(`${window.htmlcache.cacheKey}Html`);
  localStorage.removeItem(`${window.htmlcache.cacheKey}Style`);
  localStorage.removeItem(`${window.htmlcache.cacheKey}Valid`);
  localStorage.removeItem(`${window.htmlcache.cacheKey}Timestamp`);
}
export function captureHtmlCache(delay = 10) {
  const isDisabled =
    !window.htmlcache ||
    window.htmlcache?.disabled ||
    new URL(window.location.href).searchParams.get('bizpass_nohtmlcache') ||
    new URL(window.location.href).searchParams.get('nohtmlcache') ||
    (window.htmlcache?.compress &&
      !window.LZString &&
      localStorage.HTMLCacheLoader);
  if (!isDisabled) {
    window.htmlcache.capturing = true;
    injectHTMLCacheLoader();
  }
  setTimeout(() => {
    removeHtmlCache();
    // debugger;
    if (isDisabled) return;
    const setLocalStorage = (key, value) => {
      localStorage[window.htmlcache.cacheKey + key] = value;
    };
    try {
      console.log('captured html');
      let domHtml = document
        .querySelector(window.htmlcache.source)
        .innerHTML.replace(dataAttrRegex, '');
      if (window.htmlcache.firstScreen) {
        domHtml = filterFirstScreen(
          document.querySelector(window.htmlcache.source),
          domHtml,
        );
      }
      console.log('comp', performance.now());
      let domStyle = [...document.styleSheets].reduce(
        (p, sheet) =>
          p +
          [...(sheet.cssRules || sheet.rules)].reduce(
            (p, rule) => p + rule.cssText,
            '',
          ),
        '',
      );
      if (window.htmlcache.batchKey) {
        window.htmlcache.batchHtml = [
          `${window.htmlcache.batchKey}:${Date.now()}:${domHtml}`,
          ...(window.htmlcache.batchHtml || []),
        ]
          .filter((o) => o)
          .slice(0, window.htmlcache.batchSize || 5);
        domHtml = window.htmlcache.batchHtml.join('\0');
      }
      if (window.htmlcache.styleFilter) {
        const splitStyle = (style) => {
          const domStyleBlocks = [];
          const domStyleSplitted = style.split('}');
          let currentBlockStr = '';
          let leftBracketCount = 0;
          let rightBracketCount = 0;
          domStyleSplitted.forEach((o) => {
            leftBracketCount += o.match(/{/gm)?.length || 0;
            rightBracketCount += 1;
            currentBlockStr += `${o}}`;
            if (leftBracketCount === rightBracketCount) {
              domStyleBlocks.push(currentBlockStr);
              leftBracketCount = 0;
              rightBracketCount = 0;
              currentBlockStr = '';
            }
          });
          return domStyleBlocks;
        };
        const domStyleBlocks = splitStyle(domStyle);
        const domStyleBlocksFiltered = domStyleBlocks.filter((o) => {
          const selector = o.split('{')[0].replace(/:[a-zA-Z:-]+/gm, '');
          try {
            if (window.htmlcache.firstScreen) {
              return [...document.querySelectorAll(selector)].some((oo) => {
                return (
                  oo?.dataset?.htmlcacheFirst ||
                  !!oo?.querySelector?.(window.htmlcache.source)
                );
              });
            }
            return !!document.querySelector(selector);
          } catch {
            return true;
          }
        });
        if (
          window.htmlcache.batchKey &&
          window.htmlcache.cacheStyle &&
          window.htmlcache.batchHtml.length > 1
        ) {
          const oldStyleBlocks = splitStyle(window.htmlcache.cacheStyle);
          oldStyleBlocks.forEach((o) => {
            if (
              domStyleBlocks.indexOf(o) >= 0 &&
              domStyleBlocksFiltered.indexOf(o) === -1
            )
              domStyleBlocksFiltered.push(o);
          });
        }
        domStyle = domStyleBlocksFiltered.join('');
        console.log('style-filter', performance.now());
      }
      if (window.htmlcache.compress) {
        setLocalStorage('Compressed', LZString?.compress?.(domHtml));
        setLocalStorage('StyleCompressed', LZString?.compress?.(domStyle));
      } else {
        setLocalStorage('Html', domHtml);
        setLocalStorage('Style', domStyle);
      }
      setLocalStorage(
        'Valid',
        typeof window.htmlcache.validKey === 'function'
          ? window.htmlcache.validKey()
          : window.htmlcache.validKey || '',
      );
      setLocalStorage('Timestamp', Date.now());

      window.htmlcache.on?.captured?.(window.htmlcache.isHit);
    } catch (e) {
      window.htmlcache?.on?.error?.('capture', e);
    }
  }, delay);
}

export function filterFirstScreen(root, html) {
  try {
    const { y } = root.getBoundingClientRect();
    if (y < window.innerHeight) {
      root.setAttribute('data-htmlcache-first', 1);
      root.childNodes.forEach((o) => {
        html = filterFirstScreen(o, html);
      });
    } else {
      html = html.replace(root.innerHTML.replace(dataAttrRegex, ''), '');
    }
  } catch {}
  return html;
}

if (window.htmlcache?.on?.autoCapture) {
  const w = () =>
    setTimeout(() => {
      try {
        window.htmlcache.on.autoCapture() ? captureHtmlCache() : w();
      } catch {
        removeHtmlCache();
      }
    }, 50);
  w();
}
