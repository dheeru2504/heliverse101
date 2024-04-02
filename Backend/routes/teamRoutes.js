import express from "express";
import { createTeamController, getTeamsController } from "../controllers/teamController.js";

const router = express.Router();



//create team 
router.post("/create-team", createTeamController);

//get teams
router.get("/get-teams", getTeamsController);


export default router;