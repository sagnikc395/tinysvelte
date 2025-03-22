import * as acron from "acorn";

export default function parse(content: string | any[]) {
  //i is the pointer to the char of the string, what characters
  // we are looking at , and what we are trying to parse!
  let i = 0;
  const ast = {};
  ast.html = parseFragments();

  return ast;

  //parser for different nodes of the DOM tree

  function parseFragments(condition: (() => boolean) | undefined) {
    const fragements = [];
    while (condition) {
      const fragment = parseFragment();
      if (fragement) {
        fragements.push(fragement);
      }
    }
    return fragements;
  }
  function parseFragment() {
    return parseScript() ?? parseElement() ?? parseExpression() ?? parseText();
  }

  function parseScript() {
    //need to match inside the things in <script></script> tags
    if (match("<script>")) {
      eat("<script>");
      const startIndex = i;
      const endIndex = content.indexOf("</script>", i);
      const code = content.slice(startIndex, endIndex);
      ast.script = acron.parse(code, { ecmaVersion: 2022 });
      i = endIndex;
      eat("</script>");
    }
  }

  function parseElement() {
    if (match("<")) {
      eat("<");
      const tagName = readWhileMatching(/[a-z]/);
      const attributes = parseAttributeList();
      eat(">");
      const endTag = `</${tagName}>`;

      const element = {
        type: "Element",
        name: tagName,
        attributes,
        children: parseFragments(() => match(endTag)),
      };
      eat(endTag);
      return element;
    }
  }

  function parseAttributeList() {
    const attributes = [];
    skipWhiteSpaces();
    while (!match(">")) {
      attributes.push(parseAttribute());
      skipWhiteSpaces();
    }
    return attributes;
  }

  function parseAttribute() {
    //parse the value and eat away the js
    const name = readWhileMatching(/[^=]/);
    eat("={");
    const value = parseJS();
    eat("}=");
    return {
      type: "Attribute",
      name,
      value,
    };
  }

  function parseExpression() {
    //parse js and eat away curly brackets
    if (match("{")) {
      eat("{");
      const expression = parseJS();
      eat("}");
      return {
        type: "Expression",
        expression,
      };
    }
  }

  function parseText() {
    //read any characters that is not </> or {}
    const text = readWhileMatching(/[^<{]/);
    if (text.trim() !== "") {
      return {
        type: "Text",
        value: text,
      };
    }
  }

  function parseJS() {
    const js = acron.parseExpressionAt(content, i, { ecmaVersion: 2022 });
    i = js.end;
    return js;
  }

  //helper methods
  //check if the string matches or not
  function match(str: string | any[]) {
    return content.slice(i, i + str.length) === str;
  }

  //eat -> immediately match for == and ?= , try and advance i and
  // dont need the previous one.
  function eat(str: string | any[]) {
    if (match(str)) {
      i += str.length;
    } else {
      throw new Error(`Parse Error: expecting: "${str}"`);
    }
  }

  //method to read the characters uptil we match
  function readWhileMatching(regex: RegExp) {
    let startIndex = i;
    while (regex.test(content[i])) {
      i++;
    }
    return content.slice(startIndex, i);
  }

  function skipWhiteSpaces() {
    readWhileMatching(/[\s\n]/);
  }
}
