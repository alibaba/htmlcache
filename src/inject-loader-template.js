export default function injectHTMLCacheLoader() {
  if(window.htmlcacheLoaded)return;
  localStorage.HTMLCacheLoader = '/*LOADER*/';
  const t = document.createElement('script');
  t.type = 'text/javascript';
  t.text = localStorage.HTMLCacheLoader;
  document.body.appendChild(t);
}
