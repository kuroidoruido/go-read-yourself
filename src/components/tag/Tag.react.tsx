import type { PropsWithChildren } from "react";
import "./Tag.react.css";

interface TagProps extends PropsWithChildren {
  onClick?: VoidFunction;
}

export function Tag({ onClick, children }: TagProps) {
  return (
    <button className="tag" data-testid="tag" type="button" onClick={onClick}>
      {children}
    </button>
  );
}
