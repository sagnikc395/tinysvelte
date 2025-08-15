import { generate } from 'escodegen';
import * as fs from 'fs';

// what our compiler will do 
const content = fs.readFileSync('./app.svelte','utf-8');
const ast = parse(content);
const analysis = analyse(ast);
const js_gen = generate(ast,analysis);

//write the results back to app.js 
fs.writeFileSync('./app.js',js_gen,'utf-8');


function parse(content){}
function analyse(ast){}
function generate(ast,analysis){}