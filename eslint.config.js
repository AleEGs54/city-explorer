// import { defineConfig } from "eslint/config";
// import globals from "globals";
// import js from "@eslint/js";


// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs}"] },
//   { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
//   { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
//   {
//     "rules": {
//       "no-unused-vars": [
//         "warn",
//         {
//           "argsIgnorePattern": "res|next|^err"
//         }
//       ],
//       "no-console": "warn",
//       "no-param-reassign": [
//         "error",
//         {
//           "props": false
//         }
//       ],
//       "no-shadow": [
//         "error",
//         {
//           "hoist": "all",
//           "allow": ["resolve", "reject", "done", "next", "err", "error"]
//         }
//       ],

//     }
//   }
// ]);