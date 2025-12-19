import { Router } from "express";
import axios from "axios";
import db from "croxydb";
import { getDiscordUser, getAvatarUrl } from "../services/discordApi";

const router = Router();

router.get("/discord", (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  const scope = "identify guilds";
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri || ""
  )}&response_type=code&scope=${encodeURIComponent(scope)}`;
  res.redirect(authUrl);
});

async function exchangeCodeForToken(code: string, retries = 0): Promise<any> {
  const MAX_RETRIES = 3;
  try {
    const response = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID || "",
        client_secret: process.env.DISCORD_CLIENT_SECRET || "",
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI || "",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (
      (error.response?.status === 429 || error.response?.status === 400) &&
      retries < MAX_RETRIES
    ) {
      const retryAfter = error.response?.data?.retry_after || 2;
      await new Promise((resolve) =>
        setTimeout(resolve, retryAfter * 1000 + 500)
      );
      return exchangeCodeForToken(code, retries + 1);
    }
    throw error;
  }
}

router.get("/discord/callback", async (req, res) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  if (!code || typeof code !== "string") {
    return res.redirect(`${frontendUrl}?error=no_code`);
  }

  try {
    const tokenData = await exchangeCodeForToken(code);

    const { access_token } = tokenData;

    const discordUser = await getDiscordUser(access_token);

    const userData = {
      id: discordUser.id,
      username: discordUser.username,
      globalName: discordUser.global_name || discordUser.username,
      avatar: getAvatarUrl(discordUser),
      createdAt: db.get(`users.${discordUser.id}`)?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    db.set(`users.${discordUser.id}`, userData);

    req.session.userId = discordUser.id;
    req.session.accessToken = access_token;

    res.redirect(frontendUrl);
  } catch (error) {
    console.error("OAuth error:", error);
    res.redirect(`${frontendUrl}?error=oauth_failed`);
  }
});

router.get("/me", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = db.get(`users.${req.session.userId}`);
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ error: "User not found" });
  }

  res.json({
    id: user.id,
    username: user.username,
    name: user.globalName || user.username,
    avatarUrl: user.avatar,
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

export default router;
