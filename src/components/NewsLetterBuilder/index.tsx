import React from "react";
import { NewsletterProvider } from "./context/NewsletterContext";
import { NewsLetterBuilder as Builder } from "./NewsLetterBuilder";
import { NewsletterComponent } from "./types";

// Main export with provider wrapper
export const NewsLetterBuilder: React.FC<{
  newsLetterTitle?: string;
  newsletterComponents: NewsletterComponent[] | null;
}> = ({ newsLetterTitle, newsletterComponents }) => {
  return (
    <NewsletterProvider
      newsLetterTitle={newsLetterTitle}
      newsletterComponents={newsletterComponents || []}
    >
      <Builder />
    </NewsletterProvider>
  );
};

// Named exports for advanced usage
export { NewsletterProvider, useNewsletter } from "./context/NewsletterContext";
export type * from "./types";

export default NewsLetterBuilder;
