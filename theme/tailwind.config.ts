import parentConfig from "../woonuxt_base/tailwind.config";
import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  // Merge content arrays so both parent and child files are scanned
  content: [...parentConfig.content],
  theme: {
    ...parentConfig.theme,
    extend: {
      ...(parentConfig.theme?.extend ?? {}),
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
        ...(parentConfig.theme?.extend?.fontFamily ?? {}),
      },
    },
  },

  plugins: [
    ...(parentConfig.plugins ?? []),
    // Add more plugins here if needed
  ],
};
