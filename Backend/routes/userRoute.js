import express from "express";
import { createUserController, deleteUserController, getDomainController, getSearchController, getUsersController, searchUserController, updateUserController, userListController } from "../controllers/userControllers.js";
import { createTeamController } from "../controllers/teamController.js";

const router = express.Router();


//Create new User
router.post("/create-users", createUserController);

//get All Users
router.get("/get-users/:page", getUsersController);

//get All Users domain
router.get("/domains", getDomainController);

//get Single Users
router.get("/search", getSearchController);

//delete Users
router.delete("/delete-users/:id", deleteUserController);
//update Users
router.put("/update-users/:id", updateUserController);

//filter product
// router.get("/filter-users", FilterUsersController);

//search product
router.get("/search-user/:keyword", searchUserController);
//users per page
router.get("/user-list/:page", userListController);


//team route
router.post("/create-team", createTeamController);
export default router;