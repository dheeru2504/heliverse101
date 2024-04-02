import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch } from "react-redux";
import { searchUserByName } from "../redux/features/users/usersSlice";
const Herosection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const isHomePage = location.pathname === "/";
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the form from causing a page reload
    // console.log(searchTerm);
    dispatch(searchUserByName(searchTerm));
  };

  return (
    <div className="mb-3">
      <Navbar expand="lg" className="bg-body-tertiary px-3 font-semibold">
        <Container fluid>
          <Navbar.Brand href="/">Heliverse</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0 "
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/teams">Teams</Nav.Link>
            </Nav>

            {isHomePage && (
              <Form className="d-flex" onSubmit={handleSearch}>
                <Form.Control
                  type="search"
                  placeholder="Search User"
                  className="me-2"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-success" type="submit">
                  Search
                </Button>
              </Form>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Herosection;
