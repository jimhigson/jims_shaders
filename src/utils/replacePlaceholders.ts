/**
 * Replaces placeholders in shader source code with values from a map.
 * Placeholders should be in the format {{PLACEHOLDER_NAME}}
 */
export const replacePlaceholders = (
  shaderSource: string,
  values: Record<string, boolean | number | string>,
): string => {
  return shaderSource.replace(/\{\{(\w+)\}\}/g, (match, placeholder) => {
    if (placeholder in values) {
      const value = values[placeholder];
      // Convert booleans to 0/1 for shader compatibility
      if (typeof value === "boolean") {
        return value ? "1" : "0";
      }
      return String(value);
    }
    // If placeholder not found, leave it unchanged
    console.warn(
      `Shader placeholder {{${placeholder}}} not found in values map`,
    );
    return match;
  });
};
