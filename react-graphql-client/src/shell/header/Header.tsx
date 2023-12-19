import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from 'oidc-react';
import { UserBasket } from './UserBasket';
import { useLazyQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Me } from './models';
import { useEffect } from 'react';
import { LoginButton } from './LoginButton';

const userBasketQuery = loader('./UserBasketQuery.graphql');

interface BasketResponse {
  me: Me;
}

export const Header = () => {
  const [getUserBasket, {error, data}] = useLazyQuery<BasketResponse>(userBasketQuery);
  const auth = useAuth();
  const loggedIn = !!auth.userData;

  useEffect(() => {
    if (loggedIn) {
      getUserBasket();
    }
  }, [loggedIn, getUserBasket]);

  const isAdmin = () => {
    return loggedIn && roles().some((role: string) => role === "ESHOP_MANAGER");
  };

  const roles = () => {
    return loggedIn ? decodeToken().resource_access['eshop-app'].roles
      : [];
  }

  const decodeToken = () => {
    const _decodeToken = (_token: string) => {
      try {
        return JSON.parse(atob(_token));
      } catch {
        return;
      }
    };
    return auth.userData?.access_token
      .split('.')
      .map(token => _decodeToken(token))
      .reduce((acc, curr) => {
        if (!!curr) acc = { ...acc, ...curr };
        return acc;
      }, Object.create(null));
  }  

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/">E-Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Link className="nav-link" to="/">Catalog</Link>
            <Link className="nav-link" to="/basket">Basket</Link>
            <Link className="nav-link" to="/orders">Orders</Link>
            {isAdmin() && <Link className="nav-link" to="/admin">Admin</Link>}
          </Nav>
          <Nav>
            {loggedIn && data?.me && !error && <UserBasket basket={data.me.basket}/>}
            <div className="border-start ps-2">
              <LoginButton/>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
