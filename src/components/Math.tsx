import katex from "katex";
import React from "react";
import "katex/dist/katex.min.css";

interface MathProps {
  formula: string;
  block?: boolean;
}

export function Math({ formula, block = false }: MathProps) {
  try {
    const html = katex.renderToString(formula, {
      displayMode: block,
      throwOnError: false,
    });
    return (
      <span
        className={
          block ? "block my-6 overflow-x-auto text-center" : "inline-block"
        }
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (error) {
    console.error("KaTeX rendering error:", error);
    return <code>{formula}</code>;
  }
}
