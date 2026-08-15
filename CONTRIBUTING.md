# Contributing to Veritas AI

First off, thank you for considering contributing to Veritas AI! It's people like you that make open source such a wonderful place to learn, inspire, and create.

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please create a GitHub issue. Include:
* A clear description of the bug.
* Steps to reproduce the issue.
* Expected behavior vs. actual behavior.
* Your OS, Node.js, and Electron version (if applicable).

### Suggesting Enhancements
We welcome feature ideas! Open an issue with:
* The goal or problem the enhancement solves.
* A description of how it should work.
* Mockups or screenshots if applicable.

### Pull Requests
We accept contributions via Pull Requests:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Make your changes and write unit tests where appropriate.
4. Run the code quality checks (e.g., `npm run lint`).
5. Commit your changes: `git commit -m "Add some feature"`
6. Push to the branch: `git push origin feature/my-new-feature`
7. Open a Pull Request against the `main` branch.

## Development Setup

### Installing Dependencies
1. Node dependencies:
   ```bash
   npm install
   ```
2. Python dependencies (for backend verification):
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Code Style Guidelines
* **TypeScript/JavaScript**: Follow ES6+ syntax. Ensure there are no linter warnings.
* **CSS**: Use variables from `globals.css` for primary styling, dark themes, and animations.
* **Python**: Follow PEP 8 guidelines.

Thank you for helping keep Veritas AI secure, fast, and original!
