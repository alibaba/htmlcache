import React, { useEffect, useLayoutEffect, useState } from 'react';
import './index.less';

export default function NavBar() {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href="/">HTMLCache</a>
      </div>
      <div className="navbar-nav">
        <a href="/">Home</a>
        <a href="/doc.html">Docs</a>
      </div>
    </div>
  );
}
