

const marked = require('marked');
const fs = require('fs');

const apiMDFileName = `${process.cwd()}/server/api.md`;
const apiHTMLFileName = `${process.cwd()}/server/api.html`;


const apiMD = fs.readFileSync(apiMDFileName, 'utf-8');
const markdownAPI = marked.parse(apiMD, {
  pedantic: true,
  gfm: true,
  breaks: true,
});

fs.writeFileSync(apiHTMLFileName, markdownAPI);
