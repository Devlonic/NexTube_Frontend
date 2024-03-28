import { NavLink, useLocation } from 'react-router-dom';
import { INavbarReference } from './types';
import classNames from 'classnames';

export const Navbar = (props: {
  refs: INavbarReference[];
  routeLength: number;
}) => {
  const location = useLocation();
  const parts = location.pathname.split('/');
  const currentRoute =
    parts.length == props.routeLength ? parts.findLast(() => true) : '';

  const references = props.refs.map((r, id) => (
    <li key={id} className="mr-6">
      <NavLink
        title={
          r.enabled == false || r.title.length == 0 ? 'Coming soon' : r.title
        }
        className={classNames('text-gray', {
          'text-white border-b-2 border-primary pointer-events-auto':
            r.path == currentRoute || (currentRoute == '' && r.index == true),
          disabled: r.enabled == false,
          'pointer-events-none': r.enabled == false,
        })}
        to={r.path}
      >
        {r.title}
      </NavLink>
    </li>
  ));
  return (
    <>
      <nav>
        <ul className="flex w-full">{references}</ul>
      </nav>
    </>
  );
};
