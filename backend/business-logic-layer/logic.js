const dal = require("../data-access-layer/dal");
const io=require("socket.io");

function getAllVacationsAsync(userId) {
    return dal.executeQueryAsync(`
    select v.*, d.*, f.vacationId vcId, f.userId 
    from vacations v 
    join destinations d on d.destinationId=v.destinationId 
    left JOIN follows f on v.vacationId=f.vacationId and f.userId = ?
    order by (CASE WHEN f.userId = ? THEN 1 ELSE 0 END) DESC`, [userId, userId]);
}

function getAllVacationsManagementAsync() {
    return dal.executeQueryAsync(`select v.*, d.* from vacations v join destinations d on d.destinationId=v.destinationId
        GROUP by v.vacationId order by v.dateStart`);
}

function addVacationAsync(vacation) {
    return dal.executeQueryAsync(`
        insert into vacations values(
            null, 
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            0
        )
    `,
    [vacation.description, vacation.destinationId, vacation.image, vacation.dateStart, vacation.dateEnd, vacation.price]
    );
}

function deleteVacationByIdAsync(vacationIdToDelete) {
    return dal.executeQueryAsync(`delete from vacations where vacationId = ?`, [vacationIdToDelete]);
}

function editVacationByIdAsync(vacationId, vacation) {
    return dal.executeQueryAsync(`
        update vacations set
        vacationId = ?, 
        description = ?,
        destinationId = ?,
        image = ?,
        dateStart = ?,
        dateEnd = ?,
        price = ?,
        followers = ?
        where vacationId = ?
    `,
    [vacationId, vacation.description, vacation.destinationId, vacation.image, vacation.dateStart, vacation.dateEnd, vacation.price, vacation.followers, vacationId]
    );
};

function addDestinationsAsync(destination) {
    return dal.executeQueryAsync(`
    insert into destinations values(
        null, 
        ?
    )
`, [destination.destinationName])
}

function getVacationByIdAsync(vacationId) {
    return dal.executeQueryAsync(`select * from vacations v join destinations s on s.destinationId=v.destinationId where vacationId = ?`, [vacationId])
}


function getAllDestinationsAsync() {
    return dal.executeQueryAsync(`select * from destinations`);
}

function getUserByNameAsync(username) {
    return dal.executeQueryAsync(`select * from users where userName = ?`, [username])
}

function registerAsync(newUser) {
    return dal.executeQueryAsync(`insert into users values(
        null,
        ?,
        ?,
        "user",
        ?,
        ?
    )`,
    [newUser.username, newUser.password, newUser.firstName, newUser.lastName]
    )
}

function init(listener) {
    let socketsManager;    
    socketsManager=io(listener, {cors: {origin: "http://localhost:3000"}});

    socketsManager.sockets.on("connection", socket => {
        console.log("A client is connected ");

        socket.on("disconnect", (reason) => {
            console.log("A client is disconnected ");
        });

        socket.on("msg-from-client", message => {
            socketsManager.sockets.emit("msg-from-server", message);
        });
    });
}

function getFollowsByUserIdAsync(userId) {
    return dal.executeQueryAsync(`select * from follows where userId = ?`, [userId]);
}

function followVacationByUserIdAsync(userId, vacationId) {
    return dal.executeQueryAsync(`insert into follows values(?, ?)`, [userId, vacationId]);
}

function unfollowVacationByUserIdAsync(userId, vacationId) {
    return dal.executeQueryAsync(`delete from follows where userId = ? and vacationId = ?`, [userId, vacationId]);
}

function IncreasseFollowByVacationIdAsync(vacationId) {
    return dal.executeQueryAsync(`update vacations set followers = followers + 1 where vacationId = ?`, [vacationId])
}

function DecreaseFollowByVacationIdAsync(vacationId) {
    return dal.executeQueryAsync(`update vacations set followers = followers - 1 where vacationId = ?`, [vacationId])
}

function getAllVacationsAndFollowersAsync() {
    return dal.executeQueryAsync("select vacationId, followers from vacations where followers > 0");
}

module.exports = {
    getAllVacationsAsync,
    addVacationAsync,
    deleteVacationByIdAsync,
    editVacationByIdAsync,
    getVacationByIdAsync,
    getAllDestinationsAsync,
    addDestinationsAsync,
    getUserByNameAsync,
    registerAsync,
    init,
    getFollowsByUserIdAsync,
    followVacationByUserIdAsync,
    unfollowVacationByUserIdAsync,
    getAllVacationsAndFollowersAsync,
    getAllVacationsManagementAsync,
    DecreaseFollowByVacationIdAsync,
    IncreasseFollowByVacationIdAsync

}