import TabsItem from './tabs-item/tabs-item';
import { CITIES } from '../../const';

export default function NavTabs(): JSX.Element {
  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {CITIES.map((city) => (
            <TabsItem key={city} city={city} />
          ))}
        </ul>
      </section>
    </div>
  );
}
