import * as fs from 'fs';
import { analyze } from 'periscopic';
import { parse } from './parser';


const content = fs.readFileSync('./app.svelte', 'utf-8');
const ast = parse(content);
const analysis = analyze(ast);
const js = generate(ast, analysis);

fs.writeFileSync('./app.js', js, 'utf-8');


function analyse(ast) { }
function generate(ast, analysis) { }