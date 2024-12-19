import path from 'path';

const projectRootDir = path.resolve(__dirname);
export default {
  resolve: {
    alias: {
      'htmlcache.js': path.resolve(projectRootDir, '../src'),
    },
  },
  assetsInclude: ['**/*.md'],
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        doc: path.resolve(__dirname, 'doc.html'),
      },
    },
  },
};
