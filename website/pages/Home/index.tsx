import React, { useEffect, useLayoutEffect, useState } from 'react';
import { captureHtmlCache, removeHtmlCache, storageSense } from 'htmlcache.js';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark-dimmed.min.css';
import './index.less';
import NavBar from '../../component/NavBar';

export default function Home() {
  const [isDisabled, setIsDisabled] = useState(
    () => localStorage.getItem('disabled') || false,
  );
  const [storageDetail, setStorageDetail] = useState(() => {
    try {
      return JSON.parse(localStorage.storageDetailObj);
    } catch {
      return undefined;
    }
  });
  useEffect(() => {
    localStorage.storageDetailObj = JSON.stringify(storageDetail);
  }, [storageDetail]);
  useEffect(() => {
    window.htmlcache.on.captured = () => {
      console.log(Object.fromEntries(storageSense().list));
      setStorageDetail(Object.fromEntries(storageSense().list));
    };
  }, []);
  useEffect(() => {
    if (isDisabled) {
      localStorage.setItem('disabled', '1');
      removeHtmlCache();
      setStorageDetail(undefined);
    } else {
      localStorage.removeItem('disabled');
      delete window.htmlcache.disabled;
      captureHtmlCache();
    }
  }, [isDisabled]);
  useLayoutEffect(() => {
    hljs.highlightAll();
  }, []);
  return (
    <div className="header">
      <NavBar />
      <div className="header-content">
        <h1 className="header-title">HTMLCache</h1>
        <p className="header-desc">No more loading/skeleton screens.</p>
        <div className="header-row">
          {!isDisabled ? (
            <div className="header-card">
              <div className="header-card-content">
                <span>
                  <b>HTMLCache is enabled.</b>
                  <br />
                  Refresh to see the difference.
                </span>
                <div
                  className="header-button"
                  onClick={() => {
                    setIsDisabled(true);
                  }}
                >
                  Disable
                </div>
              </div>
            </div>
          ) : (
            <div className="header-card">
              <div className="header-card-content">
                <span>
                  <b>HTMLCache is disabled.</b>
                  <br />
                  Meet the loading spinner again.
                </span>
                <div
                  className="header-button"
                  onClick={() => {
                    setIsDisabled(false);
                  }}
                >
                  Enable
                </div>
              </div>
            </div>
          )}
          <div className="header-card">
            <div className="header-card-content">
              <span>
                <b>Get Started</b>
                <br />
                Try HTMLCache in your own website.
              </span>
              <a className="header-button" href="doc.html">
                Docs
              </a>
            </div>
          </div>
        </div>

        <div className="header-code">
          <pre>
            <code className="language-shell">
              npm install --save htmlcache.js
            </code>
          </pre>
          <pre>
            <code className="language-javascript">
              {
                "// main.js\n// Import lib to inject htmlcache loader and start auto-capture polling.\nimport 'htmlcache.js'"
              }
            </code>
          </pre>
          <pre>
            <code className="language-html">
              {'<!-- Insert before your index.js -->\n<script>\n  // Main Config\n' +
                '  window.htmlcache={\n' +
                "    cacheKey:\'HTMLCacheTestPage\',\n" +
                "    source:\'#your-content-root\',\n" +
                '    on:{\n' +
                '      autoCapture:()=> {\n' +
                "        if (document.querySelector(\'.element-exists-when-loaded\')) return true;\n" +
                '      },\n' +
                '    }\n' +
                '  }\n  // Load the loader and render your cached content\n' +
                "  const t = document.createElement(\'script\');\n" +
                "  t.type = \'text/javascript\';\n" +
                '  t.text = localStorage.HTMLCacheLoader;\n' +
                '  document.body.appendChild(t);\n' +
                '</script>'}
            </code>
          </pre>
        </div>

        <div
          className="header-card header-storage"
          id="header-storage"
          style={{ display: storageDetail ? 'block' : 'none' }}
        >
          <b>Storage Usage:</b>
          <br />
          Loader:{' '}
          <span id="HTMLCacheLoader">
            {((storageDetail?.HTMLCacheLoader * 8) / 1024).toFixed(2)}KB
          </span>
          <br />
          HTML:{' '}
          <span id="HTMLCacheDemoCompressed">
            {((storageDetail?.HTMLCacheDemoCompressed * 8) / 1024).toFixed(2)}
            KB
          </span>
          <br />
          Style:{' '}
          <span id="HTMLCacheDemoStyleCompressed">
            {((storageDetail?.HTMLCacheDemoStyleCompressed * 8) / 1024).toFixed(
              2,
            )}
            KB
          </span>
        </div>
      </div>
    </div>
  );
}
