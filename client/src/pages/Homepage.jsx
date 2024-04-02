import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  setGender,
  setAvailable,
  setSelectedDomains,
  resetFilters,
  setCurrentPage,
  deleteUser,
  resetRecentlyDeleted,
} from "../redux/features/users/usersSlice";

import { Card, Pagination, Form, Button } from "react-bootstrap";

import Footer from "../components/Footer";
import Herosection from "../components/Herosection";

const domain = [
  "Business Development",
  "Finance",
  "IT",
  "Management",
  "Marketing",
  "UI Designing",
];
const Homepage = () => {
  const dispatch = useDispatch();
  const {
    users,
    totalPages,
    searchResults,
    gender,
    available,
    selectedDomains,
    currentPage,
    recentlyDeleted,
  } = useSelector((state) => state.users);

  useEffect(() => {
    if (recentlyDeleted) {
      dispatch(fetchUsers({ currentPage: 1 })); // Re-fetch users if one was recently deleted
      dispatch(resetRecentlyDeleted()); // Reset the flag
    }
  }, [recentlyDeleted, dispatch]);

  useEffect(() => {
    // Only fetch users if there are no search results
    if (searchResults.length === 0) {
      dispatch(fetchUsers({ currentPage }));
    }
  }, [dispatch, currentPage, searchResults.length]);

  useEffect(() => {
    dispatch(
      fetchUsers({
        currentPage,
        gender,
        available,
        selectedDomains,
      })
    );
  }, [dispatch, currentPage, gender, available, selectedDomains, deleteUser]);

  const handleGenderChange = (e) => {
    dispatch(setGender(e.target.value));
  };
  const handleAvailabilityChange = (e) => {
    dispatch(setAvailable(e.target.value));
  };

  const handleDomainChange = (domain, isChecked) => {
    if (isChecked) {
      dispatch(setSelectedDomains([...selectedDomains, domain]));
    } else {
      dispatch(setSelectedDomains(selectedDomains.filter((d) => d !== domain)));
    }
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const renderPaginationItems = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      if (
        number === 1 ||
        number === totalPages ||
        (number >= currentPage - 4 && number <= currentPage + 4)
      ) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => dispatch(setCurrentPage(number))}
          >
            {number}
          </Pagination.Item>
        );
      } else if (number === 2 || number === totalPages - 1) {
        // Ellipsis
        items.push(<Pagination.Ellipsis key={number} />);
      }
    }
    return items;
  };
  const displayUsers = searchResults.length > 0 ? searchResults : users;
  return (
    <div className="container-fluid">
      <Herosection />
      <div className=" grid grid-flow-col  justify-center my-5">
        <div className="text-3xl ">ALL Users</div>
        <div className="absolute w-40  right-0">
          <Link to="/create_team">
            <Button>Create Team</Button>
          </Link>
        </div>
      </div>
      <div className="container-fluid row">
        <div className="col-3 px-4">
          <h5 className="text-3xl grid justify-center">Apply Filters</h5>
          <div className="">
            <Form.Select
              className="my-2"
              aria-label="Gender filter"
              onChange={handleGenderChange}
              value={gender}
            >
              <option value="">Filter by Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </div>

          <div className=" my-3">
            <Form.Select
              aria-label="Availability filter"
              onChange={handleAvailabilityChange}
              value={available}
            >
              <option value="">Filter by Availability</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </Form.Select>
          </div>
          <div className="">
            <div className="font-semibold my-3">Domain</div>
            {domain.map((domain, index) => (
              <div key={index}>
                <Form.Check
                  type="checkbox"
                  label={domain}
                  value={domain}
                  checked={selectedDomains.includes(domain)} // Ensures checkbox is checked based on selectedDomains
                  onChange={(e) => handleDomainChange(domain, e.target.checked)}
                />
              </div>
            ))}
          </div>
          <div className="my-5 justify-center grid">
            <Button onClick={handleResetFilters}>RESET Filters</Button>
          </div>
        </div>
        <div className="d-flex flex-row flex-wrap col-9">
          {displayUsers.map((user) => (
            <div className="m-2">
              <Card key={user.id} style={{ width: "18rem" }}>
                <Card.Img src={user.avatar} />
                <Card.Body>
                  <Card.Title>
                    {user.first_name} {user.last_name}
                  </Card.Title>
                  <Card.Text>
                    <p>{user.email}</p>
                    <p>{user.gender}</p>
                    <p>{user.domain}</p>
                    {user.available ? "Available" : "Not Available"}
                  </Card.Text>
                  <Button
                    variant="danger"
                    onClick={() => dispatch(deleteUser(user.id))}
                  >
                    Delete User
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
        <Pagination className="justify-content-center mt-4">
          {renderPaginationItems()}
        </Pagination>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
