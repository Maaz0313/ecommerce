"use client";

import NextLink from "next/link";
import { forwardRef } from "react";
import NProgress from "nprogress";

// Helper function to determine if NProgress should start
function shouldTriggerStartEvent(href: string, clickEvent?: React.MouseEvent) {
  if (!clickEvent) return true;
  
  // Check for modified events (ctrl, alt, shift, etc.)
  const isModifiedEvent = (event: React.MouseEvent): boolean => {
    const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement;
    const target = eventTarget.getAttribute("target");
    return (
      (target && target !== "_self") ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (event.nativeEvent && event.nativeEvent.button === 1)
    );
  };

  if (isModifiedEvent(clickEvent)) return false; // modified events: fallback to browser behaviour

  try {
    const current = window.location;
    const target = new URL(href, current.href);
    
    if (current.origin !== target.origin) return false; // external URL
    if (current.pathname === target.pathname && current.search === target.search) return false; // same URL
    
    return true;
  } catch {
    return false; // invalid URL
  }
}

export const ProgressLink = forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
  function ProgressLink({ href, onClick, ...rest }, ref) {
    const useLink = href && href.startsWith("/");
    
    if (!useLink) {
      return <a href={href} onClick={onClick} {...rest} ref={ref} />;
    }

    return (
      <NextLink
        href={href}
        onClick={(event) => {
          if (shouldTriggerStartEvent(href, event)) {
            NProgress.start();
          }
          if (onClick) onClick(event);
        }}
        {...rest}
        ref={ref}
      />
    );
  }
);

export default ProgressLink;
