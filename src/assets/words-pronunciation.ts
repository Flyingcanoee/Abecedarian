function importAll(r: any) {
  let wordsSounds: any = {};
  r.keys().map((item: any) => {
    wordsSounds[item.replace('./', '').replace('.mp3', '')] = r(item);
  });
  return wordsSounds;
}

export const wordsSoundsEng = importAll(
  (require as any).context('./pronunciation-eng', false, /\.mp3/),
);

export const wordsSoundsPort = importAll(
  (require as any).context('./pronunciation-port', false, /\.mp3/),
);
