import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import { resolveDriverAcceptance } from './services/dispatch.service.js';

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const onlineDrivers = new Map();

// ✅ Ek function — 2 jagah use
const removeDriver = (userId) => {
  const count = onlineDrivers.get(userId);
  if (!count) return;
  count === 1 
    ? onlineDrivers.delete(userId) 
    : onlineDrivers.set(userId, count - 1);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", ({ userId, role }) => {
    socket.join(userId);
    socket.userId = userId;
    socket.role = role;

    if (role === "driver") {
      onlineDrivers.set(userId, (onlineDrivers.get(userId) || 0) + 1);
      console.log("DRIVER ONLINE:", userId);
    }
    console.log("ONLINE DRIVERS:", [...onlineDrivers.keys()]);
  });

  socket.on("driver:location", (data) => {
    io.emit("driver:location", data); // 🟡 baad mein sirf rider ko bhejo
  });

  socket.on("ride:accept", ({ driverId }) => {
    resolveDriverAcceptance(driverId); // ✅ already imported, direct call
  });

  socket.on("driver:offline", ({ userId }) => {
    removeDriver(userId); // ✅ same function
    console.log("Driver manually offline:", userId);
    console.log("ONLINE DRIVERS:", [...onlineDrivers.keys()]);
  });

  socket.on("disconnect", () => {
    if (socket.userId && socket.role === "driver") {
      removeDriver(socket.userId); // ✅ same function
      console.log("Driver offline:", socket.userId);
      console.log("ONLINE DRIVERS:", [...onlineDrivers.keys()]);
    }
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});

export { io, onlineDrivers };
export default server;