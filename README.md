# Quiz-App
A lightweight quiz app using HTML, CSS, and Vanilla JS that fetches fresh questions from the Open Trivia DB API. Features timed questions, smooth transitions, score tracking, and a final summary highlighting correct and incorrect answers.

## Features

- **Dynamic Fetching**: Pulls real-time questions from OpenTDB.
- **Customizable Experience**: Select from dozens of categories and multiple difficulty levels.
- **Blitz Timer**: 10-second countdown per question to test your speed.
- **Interactive Review**: Detailed breakdown of your performance at the end of each session.
- **Modern UI**: Built with Plus Jakarta Sans typography and CSS mesh gradients.

## Technology Stack

- **HTML5**: Semantic structure.
- **CSS3**: Custom properties, mesh gradients, glassmorphism, and responsive design.
- **JavaScript (ES6+)**: Fetch API, asynchronous logic, and DOM manipulation.
- **API**: [Open Trivia Database](https://opentdb.com/)

## Getting Started

Since QuizFlow is a client-side application, you don't need to install any heavy dependencies.

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, or Safari).
- An active internet connection (to fetch questions from the API).

### Installation & Running
1. **Clone or Download**: Save the `index.html`, `style.css`, and `script.js` files into the same folder.
2. **Open with Browser**: Double-click `index.html` to launch the app.

Alternatively, if you are using **VS Code**, you can use the **Live Server** extension:
1. Right-click on `index.html`.
2. Select **'Open with Live Server'**.

## How to Play
1. **Configure**: Use the scrollable lists to choose your preferred Category and Difficulty.
2. **Start**: Click "Start Quiz" to begin.
3. **Answer**: You have 10 seconds per question. Click on the option you believe is correct.
4. **Review**: Once the 10 questions are finished, review your correct and incorrect answers on the summary screen.

## File Structure
```
project-folder/
├── src/
    ├── index.html #The core structure and UI views (Home, Game, Results)
    ├── style.css  #Global styles, layout, and animations
    ├── script.js  #Game logic, timer management, and API integration
```
