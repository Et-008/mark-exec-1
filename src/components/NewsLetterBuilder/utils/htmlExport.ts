import { NewsletterComponent } from "../types";

export const exportToHTML = ({
  title,
  components,
}: {
  title: string;
  components: NewsletterComponent[];
}): string => {
  const componentsHTML = components
    .map((component) => componentToHTML(component))
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; max-width: 600px;">
          <tr>
            <td style="padding: 0;">
              ${componentsHTML}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const socialIconUrls: Record<string, string> = {
  facebook: "https://cdn-icons-png.freepik.com/512/2374/2374418.png",
  twitter: "https://cdn-icons-png.freepik.com/512/3015/3015802.png",
  instagram: "https://cdn-icons-png.freepik.com/512/4782/4782335.png",
  linkedin: "https://cdn-icons-png.freepik.com/512/1400/1400848.png",
  youtube: "https://cdn-icons-png.freepik.com/512/2504/2504965.png",
  github: "https://cdn-icons-png.freepik.com/512/2504/2504911.png",
};

export const componentToHTML = (component: NewsletterComponent): string => {
  switch (component.type) {
    case "text":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 8px; font-family: ${component.fontFamily}; font-size: ${component.fontSize}px; color: ${component.color}; line-height: ${component.lineHeight}; text-align: ${component.alignment};">
              ${component.content}
            </td>
          </tr>
        </table>`;

    case "heading":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 8px;">
              <h${component.level} style="margin: 0; font-family: ${component.fontFamily}; font-size: ${component.fontSize}px; color: ${component.color}; text-align: ${component.alignment}; font-weight: ${component.fontWeight};">
                ${component.text}
              </h${component.level}>
            </td>
          </tr>
        </table>`;

    case "image":
      const imageContent = component.src
        ? `<img src="${component.src}" alt="${component.alt}" width="${component.width}" style="display: block; width: ${component.width}; height: ${component.height}; border-radius: ${component.borderRadius}px; max-width: 100%;" />`
        : "";
      const imageHTML = component.linkUrl
        ? `<a href="${component.linkUrl}">${imageContent}</a>`
        : imageContent;
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 8px; text-align: ${component.alignment};">
              ${imageHTML}
            </td>
          </tr>
        </table>`;

    case "button":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 16px 8px; text-align: ${component.alignment};">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: ${
                component.alignment === "center"
                  ? "0 auto"
                  : component.alignment === "right"
                  ? "0 0 0 auto"
                  : "0"
              };">
                <tr>
                  <td style="border-radius: ${
                    component.borderRadius
                  }px; background-color: ${component.backgroundColor};">
                    <a href="${
                      component.href
                    }" style="display: inline-block; padding: ${
        component.padding
      }; font-family: Arial, sans-serif; font-size: ${
        component.fontSize
      }px; color: ${
        component.textColor
      }; text-decoration: none; border-radius: ${
        component.borderRadius
      }px; font-weight: 600;">
                      ${component.text}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;

    case "divider":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: ${component.marginTop}px 8px ${component.marginBottom}px 8px;">
              <table role="presentation" width="${component.width}" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-top: ${component.thickness}px ${component.style} ${component.color};"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;

    case "spacer":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="height: ${component.height}px; line-height: ${component.height}px; font-size: 0;">&nbsp;</td>
          </tr>
        </table>`;

    case "layout":
      const isVerticalLayout = component.direction === "vertical";
      const numColumns = component.columns.length;

      // Calculate column widths
      const getColWidth = (index: number) => {
        if (component.columnWidths && component.columnWidths[index]) {
          return component.columnWidths[index];
        }
        return `${(100 / numColumns).toFixed(2)}%`;
      };

      if (isVerticalLayout) {
        // Vertical layout: each column becomes a row
        const rowsHTML = component.columns
          .map((column) => {
            const rowContent = column
              .map((comp) => componentToHTML(comp))
              .join("\n");
            return `
              <tr>
                <td style="padding: ${(component.gap || 16) / 2}px 0;">
                  ${rowContent || "<!-- Empty row -->"}
                </td>
              </tr>`;
          })
          .join("\n");
        return `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${
            component.backgroundColor || "transparent"
          };">
            <tr>
              <td style="padding: ${component.padding || "0"};">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  ${rowsHTML}
                </table>
              </td>
            </tr>
          </table>`;
      } else {
        // Horizontal layout: columns side by side
        const columnsHTML = component.columns
          .map((column, index) => {
            const columnContent = column
              .map((comp) => componentToHTML(comp))
              .join("\n");
            return `
              <td valign="top" style="width: ${getColWidth(index)}; padding: ${
              (component.gap || 16) / 2
            }px;">
                ${columnContent || "<!-- Empty column -->"}
              </td>`;
          })
          .join("\n");
        return `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${
            component.backgroundColor || "transparent"
          };">
            <tr>
              <td style="padding: ${component.padding || "0"};">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    ${columnsHTML}
                  </tr>
                </table>
              </td>
            </tr>
          </table>`;
      }

    case "socialLinks":
      if (component.platforms.length === 0) return "";
      const socialIconsHTML = component.platforms
        .map(
          (platform) => `
          <a href="${platform.url}" style="display: inline-block; margin: 0 ${
            component.spacing / 2
          }px;">
            <img src="${socialIconUrls[platform.type]}" alt="${
            platform.type
          }" width="${component.iconSize}" height="${
            component.iconSize
          }" style="display: block; border-radius: ${
            component.iconStyle === "circular" ? "50%" : "8px"
          }; width: ${component.iconSize}px; height: ${
            component.iconSize
          }px;" />
          </a>`
        )
        .join("");
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 16px 8px; text-align: ${component.alignment};">
              ${socialIconsHTML}
            </td>
          </tr>
        </table>`;

    case "paragraph":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 8px; font-family: ${
              component.fontFamily
            }; font-size: ${component.fontSize}px; color: ${
        component.color
      }; line-height: ${component.lineHeight}; text-align: ${
        component.alignment
      }; background-color: ${component.backgroundColor || "transparent"};">
              ${component.content}
            </td>
          </tr>
        </table>`;

    case "html":
      return `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 0;">
              ${component.content}
            </td>
          </tr>
        </table>`;

    default:
      return "";
  }
};
