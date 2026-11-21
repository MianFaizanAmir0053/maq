import type { MenuItem } from '@/lib/menu';
import Pic from './Pic';

/** A dish without its own page, shown as a menu-board line: name ····· price, with an optional small photo. */
export default function MenuRow({ item, hidden }: { item: MenuItem; hidden?: boolean }) {
  const text = (
    <>
      <div className="mr-t">
        <b>{item.name}</b>
        <span className="mr-l" aria-hidden="true"></span>
        <i>{item.priceText}</i>
      </div>
      {item.desc && <p>{item.desc}</p>}
    </>
  );
  if (!item.pic) return <li className="mrow" hidden={hidden}>{text}</li>;
  return (
    <li className="mrow has-pic" hidden={hidden}>
      <span className="mr-pic">
        <Pic src={item.pic} alt={item.name} sizes="(max-width: 700px) 88px, 120px" />
      </span>
      <div className="mr-body">{text}</div>
    </li>
  );
}
