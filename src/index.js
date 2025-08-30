import { generate } from "escodegen";
import * as fs from "fs";

// what our compiler will do
const content = fs.readFileSync("./app.svelte", "utf-8");
const ast = parse(content);
const analysis = analyse(ast);
const js_gen = generate(ast, analysis);

//write the results back to app.js
fs.writeFileSync("./app.js", js_gen, "utf-8");

function parse(content) {
  let i = 0;
  const ast = {};
  ast.html = parseFragments();

  return ast;

  function parseFragments() {
    const fragments = [];
    while (i < content.length) {
      const fragment = parseFragment();
      if (fragment) {
        fragments.push(fragment);
      }
    }
    return fragments;
  }
  function parseFragment() {
    return parseScript() ?? parseElement() ?? parseExpression() ?? parseText();
  }
  function parseScript() {
    if (match("<script>")) {
      eat("<script>");
      const startIndex = i;
      const endIndex = content.indexOf("</script>", i);
      const code = content.slice(startIndex, endIndex);
      //using acorn to parse js
      i = endIndex;
      eat("</script>");
    }
  }
  function parseElement() {}
  function parseAttributeList() {}
  function parseExpression() {}
  function parseText() {}
  function parseJavascript() {}

  //utility for the parser
  function match(str) {
    //slice out the characters and check if it matches
    return content.slice(i, i + str.length) === str;
  }

  function eat(str) {
    //if it does not match then syntax error
    if (match(str)) {
      i += str.length;
    } else {
      throw new Error(`Parse error: expecting "${str}"`);
    }
  }

  //keep of matching until we have read so far
  function readWhileMatching(regex) {
    let startIndex = i;
    while (regex.test(content[i])) {
      i++;
    }
    return content.slice(startIndex, i);
  }
}
function analyse(ast) {}
function generate(ast, analysis) {}
