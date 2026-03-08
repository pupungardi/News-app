async function run() {
  try {
    const res = await fetch('https://berita-indo-api.vercel.app/v1/tempo-news');
    const data = await res.json();
    console.log(JSON.stringify(data.data[0], null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
