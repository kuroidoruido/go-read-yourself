import { useEffect, useMemo, useState } from "react";
import { TagContainer } from "./TagContainer.react";
import { Tag } from "./Tag.react";

import "./TagFormField.react.css";
import { isDefined, isNotDefinedOrEmpty } from "../../utils/fp.util";
import { addSeconds } from "date-fns";
import { sortAlphaAsc } from "../../utils/array.util";
import type { TagsAssociation } from "../../services/tags.service";

interface TagFormFieldProps {
  initialValue?: string[];
  knownTags?: string[];
  tagsAssociations?: TagsAssociation;
}

export function TagFormField({
  knownTags = [],
  initialValue = [],
  tagsAssociations = {},
}: TagFormFieldProps = {}) {
  const {
    stateArray: selectedTags,
    pushToState,
    removeFromState,
  } = useSetState<string>(initialValue);
  const [inputValue, setInputValue] = useState("");
  const title = useElementValue({ selector: 'input[name="title"]' });
  const content = useElementValue({ selector: 'textarea[name="content"]' });
  const { filteredKnownTags, suggestions } = useSuggestions({
    title,
    content,
    knownTags,
    inputValue,
    selectedTags,
    tagsAssociations,
  });

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
      setInputValue(filteredKnownTags[0]?.name!);
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
          <Tag
            key={`${tag.type}__${tag.name}`}
            onClick={() => onSelectOne(tag.name)}
            className={"kind-" + tag.type}
            title={tag.hint}
          >
            {tag.name}
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

interface TagSuggestion {
  type: "filtered" | "basic" | "association" | "ai";
  name: string;
  hint?: string;
}

interface UseSuggestionsProps {
  title: string;
  content: string;
  knownTags: string[];
  inputValue: string;
  selectedTags: string[];
  tagsAssociations: TagsAssociation;
}

function useSuggestions({
  title,
  content,
  knownTags,
  inputValue,
  selectedTags,
  tagsAssociations,
}: UseSuggestionsProps) {
  const { filteredKnownTags } = useFilteredKnownTags({ inputValue, knownTags });
  const { basicSuggestions } = useBasicSuggestions({
    title,
    content,
    knownTags,
  });
  const { associationSuggestions } = useAssociationSuggestions({
    tagsAssociations,
    selectedTags,
  });
  const { aiSuggestions } = useAiSuggestions({ selectedTags, title, content });
  const suggestions = (
    inputValue.length > 0
      ? filteredKnownTags
      : [
          ...basicSuggestions,
          ...associationSuggestions,
          ...aiSuggestions,
        ].toSorted(sortAlphaAsc((x) => x.name))
  ).filter((tag) => !selectedTags.includes(tag.name));

  return {
    suggestions: suggestions satisfies TagSuggestion[],
    filteredKnownTags,
  } as const;
}

interface UseFilteredKnownTagsProps {
  knownTags: string[];
  inputValue: string;
}

function useFilteredKnownTags({
  knownTags,
  inputValue,
}: UseFilteredKnownTagsProps) {
  const filteredKnownTags = knownTags
    .filter((tag) =>
      tag.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
    )
    .map((name): TagSuggestion => ({ name, type: "filtered" }));
  return { filteredKnownTags } as const;
}

interface UseBasicSuggestionsProps {
  title: string;
  content: string;
  knownTags: string[];
}

function useBasicSuggestions({
  knownTags,
  title,
  content,
}: UseBasicSuggestionsProps) {
  const basicSuggestions = useMemo(
    () =>
      knownTags
        .filter(
          (tag) =>
            title.toLocaleLowerCase().includes(tag.toLocaleLowerCase()) ||
            content.toLocaleLowerCase().includes(tag.toLocaleLowerCase())
        )
        .map((name): TagSuggestion => ({ name, type: "basic" })),
    [knownTags, title, content]
  );

  return { basicSuggestions } as const;
}

interface UseAssociationSuggestionsProps {
  selectedTags: string[];
  tagsAssociations: TagsAssociation;
}

function useAssociationSuggestions({
  selectedTags,
  tagsAssociations,
}: UseAssociationSuggestionsProps) {
  return {
    associationSuggestions: selectedTags
      .flatMap((t) => tagsAssociations[t])
      .filter(isDefined)
      .filter((tag) => !selectedTags.includes(tag.name))
      .toSorted(sortByScoreDesc())
      .filter(filterDedup((a, b) => a.name === b.name))
      .slice(0, 10)
      .map(
        ({ name, score }): TagSuggestion => ({
          name,
          hint: `score: ${score}`,
          type: "association",
        })
      ),
  } as const;
}

function filterDedup<T>(isEqual: (a: T, b: T) => boolean = (a, b) => a === b) {
  return (x: T, _index: number, all: T[]) => {
    const sameElementFound = all.filter((t) => isEqual(x, t));
    if (sameElementFound.length === 1) {
      return true;
    }
    console.log({ sameElementFound });
    return sameElementFound[0] === x;
  };
}
function sortByScoreDesc<T extends { score: number }>() {
  return ({ score: a }: T, { score: b }: T) => b - a;
}

interface UseAiSuggestionsProps {
  title: string;
  content: string;
  selectedTags: string[];
}

function useAiSuggestions({
  selectedTags,
  title,
  content,
}: UseAiSuggestionsProps) {
  const [aiSuggestions, setAiSuggestions] = useState<TagSuggestion[]>([]);
  const [body, setBody] = useState("");
  const now = new Date().getTime();
  const [waitUntil, setWaitUntil] = useState(0);
  useEffect(() => {
    if (isNotDefinedOrEmpty(title) || isNotDefinedOrEmpty(content)) {
      return;
    }
    const newBody = new URLSearchParams({
      selectedTags: selectedTags.join(","),
      title,
      content: btoa(encodeURIComponent(content)),
    }).toString();
    if (newBody !== body) {
      setBody(newBody);
    }
  }, [selectedTags, title, content]);

  useEffect(() => {
    if (isNotDefinedOrEmpty(body)) {
      return;
    }
    if (now < waitUntil) {
      return;
    }
    setWaitUntil(addSeconds(new Date(now), 30).getTime());
    fetch("/grab-extra-tags-recommandation", {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body,
    })
      .then((res): Promise<{ tags: string[] }> => res.json())
      .then((res) => {
        setAiSuggestions(res.tags.map((name) => ({ name, type: "ai" })));
      });
  }, [body, now, waitUntil]);
  return { aiSuggestions } as const;
}
