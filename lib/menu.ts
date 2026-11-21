/* =====================================================================
   MAQ Burgers — the full menu.
   Typed from "MAQ_Burgers_Latest_Fully_Editable.pdf". All prices in AUD.
   Edit names, prices and descriptions here; the whole site updates.

   Item fields:
     n     name (exactly as on the menu)
     p     single price            — OR —
     s, d  Single / Double prices
     desc  description (optional)
     img   photo (optional). Items with a photo get a card and their own
           page; items without one are listed as menu rows.
   ===================================================================== */

type RawItem = { n: string; p?: number; s?: number; d?: number; desc?: string; img?: string; badge?: string };
type RawCategory = {
  id: string; title: string; short: string; tagline?: string;
  banner?: string; thumb?: string; items: RawItem[];
  /** 'text': a small text tile in the home page's category grid even with a banner */
  tile?: 'text';
};

const A = '/assets/';
const IMG = {
  bannerBurgers: A + 'img-32-18048921.jpg', // twin burgers
  bannerChicken: A + 'img-33-35b98c87.jpg', // monster burger and chicken bucket
  bannerPizzas: A + 'img-03-1096dc4e.jpg',
  bannerFries: A + 'img-34-787888ff.jpg', // loaded fries duo
  // stand-ins for dishes without their own photo: real MAQ photos where we have one (no real pizza photo yet)
  burger: A + 'img-15-22505d70.jpg', // MAQ Smash
  chicken: A + 'img-21-80a29e8a.jpg', // MAQ Chicken
  fries: A + 'img-23-c7ed8510.jpg', // MAQ Loaded Fries
  pizza: A + 'img-14-e1aac2f3.jpg',
  // each dish's own photo
  maqSmash: A + 'img-15-22505d70.jpg',
  maqSmoky: A + 'img-16-ed114285.jpg',
  doubleStack: A + 'img-17-9f2b005f.jpg',
  maqSignature: A + 'img-29-0afd9679.jpg',
  maqOklahoma: A + 'img-19-69ecc02b.jpg',
  maqMonster: A + 'img-20-fe6ff034.jpg',
  maqChicken: A + 'img-21-80a29e8a.jpg',
  maqGrill: A + 'img-22-332d5c6f.jpg',
  maqLoadedFries: A + 'img-23-c7ed8510.jpg',
  chickenLoadedFries: A + 'img-24-34e41e0a.jpg',
  maqClassic: A + 'img-25-9604fc61.jpg',
  maqSpecial: A + 'img-26-9e2a7389.jpg',
  southernFried: A + 'img-27-0a9d54f1.jpg',
  chickenDynamite: A + 'img-28-93aaa2f9.jpg',
  // photos for the text-only menu panels
  wings: A + 'img-36-9f07c8da.jpg',
  kidsBox: A + 'img-37-925006f3.jpg',
  tenders: A + 'img-40-3db33e88.jpg', // two chicken tenders on slate (wide, for the banner)
  tendersCard: A + 'img-41-8226e6f2.jpg', // same photo cropped for the card
};

export const MENU_NOTE = 'All prices in AUD';

const RAW: RawCategory[] = [
  {
    id: 'burgers', title: 'Smashed Beef Burgers', short: 'Burgers',
    tagline: 'Smashed Fresh. Stacked Proper.', banner: IMG.bannerBurgers, thumb: IMG.burger,
    items: [
      { n: 'MAQ Classic', s: 10, d: 15, badge: 'Popular', img: IMG.maqClassic,
        desc: 'Smashed beef patty, melted cheese, pickles, onion, white special sauce and ketchup.' },
      { n: 'MAQ Smash', s: 15.9, d: 20.9, img: IMG.maqSmash,
        desc: 'Toasted buns, smashed beef patty, melted cheese, onion rings, lettuce, jalapeño, MAQ sauce and tomato relish.' },
      { n: 'MAQ Smoky', s: 15.9, d: 20.9, img: IMG.maqSmoky,
        desc: 'Toasted buns, smashed beef patty, lettuce, melted cheese, onion rings, grilled mushrooms, MAQ sauce and barbecue sauce.' },
      { n: 'Double Stack', p: 19, img: IMG.doubleStack,
        desc: 'Toasted bun, two smashed beef patties, melted cheese, caramelised onion, pickles and MAQ sauce.' },
      { n: 'MAQ Special', s: 15.9, d: 20.9, img: IMG.maqSpecial,
        desc: 'Toasted buns, smashed beef patty, cheese slice, coleslaw, pickles, jalapeño, grilled pineapple, peri-peri sauce and honey mustard sauce.' },
      { n: 'MAQ Signature', s: 16, d: 21, img: IMG.maqSignature,
        desc: 'Toasted bun, smashed beef patty, melted cheese, lettuce, onion rings, bacon, pickles, MAQ sauce and tomato ketchup.' },
      { n: 'MAQ Oklahoma', s: 16, d: 21, img: IMG.maqOklahoma,
        desc: 'Smash patty with fresh onion, jalapeños, pickles and MAQ sauce.' },
      { n: 'MAQ Monster', p: 26, img: IMG.maqMonster,
        desc: 'Toasted bun, four smashed beef patties, lettuce, mushrooms, onion rings, MAQ sauce and barbecue sauce.' },
    ],
  },
  {
    id: 'chicken', title: 'Fried Chicken Burgers', short: 'Chicken',
    tagline: 'Crunch You Can Hear.', banner: IMG.bannerChicken, thumb: IMG.chicken,
    items: [
      { n: 'MAQ Chicken', s: 16.9, d: 22.9, img: IMG.maqChicken,
        desc: 'Toasted bun, fried chicken fillet, lettuce, tomato slice, cheese slice, MAQ sauce and tomato relish.' },
      { n: 'Southern Fried', s: 16.9, d: 22.9, img: IMG.southernFried,
        desc: 'Toasted bun, fried chicken fillet, creamy coleslaw, pickles and MAQ sauce.' },
      { n: 'Chicken Dynamite', s: 16.9, d: 22.9, img: IMG.chickenDynamite,
        desc: 'Toasted bun, fried chicken fillet, lettuce, nachos, chopped tomato, chopped jalapeño, cheese slice, honey mustard and peri-peri sauce.' },
      { n: 'MAQ Grill', p: 16, img: IMG.maqGrill,
        desc: 'Toasted bun, thigh fillet, cheese slice, pickle, lettuce and special sauce.' },
    ],
  },
  {
    id: 'pizzas', title: 'Pizzas', short: 'Pizzas',
    tagline: 'Baked Hot. Made To Share.', banner: IMG.bannerPizzas, thumb: IMG.pizza,
    items: [
      { n: 'MAQ Special', p: 20, img: IMG.pizza, desc: 'Ham, chicken, onion, capsicum, olives, pepperoni.' },
      { n: 'Mexican Volcano', p: 20, img: IMG.pizza, desc: 'Ham, onion, capsicum, pepperoni, fresh tomato, chilli.' },
      { n: 'Vegetarian', p: 20, img: IMG.pizza, desc: 'Onion, capsicum, pineapple, olives, fresh tomato, mushroom.' },
      { n: 'Hawaiian', p: 20, img: IMG.pizza, desc: 'Ham, pineapple.' },
      { n: 'BBQ Chicken', p: 20, img: IMG.pizza, desc: 'Chicken, mushroom (BBQ sauce optional).' },
      { n: 'Meat Lovers', p: 20, img: IMG.pizza, desc: 'Ham, pepperoni, beef (BBQ sauce optional).' },
      { n: 'Aussie', p: 20, img: IMG.pizza, desc: 'Ham, onions, fresh tomato.' },
      { n: 'Double Smokey Ham', p: 26, img: IMG.pizza, desc: 'Smokey ham, pineapple, red onion (egg optional).' },
      { n: 'Great Supreme', p: 26, img: IMG.pizza, desc: 'Sausage, ham, chicken, tomato, onion, capsicum, mushroom.' },
      { n: 'Peri Peri', p: 26, img: IMG.pizza, desc: 'Tomato, onion, olives, peri-peri chicken and special sauce.' },
      { n: 'Garlic Bread', p: 6 },
    ],
  },
  {
    id: 'kebabs', title: 'Kebabs', short: 'Kebabs',
    items: [
      { n: 'Doner Kebab', p: 17 },
      { n: 'Chicken Kebab', p: 17 },
      { n: 'Mixed Kebab', p: 17 },
      { n: 'Crispy Chicken Kebab', p: 17 },
    ],
  },
  {
    id: 'meat-boxes', title: 'Meat Boxes', short: 'Meat Boxes',
    items: [
      { n: 'Chicken Meat Box', p: 18 },
      { n: 'Doner Meat Box', p: 18 },
    ],
  },
  {
    id: 'fries', title: 'Loaded Fries', short: 'Loaded Fries',
    tagline: 'Loaded Up. Sauced Right.', banner: IMG.bannerFries, thumb: IMG.fries,
    items: [
      { n: 'MAQ Loaded Fries', p: 18, img: IMG.maqLoadedFries,
        desc: 'French fries, smashed beef patty with cheese, halal bacon, barbecue sauce, MAQ sauce and parsley on top.' },
      { n: 'Crispy Chicken Loaded Fries', p: 18, img: IMG.chickenLoadedFries,
        desc: 'French fries, crunchy chicken pieces, creamy coleslaw, MAQ sauce, peri-peri sauce and parsley on top.' },
    ],
  },
  {
    id: 'wings', title: 'Fried Wings', short: 'Wings', banner: IMG.wings, thumb: IMG.wings, tile: 'text',
    items: [
      { n: 'Plain (5 pcs)', p: 12, img: IMG.wings },
      { n: 'Hot Honey (5 pcs)', p: 14 },
    ],
  },
  {
    id: 'tenders', title: 'Chicken Tenders', short: 'Tenders', banner: IMG.tenders, thumb: IMG.tenders, tile: 'text',
    items: [{ n: '2 pcs', p: 12, img: IMG.tendersCard }],
  },
  {
    id: 'sides', title: 'Sides', short: 'Sides',
    items: [
      { n: 'Onion Rings (6 pcs)', p: 8 },
      { n: 'Fries - Small', p: 7 },
      { n: 'Fries - Large', p: 12 },
    ],
  },
  {
    id: 'kids', title: 'Kids Snack Box', short: 'Kids', banner: IMG.kidsBox, thumb: IMG.kidsBox, tile: 'text',
    items: [{ n: 'Kids Snack Box', p: 10, img: IMG.kidsBox, desc: '6 chicken nuggets, small fries and tomato sauce.' }],
  },
  {
    id: 'add-ons', title: 'Add-ons', short: 'Add-ons',
    items: [
      { n: 'Beef Patty with Cheese', p: 6 },
      { n: 'Chicken Fillet', p: 6 },
      { n: 'Bacon (Halal)', p: 4 },
      { n: 'Cheese Slice', p: 2 },
      { n: 'Egg', p: 2 },
      { n: 'Pineapple', p: 2 },
      { n: 'Onion Rings', p: 2 },
      { n: 'Caramelised Onion, Jalapeños & Pickles', p: 1 },
    ],
  },
  {
    id: 'sauces', title: 'Sauces', short: 'Sauces',
    items: [
      { n: 'MAQ Sauce', p: 1 },
      { n: 'Honey Mustard Sauce', p: 1 },
      { n: 'White Garlic Sauce', p: 1 },
      { n: 'Barbecue Sauce', p: 1 },
      { n: 'Tomato Relish', p: 1 },
    ],
  },
];

/** Home page "Popular picks": [category id, item name] */
const POPULAR: [string, string][] = [
  ['burgers', 'MAQ Classic'], ['burgers', 'MAQ Smash'], ['chicken', 'Southern Fried'], ['fries', 'MAQ Loaded Fries'],
  ['burgers', 'MAQ Signature'], ['chicken', 'Chicken Dynamite'], ['pizzas', 'Peri Peri'], ['pizzas', 'Great Supreme'],
];

/* ---------- derived, typed model ---------- */

export type MenuItem = {
  name: string;
  slug: string;
  catId: string;
  catTitle: string;
  desc?: string;
  img?: string;
  badge?: string;
  /** Single / Double pricing */
  sized: boolean;
  price?: number;
  single?: number;
  double?: number;
  /** lowest price, used for "From $x" */
  from: number;
  /** "S $10.00 / D $15.00" or "$19.00" */
  priceText: string;
  /** has a photo, so it gets a card and its own page */
  page: boolean;
  /** lower-case text the menu search matches against */
  search: string;
};

export type Category = {
  id: string;
  title: string;
  short: string;
  tagline?: string;
  banner?: string;
  thumb?: string;
  /** big photo tile in the home page's category grid */
  tile: boolean;
  /** "01".."12" */
  num: string;
  photo: boolean;
  count: number;
  min: number;
  /** "8 items · from $10.00" */
  meta: string;
  items: MenuItem[];
};

export const money = (v: number) => '$' + v.toFixed(2);
export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const used = new Set<string>();
export const CATEGORIES: Category[] = RAW.map((c, i) => {
  const items: MenuItem[] = c.items.map(it => {
    let slug = slugify(it.n);
    if (used.has(slug)) slug = slugify(it.n + ' ' + c.short);
    used.add(slug);
    const sized = it.s != null;
    const from = sized ? it.s! : it.p!;
    const priceText = sized ? 'S ' + money(it.s!) + ' / D ' + money(it.d!) : money(it.p!);
    return {
      name: it.n, slug, catId: c.id, catTitle: c.title, desc: it.desc, img: it.img, badge: it.badge,
      sized, price: it.p, single: it.s, double: it.d, from, priceText, page: !!it.img,
      search: [it.n, it.desc ?? '', c.title, sized ? 'From ' + money(it.s!) : money(it.p!)].join(' ').toLowerCase(),
    };
  });
  // "from" uses the category's photo dishes when it has any, so a side like Garlic Bread doesn't set it
  const main = items.filter(it => it.page);
  const min = Math.min(...(main.length ? main : items).map(it => it.from));
  return {
    id: c.id, title: c.title, short: c.short, tagline: c.tagline, banner: c.banner, thumb: c.thumb,
    num: String(i + 1).padStart(2, '0'), photo: !!c.banner, tile: !!c.banner && c.tile !== 'text', count: items.length, min,
    meta: items.length + (items.length === 1 ? ' item' : ' items') + ' · from ' + money(min),
    items,
  };
});

export const categoryById = (id: string) => CATEGORIES.find(c => c.id === id);
/** every dish with a photo (these get a product page) */
export const PRODUCTS: MenuItem[] = CATEGORIES.flatMap(c => c.items.filter(it => it.page));
export const productBySlug = (slug: string) => PRODUCTS.find(p => p.slug === slug);
export const POPULAR_ITEMS: MenuItem[] = POPULAR
  .map(([cat, name]) => categoryById(cat)?.items.find(it => it.name === name))
  .filter((it): it is MenuItem => !!it);

/** Categories grouped for the navbar's mega menu and the side drawer. Every category appears once. */
export const MENU_GROUPS: { title: string; cats: Category[] }[] = [
  { title: 'Burgers', ids: ['burgers', 'chicken'] },
  { title: 'Pizza & Kebabs', ids: ['pizzas', 'kebabs', 'meat-boxes'] },
  { title: 'Sides & Snacks', ids: ['fries', 'wings', 'tenders', 'sides', 'kids'] },
  { title: 'Extras', ids: ['add-ons', 'sauces'] },
].map(g => ({ title: g.title, cats: g.ids.map(id => categoryById(id)!) }));

export const itemHref = (p: MenuItem) => `/menu/${p.catId}/${p.slug}`;
export const categoryHref = (id: string) => `/menu/${id}`;
export const fromText = (p: MenuItem) => (p.sized ? 'From ' + money(p.single!) : money(p.price!));
