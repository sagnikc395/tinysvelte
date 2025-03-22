export default function generate(ast: any, analysis: any) {
  //figure out the code that we are going to generate
  const code = {
    variables: [],
    create: [],
    update: [],
    destroy: [],
  };

  let counter = 1;

  function traverseAST(
    node: {
      type: any;
      name: string;
      attributes: any[];
      children: any[];
      value: { name: any };
    },
    parnet: string
  ) {
    switch (node.type) {
      case "Element": {
        //create the element and append the child to the parent
        const variableName = `${node.name}_${counter++}`;
        code.variables.push(variableName);
        code.create.push(
          `${variableName} = document.createElement('${node.name}');`
        );
        node.attributes.forEach((attr: any) => {
          traverseAST(attr, variableName);
        });
        node.children.forEach((child: any) => {
          traverseAST(child, variableName);
        });
        code.create.push(`${parent}.appendChild(${variableName})`);
        code.destroy.push(`${parent}.removeChild(${variableName})`);
        break;
      }
      case "Text": {
        const variableName = `txt_${counter++}`;
        code.variables.push(variableName);
        code.create.push(
          `${variableName} = document.createTextNode('${node.value}')`
        );
        code.create.push(`${parent}.appendChild(${variableName})`);
        break;
      }
      case "Attribute": {
        //for event listener in svelte, it has to start with on:
        if (node.name.startsWith("on:")) {
          const eventName = node.name.slice(3);
          const eventHandler = node.value.name;
          code.create.push(
            `${parent}.addEventListener('${eventName}', ${eventHandler});`
          );
          code.destroy.push(
            `${parent}.removeEventListener('${eventName}', ${eventHandler});`
          );
        }
      }
    }
  }

  //return our template out
  return `
    export default function() {
        ${code.variables.map((v) => `let ${v};`).join("\n")},
        const lifecycle = {
            create(target) {
            ${code.create.join("\n")} 
        },
        update(changed){
            ${code.update.join("\n")}
        },
        destroy(){
            ${code.destroy.join("\n")}        
        }
        };
        return lifecycle;
    };
    `;
}
