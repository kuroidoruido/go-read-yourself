import { useEffect, useMemo, useRef, useState } from "react";
import { deepClone } from "../utils/object.util";
import "./PostPreview.react.css";

export interface PostPreviewProps {
  formSelector: string;
}

export function PostPreview({ formSelector }: PostPreviewProps) {
  const { formData } = useFormDataPolling(null, formSelector);
  const iframeUrl = usePreview(formData);
  const iframeRef = useIframeHeightManager(iframeUrl);

  return (
    <div>
      <section className="post-preview">
        <iframe ref={iframeRef} src={iframeUrl}></iframe>
      </section>
    </div>
  );
}

function useFormDataPolling(
  initialValue: NewsEntry | null,
  formSelector: string
) {
  const [formData, setFormData] = useState<NewsEntry | null>(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      const form = document.querySelector<HTMLFormElement>(formSelector);
      const newFormData = Object.fromEntries(
        deepClone(new FormData(form!).entries())
      ) as unknown as NewsEntry;
      if (JSON.stringify(newFormData) !== JSON.stringify(formData)) {
        setFormData(newFormData);
      }
    }, 1_000);

    return () => clearInterval(interval);
  }, [formData]);
  return { formData } as const;
}

function usePreview(formData: NewsEntry | null) {
  return useMemo(
    () =>
      `/preview.html?${new URLSearchParams({
        ...(formData ?? {}),
        content: btoa(encodeURIComponent(formData?.content ?? "")),
        tags: (formData?.tags as unknown as string) ?? "",
        updateDates: "",
        compiled: "",
      }).toString()}`,
    [formData]
  );
}

function useIframeHeightManager(key: string) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function updateIframeHeight() {
    const iframeBodyHeight =
      iframeRef.current?.contentDocument?.body.clientHeight;
    if (iframeBodyHeight) {
      iframeRef.current.height = `${iframeBodyHeight}px`;
    }
  }

  useEffect(() => {
    [0, 500, 1_000, 3_000].forEach((delay) =>
      setTimeout(() => updateIframeHeight(), delay)
    );
  }, [key, iframeRef]);

  return iframeRef;
}
