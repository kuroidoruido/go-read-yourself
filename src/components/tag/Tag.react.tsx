import type { PropsWithChildren } from "react";
import "./Tag.react.css";

interface TagProps extends PropsWithChildren {
  className?: string;
  onClick?: VoidFunction;
}

export function Tag({ onClick, className, children }: TagProps) {
  return (
    <button
      className={"tag" + (className ? " " + className : "")}
      data-testid="tag"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
