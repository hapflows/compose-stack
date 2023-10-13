import { requests } from "@/core/requests/requests";
import { useEffect, useState } from "react";

const loadMessage = async (onLoad: (message: string) => void) => {
  const message = await requests.GET<{ message: string }>("/_authenticated");
  onLoad(message.message);
};

export function AuthenticatedMessage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMessage(setMessage);
  }, []);

  return <div>{message}</div>;
}
