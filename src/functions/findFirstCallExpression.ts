import { Node } from 'ts-morph';

export const findFirstCallExpression = (node: Node): any => {
  const hasExpression = Node.hasExpression(node);
  if (hasExpression) {
    const expression = node.getExpression();

    // Si l'expression est un PropertyAccessExpression (e.g., createMachine(...).provideOptions)
    if (
      expression &&
      // expression.getKind() === SyntaxKind.PropertyAccessExpression &&
      Node.hasExpression(expression)
    ) {
      // Récursivement chercher dans l'expression de gauche
      // Cast to PropertyAccessExpression to access getExpression()
      return findFirstCallExpression(expression.getExpression());
    }

    // Si c'est un Identifier ou autre, c'est le premier appel
    return node;
  }

  return node;
};
