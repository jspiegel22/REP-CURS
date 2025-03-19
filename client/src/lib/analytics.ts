import Script from 'next/script';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

interface PageViewOptions {
  page: string;
  title?: string;
}

interface EventOptions {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export function GoogleAnalytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}

export function trackPageView({ page, title }: PageViewOptions) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: page,
      page_title: title,
    });
  }
}

export function trackEvent({ category, action, label, value }: EventOptions) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

export function trackUserEngagement() {
  if (typeof window !== 'undefined') {
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
          trackEvent({
            category: 'Engagement',
            action: 'Scroll Depth',
            label: `${maxScroll}%`,
          });
        }
      }
    });

    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent({
        category: 'Engagement',
        action: 'Time on Page',
        value: timeSpent,
      });
    });

    // Track clicks on important elements
    document.querySelectorAll('a, button').forEach((element) => {
      element.addEventListener('click', () => {
        trackEvent({
          category: 'Interaction',
          action: 'Click',
          label: element.textContent || element.getAttribute('aria-label') || 'Unknown Element',
        });
      });
    });
  }
}

export function trackFormSubmission(formId: string) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', () => {
      trackEvent({
        category: 'Form',
        action: 'Submit',
        label: formId,
      });
    });
  }
}

export function trackSearch(query: string) {
  trackEvent({
    category: 'Search',
    action: 'Query',
    label: query,
  });
}

export function trackError(error: Error, context: string) {
  trackEvent({
    category: 'Error',
    action: context,
    label: error.message,
  });
}

export function trackConversion(conversionId: string, value: number) {
  trackEvent({
    category: 'Conversion',
    action: conversionId,
    value: value,
  });
} 