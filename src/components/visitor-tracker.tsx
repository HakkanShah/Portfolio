'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VisitorTracker() {
    const hasNotified = useRef(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        // Prevent double firing in React Strict Mode
        if (hasNotified.current) return;

        // Check if we already notified in this session
        const sessionKey = 'portfolio_visit_notified';
        if (sessionStorage.getItem(sessionKey)) {
            return;
        }

        const notifyVisit = async () => {
            try {
                hasNotified.current = true;

                // Get source from URL (e.g., ?ref=linkedin or ?source=twitter)
                const source = searchParams.get('ref') || searchParams.get('source');

                // Mark as notified immediately to prevent race conditions
                sessionStorage.setItem(sessionKey, 'true');

                await fetch('/api/visit-notify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ source }),
                });
            } catch (error) {
                // Silently fail - don't disturb the user
                console.error('Failed to track visit:', error);
            }
        };

        // Small delay to ensure page load doesn't hang
        const timer = setTimeout(() => {
            notifyVisit();
        }, 2000);

        return () => clearTimeout(timer);
    }, [searchParams]);

    return null; // Render nothing
}
