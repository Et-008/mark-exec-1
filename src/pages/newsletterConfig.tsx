import React, { useEffect, useState } from "react";
import {
  NewsLetterBuilder,
  NewsletterComponent,
} from "../components/NewsLetterBuilder";
import { useLocation, useParams } from "react-router-dom";
import { Campaign, NewsLetter } from "../types";
import { useGetAccountId } from "../hooks";

const API_URL = process.env.API_URL;

const NewsletterConfig: React.FC = () => {
  const { id } = useParams();

  const location = useLocation();

  const accountId = useGetAccountId();

  // If newsletter generated from crawled data, it will be sent in location.state as { campaign, components }
  const newsletterFromState: {
    title: string;
    campaign: Campaign;
    components: NewsletterComponent[];
  } | null = location.state;

  const [newsletter, setNewsletter] = useState<{
    title: string;
    campaign: Campaign;
    components: NewsletterComponent[];
  } | null>(newsletterFromState ?? null);

  function getAllNewsLetters() {
    fetch(`${API_URL}/newsletters?newsletter_id=${id}`, {
      headers: {
        accountId: accountId,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const newsLetterRes: NewsLetter = data?.newsletters[0];
        if (newsLetterRes) {
          setNewsletter({
            title: newsLetterRes?.title,
            campaign: data.campaign,
            components: JSON.parse(newsLetterRes?.sections),
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setNewsletter(null);
      });
  }

  useEffect(() => {
    if (id && id !== "new") {
      getAllNewsLetters();
    }
  }, [id]);

  return (
    <NewsLetterBuilder
      newsLetterTitle={newsletter?.title}
      newsletterComponents={newsletter?.components || []}
    />
  );
};

export default NewsletterConfig;
