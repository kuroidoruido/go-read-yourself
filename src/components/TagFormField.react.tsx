import { useEffect, useMemo, useState } from "react";
import { TagContainer } from "./TagContainer.react";
import { Tag } from "./Tag.react";

interface TagFormFieldProps {
  knownTags?: string[];
}

export function TagFormField({ knownTags = [] }: TagFormFieldProps = {}) {
  const {
    stateArray: selectedTags,
    pushToState,
    removeFromState,
  } = useSetState<string>();
  const [inputValue, setInputValue] = useState("");
  const title = useElementValue({ selector: 'input[name="title"]' });
  const content = useElementValue({ selector: 'textarea[name="content"]' });

  const basicSuggestions = useMemo(
    () =>
      knownTags.filter(
        (tag) =>
          title.toLocaleLowerCase().includes(tag.toLocaleLowerCase()) ||
          content.toLocaleLowerCase().includes(tag.toLocaleLowerCase())
      ),
    [knownTags, title, content]
  );
  const filteredKnownTags = knownTags.filter((tag) =>
    tag.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
  );
  const suggestions = (
    inputValue.length > 0 ? filteredKnownTags : basicSuggestions
  ).filter((tag) => !selectedTags.includes(tag));

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      e.key === "Enter" ||
      (e.key === "Tab" && filteredKnownTags.length > 0 && inputValue.length > 0)
    ) {
      e.preventDefault();
    }
  }
  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSelectOne(inputValue);
    }
    if (e.key === "Tab" && filteredKnownTags.length > 0) {
      setInputValue(filteredKnownTags[0]!);
    }
  }
  function onAddClick() {
    onSelectOne(inputValue);
  }
  function onSelectOne(tag: string) {
    pushToState(tag);
    setInputValue("");
  }

  return (
    <div className="field" style={{ flexDirection: "column" }}>
      <input name="tags" type="hidden" value={selectedTags.join(", ")} />
      <SelectedTags tags={selectedTags} onTagClick={removeFromState} />
      <div className="input-group">
        <input
          name="tags_input"
          type="text"
          style={{ display: "block" }}
          placeholder="Tags"
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          value={inputValue}
        />
        <button type="button" className="btn" onClick={onAddClick}>
          Add
        </button>
      </div>
      <TagContainer class={["suggested-list"]} data-testid="suggested-list">
        Suggestion:
        {suggestions.map((tag) => (
          <Tag key={tag} onClick={() => onSelectOne(tag)}>
            {tag}
          </Tag>
        ))}
      </TagContainer>
    </div>
  );
}

function useSetState<T>(
  initialValue: T[] = [],
  { isEqual = (a: T, b: T) => a === b }: { isEqual?(a: T, b: T): boolean } = {}
) {
  const [state, setState] = useState(new Set(initialValue));

  return {
    state,
    stateArray: [...state],
    setState,
    pushToState: (val: T) => setState(new Set([...state, val])),
    removeFromState: (oldVal: T) =>
      setState(new Set([...state].filter((val) => !isEqual(val, oldVal)))),
  };
}

interface SelectedTagsProps {
  tags: string[];
  onTagClick(tag: string): void;
}

function SelectedTags({ tags, onTagClick }: SelectedTagsProps) {
  return (
    <TagContainer data-testid="selected-tags">
      {tags.map((tag) => (
        <Tag key={tag} onClick={() => onTagClick(tag)}>
          {tag}
        </Tag>
      ))}
    </TagContainer>
  );
}

interface UseElementValueProps {
  selector: string;
}

function useElementValue<
  TElement extends HTMLInputElement | HTMLTextAreaElement
>({ selector }: UseElementValueProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const contentTextArea = document.querySelector<TElement>(selector);
    if (contentTextArea) {
      const listener = (e: FocusEvent) => {
        setValue((e.target as TElement).value ?? "");
      };
      contentTextArea.addEventListener("change", listener as any);
      contentTextArea.addEventListener("keyup", listener as any);
      contentTextArea.addEventListener("blur", listener as any);
      return () => {
        contentTextArea.removeEventListener("change", listener as any);
        contentTextArea.removeEventListener("keyup", listener as any);
        contentTextArea.removeEventListener("blur", listener as any);
      };
    }
    return undefined;
  }, [selector]);
  return value;
}
