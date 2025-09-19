#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ReflectionKind } from "typedoc";

const ROOT_DIR = process.cwd();
const TEMP_FILE = "/tmp/typedoc-output.json";
const OUTPUT_FILE = join(ROOT_DIR, "src/stories/filterDocs.json");

// Generate TypeDoc JSON
console.log("Extracting type documentation...");
execSync(
  `npx typedoc --json ${TEMP_FILE} --entryPoints src/filters/*.ts --excludePrivate --excludeInternal`,
  { stdio: "inherit", cwd: ROOT_DIR }
);

// Read the generated JSON
const docs = JSON.parse(readFileSync(TEMP_FILE, "utf-8"));

// Extract all exported type documentation
const typeDocs = {};

// Helper to extract type info recursively
function extractTypeInfo(reflection) {
  const info = {
    name: reflection.name,
    kind: reflection.kindString || reflection.kind,
  };

  // Add comment/description if available
  if (reflection.comment) {
    info.description = reflection.comment.summary
      ?.map((part) => part.text)
      .join("");
  }

  // Extract properties for interfaces and type aliases
  if (reflection.type?.declaration?.children) {
    info.properties = {};
    reflection.type.declaration.children.forEach((prop) => {
      const propInfo = {
        name: prop.name,
        optional: prop.flags?.isOptional || false,
      };

      // Get type information
      if (prop.type) {
        if (prop.type.type === "literal") {
          propInfo.type = `${prop.type.value}`;
        } else if (prop.type.type === "union") {
          propInfo.type = prop.type.types?.map(t => t.value || t.name).join(" | ");
        } else {
          propInfo.type = prop.type.name || prop.type.type || "unknown";
        }
      }

      // Get JSDoc comment
      if (prop.comment) {
        propInfo.description = prop.comment.summary
          ?.map((part) => part.text)
          .join("");
      }

      // Get default value
      if (prop.defaultValue) {
        propInfo.defaultValue = prop.defaultValue;
      }

      info.properties[prop.name] = propInfo;
    });
  }

  // For type aliases, also check direct children
  if (reflection.children) {
    info.properties = {};
    reflection.children.forEach((child) => {
      if (child.kind === ReflectionKind.Property) {
        const propInfo = {
          name: child.name,
          optional: child.flags?.isOptional || false,
        };

        if (child.type) {
          propInfo.type = child.type.name || child.type.type || "unknown";
        }

        if (child.comment) {
          propInfo.description = child.comment.summary
            ?.map((part) => part.text)
            .join("");
        }

        info.properties[child.name] = propInfo;
      }
    });
  }

  return info;
}

// Process all exported types
if (docs.children) {
  docs.children.forEach((module) => {
    // Each child is a module, look inside for the actual types
    if (module.children) {
      module.children.forEach((item) => {
        // Extract all exported types (interfaces, type aliases, classes)
        if (
          item.kind === ReflectionKind.Interface ||
          item.kind === ReflectionKind.TypeAlias ||
          item.kind === ReflectionKind.Class
        ) {
          typeDocs[item.name] = extractTypeInfo(item);
        }
      });
    }
  });
}

// Write the extracted documentation
writeFileSync(OUTPUT_FILE, JSON.stringify(typeDocs, null, 2));
console.log(`Documentation extracted to ${OUTPUT_FILE}`);

// Log summary
const typeCount = Object.keys(typeDocs).length;
const propCount = Object.values(typeDocs).reduce(
  (acc, type) => acc + (type.properties ? Object.keys(type.properties).length : 0),
  0
);
console.log(`Extracted ${typeCount} types with ${propCount} total properties`);