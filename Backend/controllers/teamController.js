import teamModel from '../models/teamModel.js'
import userModel from '../models/userModel.js'

export const createTeamController = async (req, res) => {
    const { name, memberIds } = req.body;
    console.log("came to team controller")
    console.log(memberIds);
    try {
        // Fetch users based on memberIds and ensure unique domains

        const members = await userModel.find({ '_id': { $in: memberIds } });
        const uniqueDomains = new Set(members.map(member => member.email.split('@')[1]));
        if (uniqueDomains.size !== members.length) {
            return res.status(400).json({ message: "Members must have unique email domains." });
        }

        // Create and save the new team
        const newTeam = new teamModel({ name, members: memberIds });
        await newTeam.save();
        return res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTeamsController = async (req, res) => {
    try {
        const teams = await teamModel.find().populate('members');
        res.json(teams);
    } catch (error) {
        res.status(500).send(error.message);
    }
}