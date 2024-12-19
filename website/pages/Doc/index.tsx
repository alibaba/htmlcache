import React, { useEffect, useLayoutEffect, useState } from 'react';
import markdownit from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.min.css';
import './md.css';
import './index.less';
import NavBar from '../../component/NavBar';

const md = markdownit({ html: true });
const navList = [
  { page: 'tutorial', title: '快速上手' },
  { page: 'config', title: '配置对象' },
  { page: 'api', title: 'API' },
  { page: 'practice', title: '最佳实践' },
];

export default function Index() {
  const [rawStr, setRawStr] = useState('');
  const [page, setPage] = useState(
    new URL(location.href).searchParams.get('page') || 'tutorial',
  );
  useEffect(() => {
    const curUrlObj = new URL(location.href);
    curUrlObj.searchParams.set('page', page);
    if (curUrlObj.toString() !== location.href) {
      window.history.replaceState(null, '', curUrlObj.toString());
    }
    import(`../../../docs/${page}.md?raw`).then((m) => setRawStr(m.default));
  }, [page]);
  useLayoutEffect(() => {
    hljs.highlightAll();
  }, [rawStr]);
  return (
    <div className="doc">
      <NavBar />
      <aside className="left-nav">
        {navList.map((item, i) => (
          <div
            className={`nav-item${page === item.page ? ' active' : ''}`}
            key={item.page}
            onClick={() => setPage(item.page)}
          >
            {item.title}
          </div>
        ))}
      </aside>
      <div
        className="left-nav"
        style={{ position: 'unset', border: 'unset' }}
      />
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: md.render(rawStr) }}
      />
    </div>
  );
}
