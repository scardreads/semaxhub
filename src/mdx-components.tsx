import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

function A(props: ComponentPropsWithoutRef<"a">) {
  const href = props.href ?? "";
  const className =
    "text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {props.children}
      </Link>
    );
  }
  return (
    <a
      {...props}
      className={className}
      rel={href.startsWith("http") ? "noopener noreferrer" : props.rel}
      target={href.startsWith("http") ? "_blank" : props.target}
    />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: A,
    h1: (props) => (
      <h1 className="mb-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl" {...props} />
    ),
    h2: (props) => (
      <h2 className="mb-3 mt-10 text-2xl font-semibold tracking-tight text-ink" {...props} />
    ),
    h3: (props) => (
      <h3 className="mb-2 mt-8 text-xl font-semibold text-ink" {...props} />
    ),
    p: (props) => <p className="mb-4 leading-relaxed text-ink" {...props} />,
    ul: (props) => <ul className="mb-4 list-disc space-y-2 pl-5 text-ink" {...props} />,
    ol: (props) => <ol className="mb-4 list-decimal space-y-2 pl-5 text-ink" {...props} />,
    li: (props) => <li className="leading-relaxed" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="my-6 rounded-r-lg border-l-4 border-accent/40 bg-accent-soft px-4 py-3 text-ink"
        {...props}
      />
    ),
    table: (props) => (
      <div className="surface my-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm" {...props} />
      </div>
    ),
    thead: (props) => <thead className="bg-background text-ink" {...props} />,
    th: (props) => <th className="border-b border-border px-3 py-2 font-semibold" {...props} />,
    td: (props) => <td className="border-b border-border px-3 py-2 align-top" {...props} />,
    hr: () => <hr className="my-8 border-border" />,
    strong: (props) => <strong className="font-semibold text-ink" {...props} />,
    code: (props) => (
      <code className="rounded bg-background px-1.5 py-0.5 font-mono text-[0.9em] text-ink" {...props} />
    ),
    ...components,
  };
}
