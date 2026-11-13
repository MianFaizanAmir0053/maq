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
window.MENU = {
  note: 'All prices in AUD',
  cats: [
    {
      id: 'burgers', title: 'Smashed Beef Burgers', short: 'Burgers',
      tagline: 'Smashed Fresh. Stacked Proper.',
      banner: '../public/assets/img-01-d0872144.jpg', thumb: '../public/assets/img-10-d7f3e453.jpg',
      items: [
        { n: 'MAQ Classic', s: 10, d: 15, badge: 'Popular', img: '../public/assets/img-10-d7f3e453.jpg',
          desc: 'Smashed beef patty, melted cheese, pickles, onion, white special sauce and ketchup.' },
        { n: 'MAQ Smash', s: 15.9, d: 20.9, img: '../public/assets/img-11-e27e7136.jpg',
          desc: 'Toasted buns, smashed beef patty, melted cheese, onion rings, lettuce, jalapeño, Smash sauce and tomato relish.' },
        { n: 'MAQ Smoky', s: 15.9, d: 20.9, img: '../public/assets/img-11-e27e7136.jpg',
          desc: 'Toasted buns, smashed beef patty, lettuce, melted cheese, onion rings, grilled mushrooms, Smash Special sauce and barbecue sauce.' },
        { n: 'Double Stack', p: 19, img: '../public/assets/img-10-d7f3e453.jpg',
          desc: 'Toasted bun, two smashed beef patties, melted cheese, caramelised onion, pickles and Smash sauce.' },
        { n: 'MAQ Special', s: 15.9, d: 20.9, img: '../public/assets/img-10-d7f3e453.jpg',
          desc: 'Toasted buns, smashed beef patty, cheese slice, coleslaw, pickles, jalapeño, grilled pineapple, peri-peri sauce and honey mustard sauce.' },
        { n: 'MAQ Signature', s: 16, d: 21, img: '../public/assets/img-10-d7f3e453.jpg',
          desc: 'Toasted bun, smashed beef patty, melted cheese, lettuce, onion rings, bacon, pickles, Smash Special sauce and tomato ketchup.' },
        { n: 'MAQ Oklahoma', s: 16, d: 21, img: '../public/assets/img-11-e27e7136.jpg',
          desc: 'Beef patty smashed with fresh onions and jalapeños, sweet pickles, lettuce, caramelised onion and homemade chilli sauce.' },
        { n: 'MAQ Monster', p: 26, img: '../public/assets/img-10-d7f3e453.jpg',
          desc: 'Toasted bun, four smashed beef patties, lettuce, mushrooms, onion rings, Smash sauce and barbecue sauce.' }
      ]
    },
    {
      id: 'chicken', title: 'Fried Chicken Burgers', short: 'Chicken',
      tagline: 'Crunch You Can Hear.',
      banner: '../public/assets/img-02-9e6f5045.jpg', thumb: '../public/assets/img-12-730bb099.jpg',
      items: [
        { n: 'MAQ Chicken', s: 16.9, d: 22.9, img: '../public/assets/img-12-730bb099.jpg',
          desc: 'Toasted bun, fried chicken fillet, lettuce, tomato slice, cheese slice, Smash sauce and tomato relish.' },
        { n: 'Southern Fried', s: 16.9, d: 22.9, img: '../public/assets/img-12-730bb099.jpg',
          desc: 'Toasted bun, fried chicken fillet, creamy coleslaw, pickles and Smash sauce.' },
        { n: 'Chicken Dynamite', s: 16.9, d: 22.9, img: '../public/assets/img-12-730bb099.jpg',
          desc: 'Toasted bun, fried chicken fillet, lettuce, nachos, chopped tomato, chopped jalapeño, cheese slice, honey mustard and peri-peri sauce.' },
        { n: 'MAQ Grill', p: 16, img: '../public/assets/img-12-730bb099.jpg',
          desc: 'Toasted bun, thigh fillet, cheese slice, pickle, lettuce and special sauce.' }
      ]
    },
    {
      id: 'pizzas', title: 'Pizzas', short: 'Pizzas',
      tagline: 'Baked Hot. Made To Share.',
      banner: '../public/assets/img-03-1096dc4e.jpg', thumb: '../public/assets/img-14-e1aac2f3.jpg',
      items: [
        { n: 'MAQ Special', p: 20, img: '../public/assets/img-14-e1aac2f3.jpg', desc: 'Ham, chicken, onion, capsicum, olives, pepperoni.' },
        { n: 'Mexican Volcano', p: 20, img: '../public/assets/img-14-e1aac2f3.jpg', desc: 'Ham, onion, capsicum, pepperoni, fresh tomato, chilli.' },
        { n: 'Vegetarian', p: 20, img: '../public/assets/img-14-e1aac2f3.jpg', desc: 'Onion, capsicum, pineapple, olives, fresh tomato, mushroom.' },
        { n: 'Hawaiian', p: 20, img: '../public/assets/img-14-e1aac2f3.jpg', desc: 'Ham, pineapple.' },
        { n: 'BBQ Chicken', p: 20, img: '../public/assets/img-14-e1aac2f3.jpg', desc: 'Chicken, mushroom (BBQ sauce optional).' },
        { n: 'Meat Lovers', p: 20, img: '../public/assets/img-14-e1aac2f3.jpg', desc: 'Ham, pepperoni, beef (BBQ sauce optional).' },
        { n: 'Aussie', p: 20, img: '../public/assets/img-14-e1aac2f3.jpg', desc: 'Ham, onions, fresh tomato.' },
        { n: 'Double Smokey Ham', p: 26, img: '../public/assets/img-14-e1aac2f3.jpg', desc: 'Smokey ham, pineapple, red onion (egg optional).' },
        { n: 'Great Supreme', p: 26, img: '../public/assets/img-14-e1aac2f3.jpg', desc: 'Sausage, ham, chicken, tomato, onion, capsicum, mushroom.' },
        { n: 'Peri Peri', p: 26, img: '../public/assets/img-14-e1aac2f3.jpg', desc: 'Tomato, onion, olives, peri-peri chicken and special sauce.' },
        { n: 'Garlic Bread', p: 6 }
      ]
    },
    {
      id: 'kebabs', title: 'Kebabs', short: 'Kebabs',
      items: [
        { n: 'Doner Kebab', p: 16 },
        { n: 'Chicken Kebab', p: 16 },
        { n: 'Mixed Kebab', p: 16 },
        { n: 'Crispy Chicken Kebab', p: 16 }
      ]
    },
    {
      id: 'meat-boxes', title: 'Meat Boxes', short: 'Meat Boxes',
      items: [
        { n: 'Chicken Meat Box', p: 15 },
        { n: 'Doner Meat Box', p: 15 }
      ]
    },
    {
      id: 'fries', title: 'Loaded Fries', short: 'Loaded Fries',
      tagline: 'Loaded Up. Sauced Right.',
      banner: '../public/assets/img-04-843dc6a3.jpg', thumb: '../public/assets/img-13-b3047fd0.jpg',
      items: [
        { n: 'MAQ Loaded Fries', p: 18, img: '../public/assets/img-13-b3047fd0.jpg',
          desc: 'French fries, smashed beef patty with cheese, bacon, barbecue sauce, Smash sauce and parsley on top.' },
        { n: 'Crispy Chicken Loaded Fries', p: 18, img: '../public/assets/img-13-b3047fd0.jpg',
          desc: 'French fries, crunchy chicken pieces, creamy coleslaw, Smash sauce, peri-peri sauce and parsley on top.' }
      ]
    },
    {
      id: 'wings', title: 'Fried Wings', short: 'Wings',
      items: [
        { n: 'Plain (5 pcs)', p: 12 },
        { n: 'Hot Honey (5 pcs)', p: 14 }
      ]
    },
    {
      id: 'tenders', title: 'Chicken Tenders', short: 'Tenders',
      items: [
        { n: '2 pcs', p: 12 }
      ]
    },
    {
      id: 'sides', title: 'Sides', short: 'Sides',
      items: [
        { n: 'Onion Rings (6 pcs)', p: 8 },
        { n: 'Fries - Small', p: 7 },
        { n: 'Fries - Large', p: 12 }
      ]
    },
    {
      id: 'kids', title: 'Kids Snack Box', short: 'Kids',
      items: [
        { n: 'Kids Snack Box', p: 10, desc: '6 chicken nuggets, small fries and tomato sauce.' }
      ]
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
        { n: 'Caramelised Onion, Jalapeños & Pickles', p: 1 }
      ]
    },
    {
      id: 'sauces', title: 'Sauces', short: 'Sauces',
      items: [
        { n: 'Smash Sauce', p: 1 },
        { n: 'Honey Mustard Sauce', p: 1 },
        { n: 'White Garlic Sauce', p: 1 },
        { n: 'Barbecue Sauce', p: 1 },
        { n: 'Tomato Relish', p: 1 }
      ]
    }
  ],
  // Home page "Popular picks": [category id, item name]
  popular: [
    ['burgers', 'MAQ Classic'], ['burgers', 'MAQ Smash'], ['chicken', 'Southern Fried'], ['fries', 'MAQ Loaded Fries'],
    ['burgers', 'MAQ Signature'], ['chicken', 'Chicken Dynamite'], ['pizzas', 'Peri Peri'], ['pizzas', 'Great Supreme']
  ]
};
