import { WebSocketServer } from "ws";
import { createWsServer } from "tinybase/synchronizers/synchronizer-ws-server";
import { auth } from "./auth";

const SYNC_PORT = Number(process.env.SYNC_PORT) || 3001;

let wsServer: ReturnType<typeof createWsServer> | null = null;

export function startSyncServer() {
  if (wsServer) return wsServer;

  const wss = new WebSocketServer({
    port: SYNC_PORT,
    verifyClient: async (info, callback) => {
      // Extract token from query string
      const url = new URL(info.req.url || "", `http://localhost:${SYNC_PORT}`);
      const token = url.searchParams.get("token");

      if (!token) {
        callback(false, 401, "Unauthorized");
        return;
      }

      try {
        const session = await auth.api.getSession({
          headers: new Headers({ Authorization: `Bearer ${token}` }),
        });

        if (session) {
          callback(true);
        } else {
          callback(false, 401, "Invalid session");
        }
      } catch {
        callback(false, 401, "Auth error");
      }
    },
  });

  wsServer = createWsServer(wss);

  console.log(`Sync server running on ws://localhost:${SYNC_PORT}`);

  return wsServer;
}
