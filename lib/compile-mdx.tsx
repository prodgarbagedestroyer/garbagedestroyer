import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

export async function compileMdx(raw: string): Promise<React.ReactNode> {
  const { default: MDXContent } = await evaluate(raw, {
    ...runtime,
    development: false,
  });

  return <MDXContent />;
}
