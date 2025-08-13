import { Node, Project, SyntaxKind } from 'ts-morph';
import { findFirstCallExpression } from './findFirstCallExpression';
import { parseObject } from './parseObject';
import { resolveType } from './resolveType';

export const extractFromFile = (project: Project, filePath: string) => {
  const sourceFile = project.addSourceFileAtPath(filePath);

  // Fonction pour résoudre récursivement les types importés en utilisant l'API du compilateur

  return {
    imports: sourceFile.getImportDeclarations().map(imp => ({
      moduleSpecifier: imp.getModuleSpecifierValue(),
      namedImports: imp.getNamedImports().map(named => named.getName()),
    })),

    exports: sourceFile.getExportDeclarations().map(exp => ({
      moduleSpecifier: exp.getModuleSpecifierValue(),
      namedExports: exp.getNamedExports().map(named => named.getName()),
    })),

    types: sourceFile.getTypeAliases().map(type => ({
      name: type.getName(),
      typeParameters: type.getTypeParameters().map(tp => tp.getName()),
      type: type.getTypeNodeOrThrow().getText(),
    })),

    variables: sourceFile.getVariableDeclarations().map(v => {
      const initializer = v.getInitializer();
      let params: any[] = [];
      let firstFunctionName: string | undefined;

      const isCallable1 = Node.isCallExpression(initializer);

      // Fonction pour trouver le premier appel de fonction dans une chaîne

      // Vérifier si l'initializer est un appel de fonction
      if (isCallable1) {
        // Trouver le premier appel de fonction dans la chaîne
        const firstCallExpression = findFirstCallExpression(initializer);

        const isCallable2 = Node.isCallExpression(firstCallExpression);

        if (isCallable2) {
          // Récupérer le nom de la fonction
          const expression = firstCallExpression.getExpression();
          if (expression.getKind() === SyntaxKind.Identifier) {
            firstFunctionName = expression.getText();
          }

          params = firstCallExpression.getArguments().map(arg => {
            if (Node.isCallExpression(arg)) {
              // Si c'est un appel de fonction, extraire le type de retour
              const type = arg.getType();
              return resolveType(sourceFile, type);
            }

            const text = arg.getText();
            return parseObject(text);
          });
        }
      }

      return {
        name: v.getName(),
        // Type node (ce qui est écrit dans le code)
        // Nom de la première fonction appelée
        function: firstFunctionName,
        // Arguments de l'appel de fonction si applicable
        params,
        // Flags du type
      };
    }),

    interfaces: sourceFile.getInterfaces().map(int => ({
      name: int.getName(),
      properties: int.getProperties().map(prop => ({
        name: prop.getName(),
        type: prop.getTypeNodeOrThrow().getText(),
      })),
    })),

    functions: sourceFile.getFunctions().map(func => ({
      name: func.getName(),
      parameters: func.getParameters().map(param => ({
        name: param.getName(),
        type: param.getTypeNode()?.getText(),
      })),
      returnType: func.getReturnTypeNode()?.getText(),
    })),
  };
};
