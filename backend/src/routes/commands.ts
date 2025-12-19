import { Router } from "express";
import db from "croxydb";

const router = Router();

interface Command {
  name: string;
  category: string;
  description: string;
  usage: string;
  examples: string[];
}

router.get("/", (req, res) => {
  const { search, category } = req.query;

  let commands: Command[] = db.get("commands") || [];

  if (search && typeof search === "string") {
    const searchLower = search.toLowerCase();
    commands = commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(searchLower) ||
        cmd.description.toLowerCase().includes(searchLower)
    );
  }

  if (category && typeof category === "string" && category !== "Tümü") {
    commands = commands.filter((cmd) => cmd.category === category);
  }

  res.json(commands);
});

router.get("/categories", (req, res) => {
  const commands: Command[] = db.get("commands") || [];
  const categories = ["Tümü", ...new Set(commands.map((cmd) => cmd.category))];
  res.json(categories);
});

export default router;
