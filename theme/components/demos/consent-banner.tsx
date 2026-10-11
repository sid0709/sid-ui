"use client";

import { Button, ConsentBanner, Link, Text } from "sid-ui";
import { useState } from "react";

import { Caption, Examples, Preview } from "./shared";

type Choice = "necessary" | "analytics" | null;

export default function ConsentBannerDemo() {
  const [choice, setChoice] = useState<Choice>(null);
  const [floating, setFloating] = useState(false);

  const actions = (onPick: (next: Exclude<Choice, null>) => void) => (
    <>
      <Button label="Necessary only" variant="secondary" onClick={() => onPick("necessary")} />
      <Button label="Allow analytics" variant="primary" onClick={() => onPick("analytics")} />
    </>
  );

  return (
    <Examples>
      <Preview
        label="Inline"
        description="The same question in the page flow, for a cookies or privacy page that asks again."
      >
        <ConsentBanner
          placement="inline"
          title="Cookies on Joined"
          description="We use necessary cookies to keep you signed in. Analytics cookies help us improve search and stay off unless you allow them."
          link={<Link href="#cookies">Cookie policy</Link>}
          actions={actions(setChoice)}
        />
        <Caption>
          {choice
            ? `Picked: ${choice === "analytics" ? "Allow analytics" : "Necessary only"}.`
            : "No choice yet."}
        </Caption>
      </Preview>

      <Preview
        align="start"
        label="Fixed"
        description="Floats at the bottom of the viewport, card-width on wide screens and edge to edge on phones. It stays until someone answers."
      >
        <Button
          label={floating ? "Hide the banner" : "Show the banner"}
          variant="secondary"
          onClick={() => setFloating((open) => !open)}
        />
        {floating && (
          <ConsentBanner
            title="Cookies on Joined"
            description="Necessary cookies keep you signed in. Analytics stays off unless you allow it."
            link={<Link href="#cookies">Cookie policy</Link>}
            actions={actions(() => setFloating(false))}
          />
        )}
        <Text type="supporting" color="secondary">
          Use it for one question at a time. Notifications and toasts are for news, not for consent.
        </Text>
      </Preview>
    </Examples>
  );
}
