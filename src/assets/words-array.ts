function importAll(r: any) {
  let images: any = {};
  r.keys().map((item: any) => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
}

export const images = importAll(
  (require as any).context('./pictures', false, /\.png/),
);
