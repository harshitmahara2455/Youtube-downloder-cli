import { Command } from "commander";
import { downloadVideo } from "./downloader.js";
import { downloadPlaylist } from "./playlist.js"; // added

export function runCli() {
  const program = new Command();

  program
    .name("yt-dl")
    .description("A simple YouTube video downloader CLI tool")
    .version("0.1.0");

  program
    .command("video <url>")
    .option("-o, --output <file>", "Output file path", "video.mp4")
    .option("-q, --quality <quality>", "high|low|audio", "high")
    .action(async (url, options) => {
      try {
        await downloadVideo(url, options);
      } catch (error) {
        console.error(" Error downloading video:", error.message);
      }
    });

  program
    .command("playlist <playlistUrl>")
    .option("-d, --dir <folder>", "output folder", "./downloads")
    .option("-q, --quality <quality>", "high | low | audio", "high")
    .action(async (playlistUrl, options) => {
      try {
        await downloadPlaylist(playlistUrl, options);
      } catch (error) {
        console.error(" Error downloading playlist:", error.message);
      }
    });


  program.parse();
}
