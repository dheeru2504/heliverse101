import userModel from '../models/userModel.js'



export const createUserController = async (req, res) => {
    // console.log("entered controller")
    try {
        // console.log('getting users')
        const { id, first_name, last_name, email, gender, avatar, domain, available } = req.body;
        // console.log("entered controller")
        //validation
        switch (true) {
            case !id:
                return res.status(500).send({ error: "id is Required" });
            case !first_name:
                return res.status(500).send({ error: "first_name is Required" });
            case !last_name:
                return res.status(500).send({ error: "last_name is Required" });
            case !email:
                return res.status(500).send({ error: "email is Required" });
            case !gender:
                return res.status(500).send({ error: "gender is Required" });
            case !avatar:
                return res.status(500).send({ error: "avatar is Required" });
            case !domain:
                return res.status(500).send({ error: "domain is Required" });

        }

        const users = new userModel({ ...req.body });

        await users.save();
        console.log(users);
        res.status(200).send({
            success: true,
            message: "User Created Successfully",
            users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating User",
        });
    }
}

//Get All Users
export const getDomainController = async (req, res) => {
    try {

        const uniqueDomains = await userModel.distinct("domain"); // Fetches unique domains directly

        res.status(200).send({
            success: true,
            message: "unique domains",
            uniqueDomains,

        });
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting unique domains",
            error: error.message,
        });
    }
};

//Get  Users
export const getUsersController = async (req, res) => {
    try {
        const { gender, available, domain } = req.query;
        const pageSize = 20;
        const page = parseInt(req.params.page) || 1;
        let query = {};
        if (gender) query.gender = gender;
        if (available !== undefined) query.available = available === 'true';
        if (domain) {
            // Ensure domain is always treated as an array, even if only one is provided
            if (!Array.isArray(domain)) {
                domain = [domain];
            }
            query.domain = { $in: domain };
        }

        const totalUsers = await userModel.countDocuments(query);
        const users = await userModel
            .find(query)
            .limit(pageSize) // Limit the number of users returned
            .skip(pageSize * (page - 1)) // Skip users from previous pages
            .sort({ createdAt: -1 });



        res.status(200).send({
            success: true,
            message: "Users",
            page,
            pageSize,
            totalPages: Math.ceil(totalUsers / pageSize),
            totalUsers,
            users,

        });
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr in getting users",
            error: error.message,
        });
    }
};

// get search result
export const getSearchController = async (req, res) => {
    const { name } = req.query;
    console.log("entered backend")
    try {
        let query = {};
        const names = name.trim().split(/\s+/); // Split by one or more spaces
        console.log(names)
        if (names.length > 1) {
            // Assumes the user might input 'FirstName LastName'
            query = {
                $or: [
                    { first_name: new RegExp(names[0], 'i'), last_name: new RegExp(names[1], 'i') },
                    { first_name: new RegExp(names[1], 'i'), last_name: new RegExp(names[0], 'i') }
                ]
            };
        } else {
            // Search in either first name or last name if only one name is provided
            query = {
                $or: [
                    { first_name: new RegExp(names[0], 'i') },
                    { last_name: new RegExp(names[0], 'i') }
                ]
            };
        }

        const users = await userModel.find(query);
        res.json(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

//delete user
export const deleteUserController = async (req, res) => {
    console.log("entered delete controller")
    console.log(req.params.id)
    try {
        await userModel.findOneAndDelete({ id: req.params.id })
        res.status(200).send({
            success: true,
            message: "user Deleted successfully",
        });
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting user",
            error,
        });
    }
};

//update user
export const updateUserController = async (req, res) => {
    try {
        const id = req.params.id;
        const { first_name, last_name, email, gender, avatar, domain } = req.body; // Destructure for validation

        // Validation (re-enabled and adjusted)
        if (!first_name || !last_name || !email || !gender || !avatar || !domain) {
            return res.status(400).send({ error: "Please ensure all required fields are provided." });
        }

        // Attempt to update the user
        const updatedUser = await userModel.findOneAndUpdate(
            { id: id }, // Ensure this matches your schema (use _id if applicable)
            { ...req.body },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found." });
        }

        // User found and updated
        res.status(200).send({
            success: true,
            message: "User updated successfully.",
            data: updatedUser,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({
            success: false,
            message: "Error updating user",
            error: error.message, // Providing the error message for easier debugging
        });
    }
};

// // filter users
// export const FilterUsersController = async (req, res) => {
//     console.log('first')
//     const gender = req.query.gender;
//     let query = {};
//     if (gender) query.gender = gender;

//     const users = await userModel.find(query);
//     res.status(200).send({
//         success: true,
//         message: "filtered on gender",
//         users,
//     });
// };


// search product
export const searchUserController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const resutls = await userModel
            .find({
                $or: [
                    { first_name: { $regex: keyword, $options: "i" } },
                ],
            })
        res.json(resutls);
    } catch (error) {
        //console.log(error);
        res.status(400).send({
            success: false,
            message: "Error In Search Product API",
            error,
        });
    }
};


// product list base on page
export const userListController = async (req, res) => {
    try {
        const perPage = 1;
        const page = req.params.page ? req.params.page : 1;
        const users = await userModel
            .find({})
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            users,
        });
    } catch (error) {
        //console.log(error);
        res.status(400).send({
            success: false,
            message: "error in per page ctrl",
            error,
        });
    }
};

