import { spawn } from "child_process";
import cliProgress from "cli-progress";

export async function downloadPlaylist(url, options) {
  console.log(`\n Downloading playlist: ${url}`);
  console.log(` Quality: ${options.quality}`);

  const formatMap = {
    high: "bestvideo+bestaudio",
    low: "worst",
    audio: "bestaudio",
  };

  const format = formatMap[options.quality] || "bestvideo+bestaudio";
  const output = `${options.dir}/%(title)s.%(ext)s`; // yt-dlp replaces placeholders

  return new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", [
      url,
      "-f", format,
      "-o", output,
      "--newline",
    ]);

    let barStarted = false;
    const bar = new cliProgress.SingleBar(
      {
        format: "⬇  [{bar}] {percentage}% | {speed} | ETA: {eta}s",
        barCompleteChar: "█",
        barIncompleteChar: "░",
        hideCursor: true,
      },
      cliProgress.Presets.shades_classic
    );

    proc.stdout.on("data", (data) => {
      const line = data.toString();

      // yt-dlp emits progress lines for each file
      if (line.includes("[download]")) {
        const match = line.match(/(\d+\.\d+)%.*?(\d+\.\d+\w+\/s).*?ETA\s(\d+:\d+)/);
        if (match) {
          const percent = parseFloat(match[1]);
          const speed = match[2];
          const eta = match[3];

          if (!barStarted) {
            bar.start(100, percent, { speed, eta });
            barStarted = true;
          } else {
            bar.update(percent, { speed, eta });
          }
        }
      }

      // when file completes, reset bar for next one
      if (line.includes("Destination:")) {
        if (barStarted) {
          bar.stop();
          barStarted = false;
        }
        console.log(`\n ${line.trim()}`);
      }
    });

    proc.on("close", (code) => {
      if (barStarted) bar.stop();
      if (code === 0) {
        console.log("\n Playlist download complete!");
        resolve();
      } else {
        reject(new Error(`yt-dlp exited with code ${code}`));
      }
    });

    proc.stderr.on("data", (err) => {
      console.error(err.toString());
    });
  });
}
