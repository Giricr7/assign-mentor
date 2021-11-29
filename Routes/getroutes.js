const router = require('express').Router();
const mongo = require('../mongo');
const { ObjectId } = require('mongodb');




// to get all the students without mentor

router.get('/get_students_without_mentor',async (req, res) => {
    const students = await mongo.db.collection('students').find({ mentor: '' }).toArray();
    res.send(students)
})

// to get all the mentors
router.get('/getallmentors', async(req, res) => {
    const mentors = await mongo.db.collection('mentors').find().toArray();
    res.send(mentors)
})


//  show all students for a particular mentor
router.get('/getallstudentsformentor/:mentor_id',async (req, res) => {
    const mentor_det = await mongo.db.collection('mentors').findOne({ _id: ObjectId(req.params.mentor_id) })
    res.send(mentor_det.students)
})





module.exports = router;