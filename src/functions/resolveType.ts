import {
  SymbolFlags,
  TypeFormatFlags,
  type SourceFile,
  type Type,
} from 'ts-morph';

export const resolveType = (
  sourceFile: SourceFile,
  type: Type,
): string => {
  const typeText = type.getText();

  try {
    // Accéder au compilateur TypeScript sous-jacent
    const compilerType = type.compilerType;
    const typeChecker = sourceFile
      .getProject()
      .getTypeChecker().compilerObject;

    const fullyResolvedTypeText = typeChecker.typeToString(
      compilerType,
      undefined,
      TypeFormatFlags.InTypeAlias |
        TypeFormatFlags.WriteArrayAsGenericType |
        TypeFormatFlags.UseStructuralFallback |
        TypeFormatFlags.NoTruncation |
        TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
        TypeFormatFlags.InElementType,
    );

    // #region Première  tentative: Si le type résolu est structurel
    // contient des objets et aucun import
    if (
      fullyResolvedTypeText !== typeText &&
      !fullyResolvedTypeText.includes('import(') &&
      (fullyResolvedTypeText.includes('{') ||
        fullyResolvedTypeText.length > typeText.length * 1.5)
    ) {
      return fullyResolvedTypeText;
    }
    // #endregion

    // #region Deuxième tentative: résoudre les alias et types importés
    const symbol = compilerType.symbol;

    // Pour les types aliasés (comme TransformArgs)
    if (symbol.flags & SymbolFlags.TypeAlias) {
      const aliasResolvedTypeText = typeChecker.typeToString(
        compilerType,
        undefined,
        TypeFormatFlags.InTypeAlias |
          TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
          TypeFormatFlags.NoTruncation,
      );

      if (
        aliasResolvedTypeText !== typeText &&
        !aliasResolvedTypeText.includes('import(') &&
        aliasResolvedTypeText.includes('{')
      ) {
        return aliasResolvedTypeText;
      }
    }

    // Pour les types importés, essayer de résoudre le symbole aliasé
    if (symbol.flags & SymbolFlags.Alias) {
      const aliasedSymbol = typeChecker.getAliasedSymbol(symbol);
      if (aliasedSymbol && aliasedSymbol !== symbol) {
        const aliasedType = typeChecker.getTypeOfSymbolAtLocation(
          aliasedSymbol,
          aliasedSymbol.declarations?.[0] || sourceFile.compilerNode,
        );

        const resolvedAliasTypeText = typeChecker.typeToString(
          aliasedType,
          undefined,
          TypeFormatFlags.InTypeAlias |
            TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
            TypeFormatFlags.NoTruncation,
        );

        if (
          resolvedAliasTypeText !== typeText &&
          !resolvedAliasTypeText.includes('import(') &&
          resolvedAliasTypeText.includes('{')
        ) {
          return resolvedAliasTypeText;
        }
      }
    }
    // #endregion

    // #region Troisième tentative: type apparent pour révéler la structure cachée
    const apparentType = typeChecker.getApparentType(compilerType);

    const apparentText = typeChecker.typeToString(
      apparentType,
      undefined,
      TypeFormatFlags.InTypeAlias |
        TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
        TypeFormatFlags.UseStructuralFallback |
        TypeFormatFlags.NoTruncation,
    );

    if (
      apparentText !== typeText &&
      !apparentText.includes('import(') &&
      (apparentText.includes('{') ||
        apparentText.length > typeText.length * 1.2)
    ) {
      return apparentText;
    }
    // #endregion

    // #region Quatrième tentative: forcer l'expansion structurelle
    const structuralTypeText = typeChecker.typeToString(
      compilerType,
      undefined,
      TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
        TypeFormatFlags.UseStructuralFallback |
        TypeFormatFlags.InElementType |
        TypeFormatFlags.NoTruncation,
    );

    if (
      structuralTypeText !== typeText &&
      structuralTypeText !== fullyResolvedTypeText &&
      !structuralTypeText.includes('import(') &&
      structuralTypeText.includes('{')
    ) {
      return structuralTypeText;
    }
    // #endregion
  } catch (error) {
    console.warn(
      `Erreur lors de la résolution du type ${typeText} : `,
      error,
    );
  }

  return typeText;
};
