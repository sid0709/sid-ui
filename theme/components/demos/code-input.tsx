"use client";

import { Button, CodeInput, HStack, Stack, Text, type CodeInputStatus } from "sid-ui";
import { useState } from "react";

import { Caption, Examples, Preview } from "./shared";

/** The one code every example accepts. */
const DEMO_CODE = "123456";
const CHECK_DELAY_MS = 600;

function randomCode(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

function Roller() {
  const [code, setCode] = useState("482916");
  return (
    <Stack gap={3}>
      <CodeInput label="Rolling code" isLabelHidden size="lg" value={code} onChange={setCode} />
      <HStack gap={2} vAlign="center">
        <Button
          label="Roll a new code"
          variant="primary"
          size="sm"
          onClick={() => setCode(randomCode(6))}
        />
        <Button label="Clear" size="sm" variant="ghost" onClick={() => setCode("")} />
        <Caption>Each drum spins from its old digit to the new one and settles.</Caption>
      </HStack>
    </Stack>
  );
}

export default function CodeInputDemo() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<CodeInputStatus>("default");
  const [isChecking, setIsChecking] = useState(false);
  const [pin, setPin] = useState("");
  const [invite, setInvite] = useState("");

  const check = (entered: string) => {
    setIsChecking(true);
    window.setTimeout(() => {
      setStatus(entered === DEMO_CODE ? "success" : "error");
      setIsChecking(false);
    }, CHECK_DELAY_MS);
  };

  const reset = () => {
    setCode("");
    setStatus("default");
  };

  return (
    <Examples>
      <Preview
        label="Rolling digits"
        description="A typed digit spins up from 0 like a phone’s scroll wheel. Changing one rolls from the old value; a paste staggers across the cells."
        align="start"
      >
        <Roller />
      </Preview>
      <Preview
        label="Verify an email"
        description={`Type ${DEMO_CODE} for the green hop, anything else to shake. Paste works too.`}
        align="start"
      >
        <Stack gap={3}>
          <CodeInput
            label="Verification code"
            value={code}
            onChange={(next) => {
              setCode(next);
              setStatus("default");
            }}
            onComplete={check}
            status={status}
            isDisabled={isChecking}
            hasAutoFocus
            description="Enter the 6-digit code we sent you."
          />
          <HStack gap={2} vAlign="center">
            <Button label="Clear" size="sm" variant="ghost" onClick={reset} />
            <Caption>{isChecking ? "Checking…" : status === "success" ? "Verified" : " "}</Caption>
          </HStack>
        </Stack>
      </Preview>
      <Preview label="Sizes" align="start">
        <Stack gap={3}>
          <CodeInput label="Small" size="sm" value="123" onChange={() => undefined} />
          <CodeInput label="Medium" size="md" value="1234" onChange={() => undefined} />
          <CodeInput label="Large" size="lg" value="12345" onChange={() => undefined} />
        </Stack>
      </Preview>
      <Preview label="Four digits" description="Any length, for PINs." align="start">
        <Stack gap={2}>
          <CodeInput label="PIN" length={4} value={pin} onChange={setPin} />
          <Text type="supporting" color="secondary">
            {pin.length === 4 ? "PIN set" : `${4 - pin.length} to go`}
          </Text>
        </Stack>
      </Preview>
      <Preview label="Letters and digits" description="Shown in capitals." align="start">
        <CodeInput
          label="Invite code"
          length={6}
          charset="alphanumeric"
          value={invite}
          onChange={setInvite}
        />
      </Preview>
      <Preview label="States" align="start">
        <Stack gap={3}>
          <CodeInput label="Wrong code" value="123450" onChange={() => undefined} status="error" />
          <CodeInput label="Verified" value="123456" onChange={() => undefined} status="success" />
          <CodeInput label="Disabled" value="12" onChange={() => undefined} isDisabled />
        </Stack>
      </Preview>
    </Examples>
  );
}
