const express = require('express');
const connect = require('./config');
require('dotenv').config();
const HomeData = require('./HomeData');
const UserModel = require('./UserModel')

const jwt = require('jsonwebtoken');


const app = express();

/** middlewares */
app.use(express.json());

app.disable('x-powered-by'); // less hackers know about our stack

const port = 8000;
/** start server only when we have valid connection */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        })
    } catch (error) {
        console.log('Cannot connect to the server')
    }
}).catch(error => {
    console.log("Invalid database connection...!", error);
})






//add Courses 

app.post('/add/course', (req, resp) => {

    try {
        const test = req.body
        const data = HomeData(test)
        data.save().then((response) => {
            resp.status(200).send({ result: "Added successfully", response: response })
        }).catch((error) => {
            resp.status(400).send({ result: "Getting some issue while saving", error: error });
        })
    }
    catch (e) {
        resp.status(500).send({ result: "getting fatal error", error: e });
    }
})



// Get All Courses.

app.get('/GetAll/Courses', async (req, resp) => {
    try {
        await HomeData.find().then((response) => {
            resp.status(200).send({ result: 'results are:', response: response })
        }).catch((error) => {
            resp.status(400).send({ result: "having issue while fetching data:", error: error })
        })
    } catch (e) {
        resp.status(500).send({ result: "having fatal isssue:", error: e })
    }
})

// search by course type like pythin,java and many more.

app.get('/search/bycoursetype/:key', async (req, resp) => {
    try {
        let searchKey = req.params.key;
        await HomeData.find({ type: { $regex: searchKey } }).then((response) => {
            resp.status(200).send({ result: "results are", response: response });
        }).catch((error) => {
            resp.status(400).send({ result: "having issue while fetching.", error: error });
        })

    } catch (e) {
        resp.status(500).send({ result: "Getting fatal error.", error: e });
    }
})


// get course by name

app.get('/get/course/byname/:name', (req, resp) => {

    try {
        let name = req.params.name;
        HomeData.find({ name: { $regex: name } }).then((response) => {
            resp.status(200).send({ result: "results are:", response: response });
        }).catch((error) => {
            resp.status(400).send({ result: "having issue while fetching data:", error: error });
        })

    } catch (e) {
        resp.status(500).send({ result: "Getting fatal error", error: e });
    }
})

//delete course by id

app.delete('/delete/course/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        await HomeData.findByIdAndDelete(id).then((response) => {
            resp.status(200).send({ result: "deleted successfully this =", response: response });
        }).catch((error) => {
            resp.status(400).send({ result: "there is no any data associated with this id", error: error });
        })
    } catch (e) {
        resp.status(500).send({ result: "Getting fatal error", error: e });
    }
})

//update a particular course by id

app.put('/update/course/:id', async (req, resp) => {
    try {
        let id = req.params.id;

        const { poster_url, name, Rating, Views, Auther_name, chapter_length, chapters, About_course, type } = req.body;
        await HomeData.findByIdAndUpdate(id, { poster_url, name, Rating, Views, Auther_name, chapter_length, chapters, About_course, type })
            .then((response) => {
                resp.status(200).send({ result: "Update values successfully", Response: response });
            }).catch((error) => {
                resp.status(400).send({ result: "Getting some issue while updating values", Response: error })
            })
    } catch (e) {
        resp.status(500).send({ result: "Gettign fatal error", Response: e })
    }
})

//update a particular course by name

app.put('/update/course/:name', async (req, resp) => {
    try {
        let nn = req.params.name;

        const { poster_url, name, Rating, Views, Auther_name, chapter_length, chapters, About_course, type } = req.body;
        await HomeData.findByIdAndUpdate({ name: nn }, { poster_url, name, Rating, Views, Auther_name, chapter_length, chapters, About_course, type })
            .then((response) => {
                resp.status(200).send({ result: "Update values successfully", Response: response });
            }).catch((error) => {
                resp.status(400).send({ result: "Getting some issue while updating values", Response: error })
            })
    } catch (e) {
        resp.status(500).send({ result: "Gettign fatal error", Response: e })
    }
})


//find last 10 inserted course in batabase

app.get('/get/last_10/course', async (req, resp) => {

    try {
        await HomeData.find().sort({ createdAt: -1 }).limit(10).then((response) => {
            resp.status(200).send({ result: "results are:", response: response });
        }).catch((error) => {
            resp.status(400).send({ result: 'getting error', Error: error });
        })
    } catch (e) {
        resp.status(500).send({ result: "Getting fatal error", Error: e });
    }
})











//add new chapter in chapter array in Homedata collection using course id

app.post('/add_new/chapter/:id', async (req, resp) => {
    try {
        let id = req.params.id;

        const { chapters } = req.body;
        const addeddata = await HomeData.findByIdAndUpdate(id, {
            $push: { "chapters": chapters }
        }, { new: true });

        if (addeddata) {
            resp.status(200).send({ result: "added this data succeccfully", response: addeddata });
        }
        else {
            resp.status(404).send({ result: "Issue occured while pushing the data.", response: null });
        }
    }
    catch (e) {
        resp.status(500).send({ result: "having fatal issue:", error: e })
    }
});


//update chapter details in chapter using id array

app.patch('/update/chapter_details/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        await HomeData.findOneAndUpdate(
            { 'chapters._id': id },
            { $set: { 'chapters.$': req.body } },
            { new: true }
        ).then((response) => {
            resp.status(200).send({ result: "New episode values updated successfully.", response: response });
        }).catch((error) => {
            resp.status(400).send({ result: "getting error while updating the values", error: error });
        })
    }
    catch (e) {
        resp.status(500).send({ result: "Fatal issue", error: e });
    }
})






/*


//add session details in database

app.post('/create_session_box/first_time', async (req, resp) => {
    try {
        const { Heading, Video_url, poster_url, session_no, Episode_no, Length, Release_Date } = req.body;
        let data = { Heading, Video_url, poster_url, session_no, Episode_no, Length, Release_Date };

        const rr = await SessionModel({ data });
        rr.save().then((response) => {
            resp.status(200).send({ result: "created successfully.", Response: response });
        }).catch((error) => {
            resp.status(400).send({ result: "Having issue while creating the contest box.", Response: error });
        })
    }
    catch (e) {
        resp.status(500).send({ result: "Having fatal issue.", Response: e });
    }

})

//delete a particular session from movies data

app.post('/movies/delete/session_details/:id', async (req, resp) => {

    try {
        let id = req.params.id;
        let session_id = req.body.session_id;
        console.log(id, "body ", session_id)
        await MovieModel.findOneAndUpdate(
            { _id: id },
            { $pull: { Sessions: { _id: session_id } } },
            { new: true }
        ).then((response) => {
            resp.status(200).send({ result: "deleted successfully.", Response: response.deletedCount });
        }).catch((er) => {
            resp.status(400).send({ result: "getting issue while deleting this data", Response: er });
        })
    }
    catch (e) {
        resp.status(500).send({ result: "Fatal issue occured.", Response: e });
    }
})


//add episode using contest box ids

app.post('/Session_box/add/Episode_no/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        const { Heading, Video_url, poster_url, session_no, Episode_no, Length, Release_Date } = req.body;
        let data = { Heading, Video_url, poster_url, session_no, Episode_no, Length, Release_Date };

        const addeddata = await SessionModel.findByIdAndUpdate(id, {
            $push: { data }
        });
        if (addeddata) {
            resp.status(200).send({ result: " session added  succeccfully", Response: addeddata });
        }
        else {
            resp.status(404).send({ result: "Issue occured while pushing the data.", Response: null });
        }
    } catch (e) {
        resp.status(500).send({ result: "Having fatal issue", Response: e });
    }

});

//Update the value of a particular session's episode

app.patch('/Session_box/update_episode/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        await SessionModel.findOneAndUpdate(
            { 'data._id': id },
            { $set: { 'data.$': req.body } },
            { new: true }
        ).then((response) => {
            resp.status(200).send({ result: "New episode values updated successfully.", Response: response });
        }).catch((error) => {
            resp.status(400).send({ result: "getting error while updating the values", Response: error });
        })
    }
    catch (e) {
        resp.status(500).send({ result: "Fatal issue", Response: e });
    }
})

//delete a particular episode 

app.post('/Session_box/delete/epiode/:id', async (req, resp) => {

    try {
        let id = req.params.id;
        let episode_id = req.body.episode_id
        await SessionModel.findOneAndUpdate(
            { _id: id },
            { $pull: { data: { _id: episode_id } } },
            { new: true }
        ).then((response) => {
            resp.status(200).send({ result: "deleted successfully.", Response: response.deletedCount });
        }).catch((er) => {
            resp.status(400).send({ result: "getting issue while deleting this data", Response: er });
        })
    }
    catch (e) {
        resp.status(500).send({ result: "Fatal issue occured.", Response: e });
    }
})


//delete all movies from database.

app.delete('/delete/whole/movies', async (req, resp) => {
    try {
        await MovieModel.deleteMany().then((response) => {
            resp.status(200).send({ result: "deleted whole movies", response: response });
        }).catch((error) => {
            resp.status(400).send({ result: "getting error while deleting data", Error: error })
        })
    } catch (e) {
        resp.status(500).send({ result: "getting fatal error", Error: e });
    }
})


// get all leagues from a particular data array

app.get('/get_all/episode/of_a_session/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        await SessionModel.findById(id).then((response) => {
            resp.status(200).send({ result: 'result is =', response: response })
        }).catch((error) => {
            resp.status(400).send({ result: "getting error while fetching", Error: error });
        })
    } catch (e) {
        resp.status(500).send({ result: "getting fatal error", Error: e });
    }
})

//get all session data

app.get('/get_all/session/data', (req, resp) => {
    try {
        SessionModel.find().then((response) => {
            resp.status(200).send({ result: response })
        }).catch((error) => {
            resp.status(400).send({ result: "having some issue while getting data", Error: error });
        })

    } catch (e) {
        resp.status(500).send({ result: 'havinga fatal error', Error: e })
    }
})

//delete session data  by ids

app.delete('/delet/session/byid/:id', (req, resp) => {
    try {
        let id = req.params.id;

        SessionModel.findByIdAndDelete(id, { new: true }).then((response) => {
            resp.status(200).send({ result: "deleted successfully", response: response });
        }).catch((error) => {
            resp.status(400).send({ result: "having issue while deleting", Error: error });
        })

    } catch (e) {
        resp.status(500).send({ result: "Having fatal error", Error: e });
    }
})



// get last created movies

app.get('/get/last_created/movie', (req, resp) => {
    try {

        MovieModel.find().sort({ createdAt: -1 }).limit(2).then((response) => {
            resp.status(200).send({ result: "getting last 2 created movies", response: response });
        }).catch((error) => {
            resp.status(400).send({ result: "getting issue while fetching data", Error: error });
        })
    } catch (e) {
        resp.status(500).send({ result: "getting fatal error", Error: e });
    }
})

//last 2 modified movies

app.get('/get/last_modified/movie', (req, resp) => {
    try {

        MovieModel.find().sort({ updatedAt: -1 }).limit(2).then((response) => {
            resp.status(200).send({ result: "getting last 2 modified movies", response: response });
        }).catch((error) => {
            resp.status(400).send({ result: "getting issue while fetching data", Error: error });
        })
    } catch (e) {
        resp.status(500).send({ result: "getting fatal error", Error: e });
    }
})


    //MySchema.find().sort({ createdAt: -1 }).limit(10)  // 10 latest docs
//MySchema.find().sort({ createdAt: 1 }).limit(10) // 10 oldest doc










/*
let s = new User({username:'diididdi',number:'8271289383',Balance:20})

let result = s.save().then((resp)=>{
    console.log(resp)
}).catch((err)=>{
    console.log(err);
});
*/



/*
User.updateOne({username:'diididdi'}, 
    {$inc:{Balance:5}}).then((respo)=>{
        console.log(respo)
    }).catch((err)=>{
        console.log(err)
    });
    */






/** middleware for verify user */
/*
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}
*/

// Register user using email, password, confirm password

app.post('/register/user', async (req, resp) => {
    try {
        const { email, password, confirmpassword } = req.body;

        // check the existing email

        await UserModel.findOne({ email }).then((response) => {

            if (response != null) {
                resp.status(400).send({ result: "This email is already registered try with new email id..", response: response })
            }
            else {

                if (password == confirmpassword) {

                    const user = new UserModel({
                        email: email,
                        password: password,
                        confirmpassword: confirmpassword
                    });

                    // return save result as a response
                    user.save()
                        .then((response) => {

                            // create jwt token
                            const token = jwt.sign({
                            }, process.env.JWT_SECRET, { expiresIn: "24h" });

                            resp.status(200).send({
                                result: "Account is created successfully.",
                                response: response.email,
                                token: token
                            })
                        }).catch((error) => {
                            resp.status(400).send({ result: "having issue while saving user data..", error: error });
                        })

                } else {
                    resp.status(400).send({ result: "password and confirim password does not match." });
                }
            }
        })
    } catch (e) {
        resp.status(500).send({ result: "having fatal error", error: e });
    }
})




//Login user using email and password

app.post('/User/login', async (req, resp) => {
    try {
        const { email, password } = req.body;

        await UserModel.findOne({ email })
            .then((user) => {

                if (user.password == password) {

                    // create jwt token
                    const token = jwt.sign({
                        userId: user._id,
                        email: user.email
                    }, process.env.JWT_SECRET, { expiresIn: "24h" });

                    resp.status(200).send({
                        result: "Login Successful...!",
                        response: user.email,
                        token: token
                    })
                }
                else {
                    resp.status(400).send({ result: "Wrong password...", error: "This password is not assosicated with any account." })
                }
            }).catch((error) => {
                resp.status(400).send({ result: "Email id not found...", error: error })
            })
    } catch (e) {
        resp.status(500).send({ result: "having fatal issue..", error: e})
    }
})



// get all users

app.get('/getAll/user', async (req, resp) => {
    try {
        await UserModel.find().then((response) => {
            resp.status(200).send({
                result: "All user are:",
                count: response.length,
                response: response,
            });
        }).catch((error) => {
            resp.status(400).send({ result: "Having error while fetching data:", error: error });
        })
    } catch (e) {
        resp.status(500).send({ result: "having fatal error", error: r });
    }

})


//reset Password

app.post('/reset/password', async (req, resp) => {
    try {
        const { email, newpassword } = req.body;

        await UserModel.findOne({ email })
            .then((response) => {
                if (response != null) {
                    let pass = response.password;

                    UserModel.updateOne({ password: pass }, { $set: {password: newpassword } }, { new: true })
                        .then((ress) => {
                            resp.status(200).send({ result: "Password reset done.", response: ress.modifiedCount});
                        }).catch((error) => {
                            resp.status(400).send({ result: "having issue while updating new password:", error: error })
                        })

                } else {
                    resp.status(400).send({ result: "This email is not associated with any account.." });
                }

            }).catch((error) => {
                resp.status(400).send({ result: "having some technical issue:", error: error });
            })

    } catch (e) {
        resp.status(500).send({ result: "having fatal issue:", error: e });
    }
})

