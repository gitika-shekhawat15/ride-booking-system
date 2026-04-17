import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import { resolveDriverAcceptance } from './services/dispatch.service.js';

const server = http.createServer(app);
const io = new Server(server, { cors: {
  origin: "http://localhost:5173",
  credentials: true
} });
const onlineDrivers = new Map();

const removeDriver = (userId) => {
  const count = onlineDrivers.get(userId);
  if (!count) return;
  count === 1 
    ? onlineDrivers.delete(userId) 
    : onlineDrivers.set(userId, count - 1);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

 socket.on("ride:join", ({ rideId }) => {
  socket.join(rideId);
});

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

  socket.on("driver:location", ({ rideId, location }) => {
  if (socket.role !== "driver") return;

  io.to(rideId).emit("driver:location", location);
});

socket.on("ride:accept", async ({ driverId, rideId }) => {
  try {
    if (socket.userId !== driverId || socket.role !== "driver") {
      return socket.emit("error", "Unauthorized");
    }

    const accepted = await resolveDriverAcceptance(driverId, rideId);

    if (!accepted) {
      socket.emit("ride:accept_failed");
      return;
    }

    socket.join(rideId);

    io.to(rideId).emit("ride:accepted", {
      driverId,
      rideId
    });

  } catch (err) {
    console.error("Accept error:", err.message);
    socket.emit("error", "Something went wrong");
  }
});

  socket.on("driver:offline", ({ userId }) => {
    if (socket.userId !== userId || socket.role !== "driver") return;
    removeDriver(userId); 
    console.log("Driver manually offline:", userId);
    console.log("ONLINE DRIVERS:", [...onlineDrivers.keys()]);
  });

  socket.on("disconnect", () => {
    if (socket.userId && socket.role === "driver") {
      removeDriver(socket.userId); 
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