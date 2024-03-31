import type { PropsWithChildren } from "react";
import "./TagContainer.react.css";

interface TagContainerProps {
  class?: string[];
  "data-testid"?: string;
}

export function TagContainer({
  class: classes = [],
  "data-testid": dataTestid,
  children,
}: PropsWithChildren<TagContainerProps>) {
  return (
    <div
      className={["tag-container", ...classes].join(" ")}
      {...(dataTestid ? { "data-testid": dataTestid } : {})}
    >
      {children}
    </div>
  );
}
