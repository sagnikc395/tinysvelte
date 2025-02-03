import * as acron from 'acorn';

export function parse(content) {
    //i is the pointer to the char of the string, what characters 
    // we are looking at , and what we are trying to parse!
    let i = 0;
    const ast = {};
    ast.html = parseFragments();

    return ast;

    //parser for different nodes of the DOM tree

    function parseFragments() {
        const fragements = [];
        while (i < content.length) {
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
        if (match('<script>')) {
            eat('<script>');
            const startIndex = i;
            const endIndex = content.indexOf('</script>', i);
            const code = content.slice(startIndex, endIndex);
            ast.script = acron.parse(code, { ecmaVersion: 2022 });
            i = endIndex;
            eat('</script>');
        }
    }

    function parseElement() { }

    function parseAttributeList() { }

    function parseAttribute() { }

    function parseExpression() { }

    function parseText() { }

    function parseJS() {

    }


    //helper methods
    //check if the string matches or not  
    function match(str) {
        return content.slice(i, i + str.length) === str;
    }

    //eat -> immediately match for == and ?= , try and advance i and 
    // dont need the previous one.
    function eat(str) {
        if (match(str)) {
            i += str.length;
        } else {
            throw new Error(`Parse Error: expecting: "${str}"`);
        }
    }

    //method to read the characters uptil we match 
    function readWhileMatching(regex) {
        let startIndex = i;
        while (regex.test(content[i])) {
            i++;
        }
        return content.slice(startIndex, i);
    }




}