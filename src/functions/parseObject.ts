import { Node, Project, SyntaxKind } from 'ts-morph';

export const parseObject = (objString: string): any => {
  try {
    const project = new Project();

    // Créer un fichier temporaire avec l'objet
    const tempFile = project.createSourceFile(
      'temp.ts',
      `
      const obj = ${objString};
      export default obj;
    `,
    );

    // Obtenir la déclaration de variable
    const variableDeclaration = tempFile.getVariableDeclaration('obj');
    if (!variableDeclaration) return null;

    const initializer = variableDeclaration.getInitializer();
    if (
      !initializer ||
      initializer.getKind() !== SyntaxKind.ObjectLiteralExpression
    ) {
      return null;
    }

    // Fonction récursive pour parser l'objet
    const parseNode = (node: Node): any => {
      if (Node.isObjectLiteralExpression(node)) {
        const obj: any = {};
        node.getProperties().forEach((prop: any) => {
          if (Node.isPropertyAssignment(prop)) {
            const name = prop.getName();
            const initializer = prop.getInitializer();
            if (initializer) {
              const value = parseNode(initializer);
              obj[name] = value;
            }
          }
        });
        return obj;
      }

      if (Node.isArrayLiteralExpression(node)) {
        return node
          .getElements()
          .map((element: any) => parseNode(element));
      }

      if (Node.isStringLiteral(node) || Node.isNumericLiteral(node)) {
        return node.getLiteralValue();
      }

      if (Node.isTrueLiteral(node)) {
        return true;
      }

      if (Node.isFalseLiteral(node)) {
        return false;
      }

      if (Node.isNullLiteral(node)) {
        return null;
      }

      if (Node.isIdentifier(node)) {
        return node.getText();
      }

      return node.getText();
    };

    return parseNode(initializer);
  } catch (error) {
    console.error('Erreur avec ts-morph:', error);
    return null;
  }
};
