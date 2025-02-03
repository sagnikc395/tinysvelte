import * as fs from 'fs';
import parse from './parser';
import analyze from './analyze';


const content = fs.readFileSync('./app.svelte', 'utf-8');
const ast = parse(content);
const analysis = analyze(ast);
const js = generate(ast, analysis);

//fs.writeFileSync('./app.js', js, 'utf-8');
fs.writeFileSync('./app.js', js, 'utf-8');


function generate(ast, analysis) { }