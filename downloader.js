// playlist.js
import { spawn } from "child_process";
import cliProgress from "cli-progress";

function parseProgress(line) {
  // yt-dlp progress looks like: [download]  23.1% of ... at 1.23MiB/s ETA 00:30
  const match = line.match(/(\d+\.\d+)%.*?(\d+\.\d+\w+\/s).*?ETA\s(\d+:\d+)/);
  if (!match) return null;
  return {
    percent: parseFloat(match[1]),
    speed: match[2],
    eta: match[3],
  };
}

export async function downloadPlaylist(url, options) {
  console.log(`\n📂 Downloading playlist: ${url}`);
  console.log(`📥 Quality: ${options.quality}`);

  const formatMap = {
    high: "bestvideo+bestaudio",
    low: "worst",
    audio: "bestaudio",
  };

  const format = formatMap[options.quality] || "bestvideo+bestaudio";
  const output = `${options.dir}/%(title)s.%(ext)s`; // yt-dlp auto handles filenames

  return new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", [
      url,
      "-f",
      format,
      "-o",
      output,
      "--newline",
    ]);

    let barStarted = false;
    const bar = new cliProgress.SingleBar(
      {
        format: "⬇️  [{bar}] {percentage}% | {speed} | ETA: {eta}s",
        barCompleteChar: "█",
        barIncompleteChar: "░",
        hideCursor: true,
      },
      cliProgress.Presets.shades_classic
    );

    proc.stdout.on("data", (data) => {
      const line = data.toString();

      const prog = parseProgress(line);
      if (prog) {
        if (!barStarted) {
          bar.start(100, prog.percent, { speed: prog.speed, eta: prog.eta });
          barStarted = true;
        } else {
          bar.update(prog.percent, { speed: prog.speed, eta: prog.eta });
        }
      }

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
        console.log("\n✅ Playlist download complete!");
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

export async function downloadVideo(url, options) {
  console.log(`\n🎬 Downloading video: ${url}`);
  console.log(`📥 Quality: ${options.quality}`);

  const qualityMap = {
    high: "bestvideo+bestaudio",
    low: "worst",
    audio: "bestaudio",
  };

  const format = qualityMap[options.quality] || "bestvideo+bestaudio";
  const output = options.output;

  const bar = new cliProgress.SingleBar(
    {
      format: "⬇️  [{bar}] {percentage}% | {speed} | ETA: {eta}s",
      barCompleteChar: "█",
      barIncompleteChar: "░",
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic
  );

  return new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", [url, "-f", format, "-o", output, "--newline"]);

    let barStarted = false;

    proc.stdout.on("data", (data) => {
      const line = data.toString();
      const prog = parseProgress(line);

      if (prog) {
        if (!barStarted) {
          bar.start(100, prog.percent, { speed: prog.speed, eta: prog.eta });
          barStarted = true;
        } else {
          bar.update(prog.percent, { speed: prog.speed, eta: prog.eta });
        }
      }
    });

    proc.on("close", (code) => {
      if (barStarted) bar.stop();
      if (code === 0) {
        console.log("\n✅ Video download complete!");
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
