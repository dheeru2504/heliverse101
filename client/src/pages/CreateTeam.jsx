import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Form, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  setGender,
  setAvailable,
  setSelectedDomains,
  resetFilters,
  setCurrentPage,
} from "../redux/features/users/usersSlice";
import Herosection from "../components/Herosection";

const domain = [
  "Business Development",
  "Finance",
  "IT",
  "Management",
  "Marketing",
  "UI Designing",
];
function CreateTeam() {
  const navigate = useNavigate();
  //   const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamName, setTeamName] = useState("");

  const dispatch = useDispatch();
  const { users, totalPages, gender, available, selectedDomains, currentPage } =
    useSelector((state) => state.users);

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

  useEffect(() => {
    dispatch(fetchUsers({ currentPage, gender, available, selectedDomains }));
  }, [dispatch, currentPage, gender, available, selectedDomains]);

  const handleSelectUser = (selectedUser) => {
    const alreadySelected = selectedUsers.some(
      (user) => user._id === selectedUser._id
    );

    if (alreadySelected) {
      // If the user is already selected, remove them from the selectedUsers state
      setSelectedUsers(
        selectedUsers.filter((user) => user._id !== selectedUser._id)
      );
    } else {
      // Check if the selected user's domain is already in the list of selected users
      const selectedUserDomain = selectedUser.domain;
      const isDomainAlreadySelected = selectedUsers.some(
        (user) => user.domain === selectedUserDomain
      );

      if (!isDomainAlreadySelected) {
        setSelectedUsers([...selectedUsers, selectedUser]);
      } else {
        // Optionally alert the user that the domain is already selected
        alert("A user from this domain has already been selected.");
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // console.log("going to backend");
    fetch(`https://heliverse-4zbw.onrender.com/api/user/create-team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName, memberIds: selectedUsers }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Team created:", data);
        // Handle success (e.g., redirecting or clearing the form)
        navigate("/teams");
      })
      .catch((error) => console.error("Error creating team:", error));
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

  return (
    <>
      <Herosection />
      <div className="container-fluid row">
        <h1 className="my-5 grid justify-center text-3xl font-normal">
          Create Team
        </h1>
        <div className="col-3 px-4">
          <h5 className="text-3xl my-5 grid justify-center">Apply Filters</h5>
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

        <div className="col-9">
          <form className="" onSubmit={handleSubmit}>
            <div className="  ">
              <div className="grid justify-center row my-5 align-items-end">
                <div className="col-5">
                  <input
                    className=" min-w-96 h-12 border-2 rounded-lg "
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Team Name"
                    required
                  />
                </div>
                <div className="col-4">
                  <Button className="w-40 h-12" type="submit">
                    Save
                  </Button>
                </div>
              </div>

              <div className="mx-5 px-3">
                {users.map((user) => (
                  <div key={user._id} className="my-2">
                    <label className="font-serif text-lg">
                      <input
                        className="mx-2"
                        type="checkbox"
                        value={user._id}
                        checked={selectedUsers.some(
                          (selectedUser) => selectedUser._id === user._id
                        )}
                        onChange={() => handleSelectUser(user)}
                        // Disable checkbox if user's domain is already selected by another user
                        disabled={selectedUsers.some(
                          (selectedUser) =>
                            selectedUser.domain === user.domain &&
                            selectedUser._id !== user._id
                        )}
                      />
                      {user.first_name} {user.last_name} - {user.domain}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
        <Pagination className="justify-content-center mt-4">
          {renderPaginationItems()}
        </Pagination>
      </div>
    </>
  );
}

export default CreateTeam;
