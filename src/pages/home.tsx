import React, { useState } from "react";
import { create } from "zustand";
import { Button, ButtonGroup, TextInput } from "flowbite-react";
import Frame from "../components/frame";
import { NewsletterComponent } from "../components/NewsLetterBuilder";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/loader";

const API_URL = process.env.API_URL;

const useHomePageStore = create((set) => ({
  url: "",
  setUrl: (newUrl: string) => set({ url: newUrl }),
  isLoading: false,
  setIsLoading: (newIsLoading: boolean) => set({ isLoading: newIsLoading }),
  error: "",
  setError: (newError: string) => set({ error: newError }),
  pageData: null as any,
  setPageData: (newPageData: any) => set({ pageData: newPageData }),
  blogImage: null as string | null,
  setBlogImage: (newBlogImage: string | null) =>
    set({ blogImage: newBlogImage }),
}));

interface Section {
  heading: string;
  summary: string;
  key_takeaways: string[];
}

interface PageData {
  source_url: string;
  title: string;
  sections: Section[];
  image_sources: string[];
  image_url: string;
}

interface HomePageStore {
  url: string;
  setUrl: (newUrl: string) => void;
  isLoading: boolean;
  setIsLoading: (newIsLoading: boolean) => void;
  error: string;
  setError: (newError: string) => void;
  blogImage: string | null;
  setBlogImage: (newBlogImage: string | null) => void;
  pageData: PageData;
  setPageData: (newPageData: PageData) => void;
}

function generateNewsletterFormat(pageData: PageData): NewsletterComponent[] {
  const newsletterComponent: NewsletterComponent[] = [];
  if (pageData?.title) {
    newsletterComponent.push({
      id: crypto.randomUUID(),
      type: "heading",
      text: pageData?.title,
      level: 1,
      h1: {
        fontSize: 32,
        fontWeight: 700,
      },
      h2: {
        fontSize: 24,
        fontWeight: 600,
      },
      h3: {
        fontSize: 18,
        fontWeight: 600,
      },
      fontFamily: "Arial, sans-serif",
      color: "#333333",
      alignment: "left",
      fontSize: 24,
      fontWeight: 600,
    });
  }
  if (pageData?.image_url) {
    newsletterComponent.push({
      id: crypto.randomUUID(),
      type: "image",
      src: pageData?.image_url,
      alt: "Image",
      width: "100%",
      height: "auto",
      alignment: "center",
      borderRadius: 0,
    });
  }
  pageData?.sections?.forEach((section) => {
    newsletterComponent.push(
      {
        id: crypto.randomUUID(),
        type: "heading",
        text: section?.heading,
        level: 2,
        h1: {
          fontSize: 32,
          fontWeight: 700,
        },
        h2: {
          fontSize: 24,
          fontWeight: 600,
        },
        h3: {
          fontSize: 18,
          fontWeight: 600,
        },
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left",
        fontSize: 24,
        fontWeight: 600,
      },
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        content: `<ul>${section.key_takeaways
          ?.map((ta) => {
            return `<li>${ta}</li>`;
          })
          .join(" ")}</ul>`,
        fontSize: 16,
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left",
        lineHeight: 1.6,
        backgroundColor: "transparent",
      }
    );
  });
  if (pageData?.source_url) {
    newsletterComponent.push({
      id: crypto.randomUUID(),
      type: "button",
      text: "Read full article",
      href: pageData?.source_url,
      backgroundColor: "#007bff",
      textColor: "#ffffff",
      borderRadius: 4,
      padding: "12px 24px",
      fontSize: 16,
      alignment: "center",
      width: "auto",
    });
  }
  newsletterComponent.push({
    id: crypto.randomUUID(),
    type: "socialLinks",
    platforms: [
      {
        type: "youtube",
        url: "#",
      },
      {
        type: "linkedin",
        url: "#",
      },
      {
        type: "instagram",
        url: "#",
      },
      {
        type: "twitter",
        url: "#",
      },
    ],
    iconSize: 32,
    spacing: 12,
    alignment: "center",
    iconStyle: "circular",
  });
  return newsletterComponent;
}

const HomePage: React.FC = () => {
  const {
    url,
    setUrl,
    isLoading,
    setIsLoading,
    error,
    setError,
    pageData,
    setPageData,
    blogImage,
    setBlogImage,
  } = useHomePageStore((state) => state) as ReturnType<
    typeof useHomePageStore
  > &
    HomePageStore;

  const navigate = useNavigate();

  const [generating, setGenerating] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove "https://" (case-insensitive) from the beginning of the string, if present
    const value = e.target.value.replace(/^https?:\/\//i, "");
    setUrl(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/html-to-image/`, {
        method: "POST",
        body: JSON.stringify({ url: `https://${url}` }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await fetch(
        `${API_URL}/fetch-html-and-convert-to-json/`,
        {
          method: "POST",
          body: JSON.stringify({ url: `https://${url}` }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const imageJson = await response.json();
      const image_url = imageJson?.image_url
        ? imageJson?.image_url
        : "/images/dummyImage.png";
      setBlogImage(image_url ? image_url : "/images/dummyImage.png");

      const responseDataJson = await responseData.json();
      const data = responseDataJson.data;
      // setIsLoading(false);
      setPageData({
        source_url: data?.source_url,
        title: data?.json_data?.title,
        sections: data?.json_data?.sections,
        image_sources: data?.image_sources,
        image_url: image_url,
      });
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred while fetching the blog");
    } finally {
      setIsLoading(false);
    }
  };

  function getDomainFromUrl(url: string) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?([^/]+)/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  function resetState() {
    setPageData(null);
    setBlogImage(null);
    setUrl("");
    setError("");
    setIsLoading(false);
  }

  function generateNewsletterFromContent() {
    resetState();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      navigate(`/newsletter-config/new`, {
        state: {
          campaign: {
            id: Math.random(),
            subject: pageData?.title,
            sent: false,
            created_at: new Date().toLocaleDateString(),
            body: "",
          },
          title: pageData?.title,
          components: generateNewsletterFormat(pageData),
        },
      });
    }, 500);
  }

  if (generating) {
    return <Loader />;
  }

  if (!isLoading && !error && pageData) {
    const domainUrl = `https://${getDomainFromUrl(pageData.source_url)}/`;
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-full w-full">
        <h1 className="text-4xl font-bold">eXec</h1>
        <p className="text-gray-500">
          Your AI-powered digital marketing assistant
        </p>
        <ButtonGroup className="gap-2">
          <Button color="lime" onClick={generateNewsletterFromContent}>
            Generate Newsletter
          </Button>
        </ButtonGroup>
        <div className="mt-6 w-full max-w-5xl">
          <Frame>
            <img
              src={blogImage ? blogImage : "/images/dummyImage.png"}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </Frame>
        </div>
        <div className="flex flex-col gap-4 bg-white rounded-lg p-4 max-w-5xl dark:bg-gray-800 dark:text-white">
          <div key="source_url">
            <span className="font-bold">Source:</span>{" "}
            <Link
              to={pageData.source_url}
              target="_blank"
              referrerPolicy="no-referrer"
            >
              {pageData.source_url}
            </Link>
          </div>
          <div key="title">
            <span className="font-bold">Title:</span> {pageData.title}
          </div>
          <div key="sections">
            <span className="font-bold">Content:</span>{" "}
            <div className="pl-10">
              {pageData.sections.map((section: any, index: number) => (
                <div key={section.heading} className="flex flex-col gap-2 mb-4">
                  <span className="font-bold">
                    {index + 1}. {section.heading}:
                  </span>{" "}
                  <ul className="pl-5">
                    {section.key_takeaways.map((key_takeaway: any) => (
                      <li key={key_takeaway}>
                        <span className="font-bold">-</span> {key_takeaway}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div key="image_sources">
            <span className="font-bold">Images:</span>{" "}
            <div className="flex flex-row gap-2 flex-wrap">
              {pageData.image_sources.map((image_source: any) => {
                let imageUrl = `${image_source}`;
                const imageDomain = getDomainFromUrl(imageUrl);
                if (!imageDomain) {
                  imageUrl = `${domainUrl}${image_source}`;
                }
                return (
                  <div
                    key={image_source}
                    className="flex flex-col gap-2 border-2 border-gray-200 rounded-lg p-2 bg-white dark:border-gray-700 dark:rounded-lg dark:p-2 dark:bg-black"
                    title={imageUrl}
                  >
                    <img
                      src={imageUrl}
                      alt="Image"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-full w-full">
      <h1 className="text-4xl font-bold">eXec</h1>
      <p className="text-gray-500">
        Your AI-powered digital marketing assistant
      </p>
      {isLoading && !error && !pageData && (
        <div className="mt-6 w-full max-w-5xl">
          <Frame loading={isLoading}>
            <img
              src="https://images.unsplash.com/photo-1559854036-2409f22a918a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987"
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </Frame>
        </div>
      )}
      <TextInput
        name="website-url"
        type="url"
        placeholder="Enter your blog or release note url"
        sizing="lg"
        addon={<span className="text-gray-500">https://</span>}
        value={url}
        onChange={handleUrlChange}
        className="w-full md:w-3/4 lg:w-1/2"
        onKeyDown={handleKeyDown}
      />
      <Button
        className="g-recaptcha"
        data-sitekey="your_site_key"
        data-callback="onSubmit"
        pill
        color="lime"
        onClick={handleSubmit}
        disabled={isLoading || !url}
      >
        Start Creating
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default HomePage;
