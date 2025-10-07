# MR - Insurance Brochure Generator 📝

This project is a **Node.js + TypeScript + Express** application for generating and managing insurance brochures.

---

## 🚀 Features
- Built with **Express + TypeScript**
- **Sequelize ORM** for database management
- **Joi** for input validation
- Secure setup with `helmet`, `hpp`, `xss-clean`, and `cors`
- Modular architecture (Controllers, Services, Routes, Middlewares)

---

## 📦 Installation

Clone the repo:
```bash
git clone https://github.com/your-username/mr-insurance-brochure-generator.git
cd mr-insurance-brochure-generator


Install dependencies:

npm install

⚙️ Environment Variables

Create a .env file in the project root:

PORT=3000
NODE_ENV=development
DB_USERNAME=root
DB_PASSWORD=admin@123456
DB_NAME=Brochure_Benerator
HOST_NAME=localhost

FRONTEND_BASE_URL=http://localhost:5173
BACKEND_BASE_URL=http://localhost:3000


▶️ Running the Project
Development Mode (with hot reload)
npm run start:dev

Normal Start (compiled JS)
npm run build
npm start

Start with custom script
npm run start-server

🧪 Linting
npm run lint
npm run lint-fix