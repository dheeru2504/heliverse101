import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import Herosection from "../components/Herosection";

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          "https://heliverse-4zbw.onrender.com/api/user/get-teams"
        );
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <>
      <Herosection />

      <div className="container-fluid row">
        <h1 className="grid justify-center my-5">Teams</h1>
        <div className="col-3 ">
          {teams.map((team) => (
            <div className="my-2 border-1 rounded-lg shadow-sm hover:bg-orange-200 active:bg-orange-200">
              <div
                key={team._id}
                className="mx-5 text-2xl"
                onClick={() => setSelectedTeam(team)}
              >
                {team.name}
              </div>
            </div>
          ))}
        </div>

        <div className="col-9 flex flex-row flex-wrap">
          {selectedTeam && (
            <>
              {selectedTeam.members.map((member) => (
                <div className="m-2">
                  <Card key={member._id} style={{ width: "18rem" }}>
                    <Card.Img src={member.avatar} />
                    <Card.Body>
                      <Card.Title>
                        {member.first_name} {member.last_name}
                      </Card.Title>
                      <Card.Text>
                        <p>{member.email}</p>
                        <p>{member.gender}</p>
                        <p>{member.domain}</p>
                        {member.available ? "Available" : "Not Available"}
                      </Card.Text>
                      {/* <Button variant="primary">Go somewhere</Button>  */}
                    </Card.Body>
                  </Card>
                </div>
                // <li key={member._id}>
                //   {member.first_name} {member.last_name}
                // </li>
              ))}
            </>
          )}
        </div>

        {/* {teams.map((team) => (
        <div key={team._id}>
          <h2>{team.name}</h2>
          <h3>Members</h3>
          <ul>
            {team.members.map((member) => (
              <li key={member._id}>
                {member.first_name} {member.last_name}
              </li>
            ))}
          </ul>
        </div>
      ))} */}
      </div>
    </>
  );
}

export default TeamsPage;
