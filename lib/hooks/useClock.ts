"use client";

import { useCallback, useEffect, useState } from "react";

export function useClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const tick = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  const formatClock = useCallback(() => {
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
      minute: "2-digit",
    });
  }, [time]);

  const formatDate = useCallback(() => {
    return time.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [time]);

  return { time, formatClock, formatDate };
}
