// This component is a simple example of a custom element that displays a rating card.
// It uses a template to display the rating card and a shadow DOM to encapsulate the styles and content.
// The component is defined using the customElements.define method and is registered with the name "rating-card".

class RatingCard extends HTMLElement {
  constructor() {
    super();
    // Tryed to use closed shadow dom but it just didnt display the component
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["username", "rating", "avatar"];
  }

  async connectedCallback() {
    await this.loadTemplate();
    this.updateContent();
  }

  async loadTemplate() {
    try {
      const response = await fetch("templates/ratingsTemplate.html");
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const template = doc.querySelector("#card-rating");

      if (template) {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      } else {
        console.error("Template not found");
      }
    } catch (error) {
      console.error("Error loading template:", error);
    }
  }

  updateContent() {
    if (!this.shadowRoot) return;

    const avatar = this.shadowRoot.querySelector("#avatar");
    const username = this.shadowRoot.querySelector("#username");
    const ratingScore = this.shadowRoot.querySelector("#rating-score");

    if (avatar) {
      avatar.src =
        this.getAttribute("avatar") || "https://via.placeholder.com/150x150";
      avatar.alt = this.getAttribute("username");
      avatar.onerror = () => {
        avatar.src = "https://via.placeholder.com/150x150";
      };
    }

    if (username) username.textContent = this.getAttribute("username");
    if (ratingScore)
      ratingScore.textContent = `Rating: ${this.getAttribute("rating")}`;
  }
}

customElements.define("rating-card", RatingCard);
