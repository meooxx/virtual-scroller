let ii = 0;

const img = [
  'https://fakeimg.pl/250x100/',
  'https://fakeimg.pl/250x200/',
  'https://fakeimg.pl/250x300/',
];
export function mock() {
  let res = new Array(100).fill(0);
  let ii = 0
  res = res.map((_, i) => {
    const item = {
      id: ii++,
      name: Math.random().toString(36).replace('.', '').slice(0, 5),
      img: img[i % 3],
    };
    return item;
  });
  return Promise.resolve({ result: { data: res } });
}
