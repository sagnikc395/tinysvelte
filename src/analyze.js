import * as periscopic from 'periscopic';
import * as estreewalker from 'estree-walker';


export default function analyze(ast) {

    const result = {
        variables: new Set(),
        willChange: new Set(),
        willUseInTemplate: new Set(),
    };

    const { scope: rootScope, map } = periscopic.anayze(ast.script);
    result.variables = new Set(rootScope.declarations.key);
    result.map = map;
    result.rootScope = rootScope;


    let currentScope = rootScope;
    //DFS manner search 
    estreewalker.walk(ast.script, {
        enter(node) {
            if (map.has(node)) {
                currentScope = map.get(node);
            }
        },
        leave(node) {
            if (map.has(node)) {
                currentScope = currentScope.parent;
            }
        }
    });



    return result;
}