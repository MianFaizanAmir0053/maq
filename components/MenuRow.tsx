import type { MenuItem } from '@/lib/menu';

/** A dish without a photo, shown as a menu-board line: name ····· price. */
export default function MenuRow({ item, hidden }: { item: MenuItem; hidden?: boolean }) {
  return (
    <li className="mrow" hidden={hidden}>
      <div className="mr-t">
        <b>{item.name}</b>
        <span className="mr-l" aria-hidden="true"></span>
        <i>{item.priceText}</i>
      </div>
      {item.desc && <p>{item.desc}</p>}
    </li>
  );
}
