import type { ComponentType } from "react";

import CenteredTemplate from "./templates/CenteredTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import EditorialTemplate from "./templates/EditorialTemplate";
import { resolveTemplateKey, type SiteTemplateKey } from "./themes";
import type { PublishedContent, TemplateProps } from "./shared";

export type { PublishedContent } from "./shared";

/**
 * Templates that have been built. A key that resolves to a template not listed
 * here falls back to Classic, so a half-rolled-out template can never render a
 * blank page.
 */
const TEMPLATES: Partial<
  Record<SiteTemplateKey, ComponentType<TemplateProps>>
> = {
  classic: ClassicTemplate,
  centered: CenteredTemplate,
  editorial: EditorialTemplate,
};

/**
 * Renders a published site in whichever template its owner picked. This
 * component emits no markup of its own — the chosen template is the root — so
 * Classic's output is exactly what it was before templates existed.
 */
export default function PublishedSite({
  content,
}: {
  content: PublishedContent;
}) {
  const Template = TEMPLATES[resolveTemplateKey(content._theme)] ?? ClassicTemplate;
  return <Template content={content} />;
}
