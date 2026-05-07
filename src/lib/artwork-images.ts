// Verified Unsplash photo IDs — all confirmed real from search results
const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=1920&q=90&fit=crop`

export const SILHOUETTE_IMAGES = {
  // Sculpture — white flower emerging from pure black, studio lit
  sculpture: U('dEDBtRKij08'),
  // Tanjore — black and gold abstract painting, Klimt-like
  tanjore: U('FlKis6BzvRo'),
  // Resin — deep blue black abstract fluid painting
  resin: U('kmviGX74hXU'),
  // Relief / Stone carving — carved scroll patterns, dramatic side-light
  relief: U('vwBguFef3k0'),
  // Clay — dark moody figurative sculpture in studio
  clay: U('I-K7g4Y9HBA'),
  // Decoupage — single flower glowing blue against black
  decoupage: U('CJVfoTsYEws'),
  // Canvas — dark flowing abstract
  canvas: U('dTgIbuxsM2w'),
  // Marble / Stone texture — dark moody stone surface
  marble: U('If2Ekdoh-tw'),
  // Hero background — black and gold curves abstract
  heroAlt: U('muJlB0u1rHo'),
  // Gold — pile of gold dust on dark surface
  gold: U('TldK0WeiQZg'),
  // Cathedral stone carving at night — ornate detail
  ornate: U('3VCXhRWaqWI'),
  // Rose on black
  rose: U('9LdB5vVZyz0'),
}

// Her actual artworks — used as reveal / detail images
const SHWET = 'https://shwet-arts.vercel.app/static/media'
export const HER_WORK = {
  triptych: `${SHWET}/Design%202%20(1).4a91b7e5048fca709145.png`,
  sculptureRose: `${SHWET}/cropped-IMG_4192.5aefabd9b811a934c30b.jpeg`,
  resinCircle: `${SHWET}/Design%203%20(1).0aa51fec78aefc1540e1.png`,
  tanjoreMockup: `${SHWET}/Design%209%20(4).c99c002f148341fec30c.png`,
  decoupage: `${SHWET}/IMG_4439%20(1).6c8f489446734d5627d8.jpeg`,
  canvas: `${SHWET}/pixelcut-export.95095ed9e421629192e3.png`,
}
