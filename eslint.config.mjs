import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default [
  { ignores: [".next/**", "node_modules/**", "public/**", ".claude/**", "tour3d/**", "next-env.d.ts"] },
  ...nextVitals,
  ...nextTs,
  {
    // Build-time CommonJS configs and one-off CLI scripts / test mocks are not shipped code.
    files: ["*.config.js", "scripts/**", "**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    // React Compiler advisory rules (eslint-plugin-react-hooks 7): report as warnings, do not block.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
    },
  },
];
