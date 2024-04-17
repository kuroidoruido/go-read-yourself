import type { PropsWithChildren } from "react";
import "./Tag.react.css";

interface TagProps extends PropsWithChildren {
  className?: string;
  title?: string;
  onClick?: VoidFunction;
}

export function Tag({ onClick, className, title, children }: TagProps) {
  return (
    <button
      title={title}
      className={"tag" + (className ? " " + className : "")}
      data-testid="tag"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
