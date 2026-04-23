import { useState } from "react";

export function Composer({ disabled, onSend }) {
  const [value, setValue] = useState("");

  const submit = (event) => {
    event.preventDefault();

    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    onSend(trimmed);
    setValue("");
  };

  return (
    <form className="composer" onSubmit={submit}>
      <label className="composer-field">
        <span className="sr-only">Type your message</span>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Write a message. Press Enter to send, Shift+Enter for a new line."
          rows={1}
          disabled={disabled}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              submit(event);
            }
          }}
        />
      </label>
      <button type="submit" disabled={disabled || !value.trim()}>
        Send
      </button>
    </form>
  );
}
