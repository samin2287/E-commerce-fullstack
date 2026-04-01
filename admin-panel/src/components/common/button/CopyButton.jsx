import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { Button } from "./Button";

export const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant={copied ? "success" : "outline"}
      onClick={handleCopy}
      leftIcon={copied ? <FiCheck /> : <FiCopy />}>
      {copied ? "Copied" : "Copy"}
    </Button>
  );
};
