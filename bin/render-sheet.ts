import path from "path";
import program from "commander";
import { renderPage } from "../lib/render";
import browsers from "../lib/browsers";

program
  .option("--user-count <count>", "user count")
  .option("--games <game>", "game")
  .option("--dir <dir>", "output directory", ".")

async function renderSheet(port, userCount, games, outDir) {
  for (let user = 1; user <= userCount; user++) {
    for (let game = 1; game <= games; game++) {
      const outputPath = path.join(path.resolve(process.cwd(), outDir), `sheet-${user}-${game}.png`);

      console.log(outputPath);
      await renderPage(port, `/sheet?user=${user}&game=${game}`, outputPath, {
        width: 400,
        height: 650
      });
    }
  }
}

async function main({ userCount, games, outDir }) {
  try {
    await renderSheet(3000, userCount, games, outDir);
  } finally {
    await browsers.drain();
    await browsers.clear();
  }
}

if (require.main === module) {
  program.parse(process.argv);

  main({
    userCount: program.userCount,
    games: program.games,
    outDir: program.dir,
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
