import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  pre: ({ children, ...props }) => (
    <pre
      className="overflow-x-auto rounded-md border border-zinc-800 bg-zinc-950 p-4 text-sm leading-relaxed"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-zinc-200"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={`${className ?? ""} font-mono text-sm`} {...props}>
        {children}
      </code>
    );
  },
  h1: ({ children }) => (
    <h1 className="mb-6 mt-10 text-2xl font-semibold tracking-tight text-zinc-100">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-8 text-xl font-semibold tracking-tight text-zinc-200">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-6 text-lg font-medium text-zinc-300">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-zinc-400">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-inside list-disc space-y-1 text-zinc-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-inside list-decimal space-y-1 text-zinc-400">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-zinc-300 underline underline-offset-2 transition-colors hover:text-zinc-100"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-zinc-700 pl-4 italic text-zinc-500">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-zinc-800" />,
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-zinc-800 bg-zinc-900 px-3 py-2 text-left font-medium text-zinc-300">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-zinc-800 px-3 py-2 text-zinc-400">
      {children}
    </td>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
