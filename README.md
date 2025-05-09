# 💬 Real-Time Chat Application

A full-stack real-time messaging app supporting both private one-on-one messaging and global chat. Designed for fast, secure, and interactive communication using WebSockets and modern web technologies.

## 🛠️ Tech Stack

**Frontend:**
- React.js
- HTML5, CSS3
- JavaScript
- Socket.IO Client

**Backend:**
- Python
- Flask
- Socket.IO (Flask-SocketIO)
- JWT for authentication

**Other Tools:**
- Flask-CORS
- bcrypt (for password hashing)
- Axios
- React Router

## 🎯 Project Purpose

The purpose of this project is to:
- Demonstrate real-time full-duplex communication between clients
- Provide secure login, registration, and session handling via JWT
- Support both global chat and direct messaging features
- Showcase full-stack development using Flask and React with WebSocket integration

## 🧩 Features

- 🔒 **User Authentication** – Registration, login, JWT-based session handling  
- 💬 **Real-Time Messaging** – Global and one-on-one chat via Socket.IO  
- 📥 **Private Messaging** – Direct chat between specific users  
- 📶 **Online Status** – View who is currently active  
- 🔁 **Account Management** – Password reset, email verification  
- 📱 **Responsive UI** – Fully functional across devices



## ⚙️ Setup Instructions

1. Clone the Repository
```bash
git clone https://github.com/williamfisher9/chat-app-flask-react
cd chat-app-flask-react
```

2. Run the Flask Backend
```bash
cd server
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

3. Run React Frontend
```bash
cd client
npm install
npm start
```

## 🌐 Live Demo
[Link to Live Demo](https://willtechbooth.dev/chatter/)
