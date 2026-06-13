import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { stitch } from "@google/stitch-sdk";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadApiKey() {
  if (process.env.STITCH_API_KEY) {
    return process.env.STITCH_API_KEY;
  }

  const mcpPath = join(process.env.USERPROFILE || process.env.HOME || "", ".cursor", "mcp.json");
  const mcp = JSON.parse(readFileSync(mcpPath, "utf8"));
  return mcp.mcpServers?.stitch?.headers?.["X-Goog-Api-Key"];
}

const projectId = "16389211528983233885";
const screenId = "44f44b42a97d4f138984b058c8d0c33a";

process.env.STITCH_API_KEY = loadApiKey();

const project = stitch.project(projectId);
const screen = await project.getScreen(screenId);
const htmlUrl = await screen.getHtml();
const imageUrl = await screen.getImage();

const outDir = join(root, "docs", "stitch");
mkdirSync(outDir, { recursive: true });

const html = await fetch(htmlUrl).then((r) => r.text());
const image = await fetch(`${imageUrl}=s1280`).then((r) => r.arrayBuffer());

writeFileSync(join(outDir, "dockerize-homepage.html"), html);
writeFileSync(join(outDir, "dockerize-homepage.png"), Buffer.from(image));

const meta = {
  projectId,
  screenId,
  title: "Dockerize Homepage - Space Glow Theme",
  htmlUrl,
  imageUrl,
};
writeFileSync(join(outDir, "dockerize-homepage.json"), JSON.stringify(meta, null, 2));

console.log("Saved docs/stitch/dockerize-homepage.html");
console.log("Saved docs/stitch/dockerize-homepage.png");
