import http from "node:http";
import net from "node:net";

const PROXY_PORT = 5000;
const APP_PORT = 24749;

const server = http.createServer((req, res) => {
  const options = {
    hostname: "127.0.0.1",
    port: APP_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${APP_PORT}` },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", () => {
    res.writeHead(502);
    res.end("App not ready yet");
  });

  req.pipe(proxyReq, { end: true });
});

server.on("upgrade", (req, socket, head) => {
  const conn = net.connect(APP_PORT, "127.0.0.1", () => {
    conn.write(
      `GET ${req.url} HTTP/1.1\r\nHost: localhost:${APP_PORT}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n` +
        Object.entries(req.headers)
          .filter(([k]) => !["host", "connection", "upgrade"].includes(k))
          .map(([k, v]) => `${k}: ${v}`)
          .join("\r\n") +
        "\r\n\r\n"
    );
  });
  conn.write(head);
  socket.pipe(conn);
  conn.pipe(socket);
  socket.on("error", () => conn.destroy());
  conn.on("error", () => socket.destroy());
});

server.listen(PROXY_PORT, "0.0.0.0", () => {
  console.log(`Proxy: port ${PROXY_PORT} → ${APP_PORT}`);
});
