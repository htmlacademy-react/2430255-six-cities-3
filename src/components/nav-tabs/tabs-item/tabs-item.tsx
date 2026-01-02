type TabItemProps = {
  city: string;
};

export default function TabsItem({ city }: TabItemProps): JSX.Element {
  return (
    <li className="locations__item">
      <a className="locations__item-link tabs__item" href="#">
        <span>{city}</span>
      </a>
    </li>
  );
}
