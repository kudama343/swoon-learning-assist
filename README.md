# Swoon Learning Assist

Live Site: [https://swoon-learning-assist.vercel.app/](https://swoon-learning-assist.vercel.app/)

Swoon Learning Assist is a modern, AI-powered assistant built to enhance the learning experience through intelligent interactions and contextual support. It leverages Cerebras LLM, advanced UI components, and prompt engineering to deliver a seamless conversational experience.

---

## 🧠 Features

- Natural language conversations powered by Cerebras LLM API
- Context-aware prompts for intelligent assistant behavior
- Real-time UI interactions with Radix UI and TailwindCSS
- Responsive design with carousel support, tooltips, dialogs, and more
- Tagging and workboard integration for enhanced task tracking
- Built-in toast and notification system
- Customizable theming with `next-themes`

---

## 🚀 Tech Stack

### Core Technologies

- **React + TypeScript** — For building scalable and maintainable UI components
- **TailwindCSS** — For rapid and customizable styling
- **Radix UI** — For accessible and unstyled headless UI primitives
- **Lucide Icons & MUI Icons** — For beautiful, consistent iconography
- **React Router DOM v7** — For managing client-side routes
- **React Query (TanStack)** — For data fetching and caching
- **Cerebras LLM API** — For natural language understanding and generation
- **Advanced Prompt Engineering** — To structure contextually aware, domain-specific conversations
- **date-fns** — For date formatting and validation
- **React Context or Redux Toolkit** — For global state management
- **Embla Carousel** — For swipeable, responsive carousels
- **Form Handling** — Using `react-hook-form` for better UX

---

## 🧩 LLM Integration Architecture

- **Cerebras API Integration**: API requests to the Cerebras LLM are handled efficiently, with comprehensive error handling and fallback strategies.
- **Context Management**: Conversation history and user-specific state are preserved between prompts to maintain continuity.
- **Prompt Templates**: Structured templates allow differentiated behaviors like task creation, feedback summarization, or lesson generation.
- **Response Parsing**: The LLM’s JSON-like structured outputs are parsed into usable front-end objects (e.g., task cards, date ranges, etc.).

---

## 📦 Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/swoon-learning-assist.git
cd swoon-learning-assist
npm install
