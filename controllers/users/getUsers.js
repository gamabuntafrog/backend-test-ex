const User = require("../../models/user");


const getUsers = async (req, res) => {
    const {currentUserId} = req;
    const page = req.query.page || 0;
    const limit = 5;

    const start = (page * limit);
    const end = ((page * limit) + 5) + 1;

    // const users = await UserForEvents.find({}).populate('events')
    const currentUser = await User.findById(currentUserId);
    const {usersForEvents: users} = await User.findById(currentUserId).populate({
        path: 'usersForEvents',
        populate: {
            path: 'events'
        }
    }).slice('usersForEvents', [start, end])

    const formattedUsers = users.map((user) => {
        const {username, firstName, lastName, email, phoneNumber, _id, events, eventsCount} = user
        const nextEventDate = events.find(({startDate}) => startDate >= Date.now())?.startDate || null

        return {
            username,
            firstName,
            lastName,
            email,
            phoneNumber,
            _id,
            nextEventDate,
            eventsCount
        }
    })

    const pages = Math.ceil(currentUser.usersForEvents.length / limit)

    res.status(200).json({
        message: 'success',
        code: 200,
        data: {
            pages: pages,
            users: formattedUsers
        }
    })
}

module.exports = getUsers;