const express = require("express");
const logic = require("../business-logic-layer/logic");
const DestinationModel = require("../models/DestinationModel");
const VacationModel = require("../models/VacationModel");
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const verifyAdmin = require("../middleware/verify-admin");

const router = express.Router();
router.use(fileUpload());
const app=express();

const listener=app.listen(4005, ()=>console.log("listening on 4005"));
logic.init(listener);

router.get("/id/:id", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        const vacationById = await logic.getVacationByIdAsync(request.params.id);
        if (vacationById.length == 1) {
            response.send(vacationById[0])
        }
        else {
            response.status(404).send(`Can not find vacation ${request.params.id}`);
        }
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
})

router.get("/image/:imageName", async (request, response) => {
    try {
        const imageName = request.params.imageName;

        let imageFile = path.join(__dirname, "../images", imageName);
        if (!fs.existsSync(imageFile)) imageFile = locations.notFoundImageFile;

        response.sendFile(imageFile);
    }
    catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
});

router.get("/all/:id", verifyLoggedIn, async (request, response) => {
    try {
        const vacations = await logic.getAllVacationsAsync(request.params.id);
        if (vacations.length != 0)
            response.send(vacations);
        else
            response.status(404).send(`Can not find vacations`);
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
});

router.get("/all", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        const vacations = await logic.getAllVacationsManagementAsync();
        if (vacations.length != 0)
            response.send(vacations);
        else
            response.status(404).send(`Can not find vacations`);
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
});

router.get("/vacations-and-followers", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        const vacations = await logic.getAllVacationsAndFollowersAsync();
        if (vacations.length != 0)
            response.send(vacations);
        else
            response.status(404).send(`Can not find vacations`);
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
});

router.get("/destinations/all", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        const destinations = await logic.getAllDestinationsAsync();
        if (destinations.length != 0)
            response.send(destinations);
        else
            response.status(404).send(`Can not find destinations`);
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
});

router.post("/", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    const newVacation = new VacationModel(request.body);
    const errors = newVacation.validate();
    if (errors) {
        response.status(400).send(errors);
    }
    else {
        try {
            await logic.addVacationAsync(newVacation);
            response.send(`Vacation "${newVacation.description}" was added`)
        } catch (error) {
            console.log(error)
            response.status(500).send({message: "Server error, please try again later"});
        }
    }
})

router.post("/image/new", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        const image = request.files.image;
        const absolutePath = path.join(__dirname, "..", "images", image.name);
        await image.mv(absolutePath); 
        console.log(absolutePath);
        response.send("OK");
    }
    catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
});

router.post("/destination", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    let isExist = false;
    try {
        const destinationsList = await logic.getAllDestinationsAsync();
        for (let destination of destinationsList) {
            if (destination.destinationName.toLowerCase() == request.body.destinationName.toLowerCase()) {
                isExist = true;
                break;
            }
        }
        if (isExist) {
            response.status(404).send(`Destination ${request.body.destinationName} already exists`);
        }
        else {
            const newDestination = new DestinationModel(request.body);
            const errors = newDestination.validate();
            if (errors) {
                response.status(400).send(errors);
            }
            else {
                try {
                    await logic.addDestinationsAsync(newDestination);
                    response.send(`Destination "${newDestination.destinationName}" was added`)
                } catch (error) {
                    console.log(error)
                    response.status(500).send({message: "Server error, please try again later"});
                }
            }
        }

    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});        
    }


})

router.delete("/:id", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        await logic.deleteVacationByIdAsync(request.params.id);
        response.send(`Vacation "${request.params.id}" has been deleted`)
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
});

router.put("/:id", [verifyLoggedIn, verifyAdmin], async (request, response) => {
    try {
        const vacation = await logic.getVacationByIdAsync(request.params.id);
        if (vacation.length == 1) {
            const editedVacation = new VacationModel(request.body);
            const errors = editedVacation.validate();
            if (errors) {
                response.status(400).send(errors);
            }
            else {
                try {
                    await logic.editVacationByIdAsync(request.params.id, editedVacation);
                    response.send(`Vacation "${editedVacation.description}" was succesfuly changed`)
                } catch (error) {
                    console.log(error)
                    response.status(500).send({message: "Server error, please try again later"});
                }
            }
        }
        else {
            response.status(404).send(`Vacation ${request.params.id} not found`);
        }
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }

});


router.get("/follows/:userId", verifyLoggedIn, async (request, response) => {
    try {
        const usersFollows = await logic.getFollowsByUserIdAsync(request.params.userId);
            response.send(usersFollows)
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
})

router.post("/follows/follow/:userId/:vacationId", verifyLoggedIn, async (request, response) => {
    try {
        await logic.followVacationByUserIdAsync(request.params.userId, request.params.vacationId);
            response.send(`User ${request.params.userId} is now following vacation ${request.params.vacationId}`)
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
})

router.delete("/follows/unfollow/:userId/:vacationId", verifyLoggedIn, async (request, response) => {
    try {
        await logic.unfollowVacationByUserIdAsync(request.params.userId, request.params.vacationId);
            response.send(`User ${request.params.userId} is no longer following vacation ${request.params.vacationId}`)
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
})

router.patch("/followers/:vacationId/:operator", verifyLoggedIn, async (request, response) => {
    const operator = request.params.operator;
    if(operator === "-") {
    try {
        await logic.DecreaseFollowByVacationIdAsync(request.params.vacationId);
        response.send(`You unfollowed vacation ${request.params.vacationId}`);
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
}
else if(operator === "+") {
    try {
        await logic.IncreasseFollowByVacationIdAsync(request.params.vacationId);
        response.send(`You are now following vacation ${request.params.vacationId}`);
    } catch (error) {
        console.log(error)
        response.status(500).send({message: "Server error, please try again later"});
    }
}
else {
    response.status(500).send({message: "Server error, please try again later"});
}
})

module.exports = router;