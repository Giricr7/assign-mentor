const mongo = require('../mongo');
const router = require('express').Router();
const joi = require('joi');

//validation while adding new mentor
const addMentorSchema = joi.object({
    mentor_name: joi.string().required().required(),
    students: joi.array().required()
})

//validation while adding new student
const addStudentSchema = joi.object({
    student_name: joi.string().required(),
    mentor: joi.object().allow({}).required()
})

// to add new mentor
// input type:
// {
//     mentor_name:"string"
//     students:[{}]
// }
router.post('/add_mentor', async (req, res) => {

    const { error } = addMentorSchema.validate(req.body);
    
    if (error) {
        res.send(error.details[0].message);
    } else {
        const data = await mongo.db.collection('mentors').insertOne(req.body);
        res.send(data);
    }

    
})


// to add new mentor
// input type:
// {
//     mentor_name:"string"
//     students:{}
// }
router.post('/add_student', async (req, res) => {
    const { error } = addStudentSchema.validate(req.body);
    
    if (error) {
        res.send(error.details[0].message);
    } else {

        const data = await mongo.db.collection('students').insertOne(req.body);
        res.send(data);
    }
})







module.exports = router;