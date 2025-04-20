# Snap Flash Stories

## Description

A simple React application that allows users to capture photos using their device camera, potentially overlaying weather information, and manage these captured moments.

## Features

*   Camera access and photo capture
*   Weather data display based on user location
*   Dark/Light theme toggling
*   (Planned) Photo saving and management
*   (Planned) Image filters

## Tech Stack

*   **Framework**: React (with Vite)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Components**: shadcn/ui
*   **Icons**: lucide-react
*   **State Management**: React Context API
*   **Hooks**: Custom hooks for weather (`useWeather`), theme (`useTheme`), etc.

## Setup Instructions

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd snap-flash-stories-react
    ```

2.  **Install dependencies:**
    Make sure you have Node.js and npm (or yarn) installed.
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Environment Variables:**
    This project might require environment variables (e.g., for weather APIs). Create a `.env.local` file in the root directory and add any required variables:
    ```
    VITE_WEATHER_API_KEY=your_api_key_here
    ```
    For now, the env is hardcoded for testing purposes.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

5.  **Build for production:**
    ```bash
    npm run build
    # or
    # yarn build
    ```
