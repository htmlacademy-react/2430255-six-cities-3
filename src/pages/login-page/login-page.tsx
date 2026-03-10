import { FormEvent, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/api-actions';
import { cityChanged } from '../../store/main-slice';
import { useAppDispatch } from '../../store/hooks';
import { PageTitle, AppRoute } from '../../const/const';
import { CITIES } from '../../const/cities';
import './login-page.css';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const randomCity = useMemo(
    () => CITIES[Math.floor(Math.random() * CITIES.length)],
    []
  );

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setError(null);

    const formData = new FormData(evt.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleCityClick = () => {
    dispatch(cityChanged(randomCity));
    navigate(AppRoute.Main);
  };

  return (
    <>
      <Helmet>
        <title>{PageTitle.Login}</title>
      </Helmet>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            {error && <p className="login__error">{error}</p>}
            <form
              className="login__form form"
              onSubmit={(evt) => {
                void handleSubmit(evt);
              }}
            >
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>
              <button
                className="login__submit form__submit button"
                type="submit"
              >
                Sign in
              </button>
            </form>
          </section>

          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <button
                className="locations__item-link"
                type="button"
                onClick={handleCityClick}
              >
                <span>{randomCity.name}</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
