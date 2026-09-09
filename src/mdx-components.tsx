import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

function A(props: ComponentPropsWithoutRef<"a">) {
  const href = props.href ?? "";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className="text-teal-800 underline decoration-teal-700/30 underline-offset-2 hover:decoration-teal-700">
        {props.children}
      </Link>
    );
  }
  return (
    <a
      {...props}
      className="text-teal-800 underline decoration-teal-700/30 underline-offset-2 hover:decoration-teal-700"
      rel={href.startsWith("http") ? "noopener noreferrer" : props.rel}
      target={href.startsWith("http") ? "_blank" : props.target}
    />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: A,
    h1: (props) => (
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-ink mb-4" {...props} />
    ),
    h2: (props) => (
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink mt-10 mb-3" {...props} />
    ),
    h3: (props) => (
      <h3 className="font-serif text-xl font-semibold text-ink mt-8 mb-2" {...props} />
    ),
    p: (props) => <p className="leading-relaxed text-ink/85 mb-4" {...props} />,
    ul: (props) => <ul className="list-disc pl-5 space-y-2 mb-4 text-ink/85" {...props} />,
    ol: (props) => <ol className="list-decimal pl-5 space-y-2 mb-4 text-ink/85" {...props} />,
    li: (props) => <li className="leading-relaxed" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-teal-700/40 bg-teal-50/60 px-4 py-3 my-6 text-ink/80 rounded-r-lg"
        {...props}
      />
    ),
    table: (props) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-stone-200">
        <table className="min-w-full text-sm text-left" {...props} />
      </div>
    ),
    thead: (props) => <thead className="bg-stone-100 text-ink" {...props} />,
    th: (props) => <th className="px-3 py-2 font-semibold border-b border-stone-200" {...props} />,
    td: (props) => <td className="px-3 py-2 border-b border-stone-100 align-top" {...props} />,
    hr: () => <hr className="my-8 border-stone-200" />,
    strong: (props) => <strong className="font-semibold text-ink" {...props} />,
    code: (props) => (
      <code className="rounded bg-stone-100 px-1.5 py-0.5 text-[0.9em] font-mono text-ink" {...props} />
    ),
    ...components,
  };
}
