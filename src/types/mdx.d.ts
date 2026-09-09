declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  let MDXComponent: (props: MDXProps) => React.ReactNode;
  export default MDXComponent;
}
