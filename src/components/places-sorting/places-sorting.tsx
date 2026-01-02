import { SORTING_OPTIONS } from '../../const';

export default function PlacesSorting(): JSX.Element {
  const currentOption = SORTING_OPTIONS[0];

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>

      <span className="places__sorting-type" tabIndex={0}>
        {currentOption}
        <svg className="places__sorting-arrow" width={7} height={4}>
          <use xlinkHref="#icon-arrow-select" />
        </svg>
      </span>

      <ul className="places__options places__options--custom">
        {SORTING_OPTIONS.map((option) => (
          <li
            key={option}
            className="places__option"
            tabIndex={0}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
}
