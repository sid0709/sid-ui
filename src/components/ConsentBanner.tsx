import type { ReactNode } from "react";

export interface ConsentBannerProps {
  /** Short heading, e.g. "Cookies on Joined". Also names the region for assistive tech. */
  title: string;
  /** One or two sentences on what is being asked. */
  description: ReactNode;
  /** The choices, most permissive last — usually a secondary and a primary Button. */
  actions: ReactNode;
  /** A quiet link to the full policy, shown under the description. */
  link?: ReactNode;
  /**
   * `fixed` floats above the page at the bottom of the viewport. `inline` sits in
   * the flow, for previews and settings pages that repeat the question.
   */
  placement?: "fixed" | "inline";
}

/**
 * A request for consent that waits for an answer: cookies, tracking, a new terms
 * version. It floats at the bottom of the viewport, a card-width panel on wide
 * screens and an edge-to-edge sheet on phones, and never covers the whole page.
 */
export function ConsentBanner({
  title,
  description,
  actions,
  link,
  placement = "fixed",
}: ConsentBannerProps) {
  return (
    <section
      className={placement === "fixed" ? "os-consent os-consent-fixed" : "os-consent"}
      aria-label={title}
    >
      <div className="os-consent-body">
        <h2 className="os-consent-title">{title}</h2>
        <p className="os-consent-description">{description}</p>
        {link && <div className="os-consent-link">{link}</div>}
      </div>
      <div className="os-consent-actions">{actions}</div>
    </section>
  );
}
