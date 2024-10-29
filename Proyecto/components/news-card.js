// This component is a simple example of a custom element that displays a news card.
// It uses a template to display the news card and a shadow DOM to encapsulate the styles and content.
// The component is defined using the customElements.define method and is registered with the name "news-card".

class NewsCard extends HTMLElement {
  constructor() {
    super();
    // Tryed to use closed shadow dom but it just didnt display the component
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["title", "description", "image", "url", "publishedAt"];
  }

  // This function is executed when the component is added to the page
  async connectedCallback() {
    await this.loadTemplate();
    this.updateContent();
    this.startDateTracking();
  }

  // This function loads the template for the news card
  async loadTemplate() {
    try {
      const response = await fetch("templates/newsTemplate.html");
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const template = doc.querySelector("#card-new");

      if (template) {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      } else {
        console.error("Template not found");
      }
    } catch (error) {
      console.error("Error loading template:", error);
    }
  }

  // This function updates the content of the news card
  updateContent() {
    if (!this.shadowRoot) return;

    const image = this.shadowRoot.querySelector("#image");
    const title = this.shadowRoot.querySelector("#title");
    const description = this.shadowRoot.querySelector("#description");
    const url = this.shadowRoot.querySelector("#url");

    if (image) {
      image.src =
        this.getAttribute("image") || "https://via.placeholder.com/350x200";
      image.alt = this.getAttribute("title");
      image.onerror = () => {
        image.src = "https://via.placeholder.com/350x200";
      };
    }

    if (title) title.textContent = this.getAttribute("title");
    if (description) description.textContent = this.getAttribute("description");
    if (url) url.href = this.getAttribute("url");
  }

  // This function calculates the number of days since the news was published and updates the date information.
  startDateTracking() {
    // In this case the date is updated every 24 hours because is displayed by days
    const updateDays = () => {
      const publishDate = new Date(this.getAttribute("publishedAt"));
      const now = new Date();
      const days = Math.floor((now - publishDate) / (1000 * 60 * 60 * 24));

      const dateInfo = this.shadowRoot.querySelector("#date-info");
      if (dateInfo) {
        dateInfo.textContent = `Published ${days} days ago`;
      }

      // This event is dispatched to notify that the days have been updated
      this.dispatchEvent(
        new CustomEvent("days-updated", {
          detail: { days },
          bubbles: true,
          composed: true,
        })
      );
    };

    updateDays(); // Update the days when the component is added to the page
    setInterval(updateDays, 86400000); // Update every 24 hours
  }
}

customElements.define("news-card", NewsCard);
