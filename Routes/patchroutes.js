const router = require('express').Router();
const mongo = require('../mongo');
const joi = require('joi');
const { ObjectId } = require('mongodb');


//validation while assigning multiple students to a single mentor
const editMentorSchema = joi.object({
    mentor: joi.object().required(),
    students: joi.array().items(joi.object().required()).required(),
    mentor_id:joi.string().required()
})

//validation while assigning or changing a mentor to a particular student 
const reAssignMentor_schema = joi.object({
    name: joi.string().required(),
    mentor_id: joi.string().required(),
   student_name: joi.string().required()
})


// Select one mentor and Add multiple Student 
// A student who has a mentor should not be shown in List
// input type:
// {
//     mentor: "string",
//     students: [{name:"",student_id:"61a4eddafdbca7946c10f20c"},{name:"",student_id:"61a4eddafdbca7946c10f20c"},{name:"",student_id:"61a4eddafdbca7946c10f20c"}]
// }

router.patch('/assign_students_to_mentor/:mentor_id', async (req, res) => {

    const { error } = editMentorSchema.validate({ mentor: req.body.mentor, students: req.body.students, mentor_id: req.params.mentor_id });
    
    if (error) {
    res.send(error.details[0].message)
    } else {
       const ment_result= await mongo.db.collection('mentors').findOneAndUpdate(
            { _id: ObjectId(req.params.mentor_id)},
            { $set: req.body.students},
            { returnDocument: "after" }
        )

       const stud_result= req.body.students.map(async (student) => {
            return data = await mongo.db.collection('students').findOneAndUpdate(
                { _id: ObjectId(student.stud_id) },
                { $set: { mentor: req.body.mentor } },
                { returnDocument: "after" }
            )
        })
    
        if(stud_result && ment_result )
            res.send('students assigned successfully');
        else {
            res.sendStatus(400)
        }
    }
   

})



//Select One Student and Assign one Mentor
// input type:
// {
//     name: 'string',
//     mentor_id: "61a4eddafdbca7946c10f20c",
//     student_name:"string"
// }

router.patch('/assign_change_mentor/:stud_id', async (req, res) => {
   
    const { error } = reAssignMentor_schema.validate(req.body)
    
    if (error) {
        res.send(error.details[0].message)
    } else {
        const result = await mongo.db.collection('students').findOneAndUpdate(
            { _id: ObjectId(req.params.stud_id) },
            { $set: { mentor: {name:req.body.name,mentor_id:req.body.mentor_id} } },
            { returnDocument: "after" }
        )

        //checking whether the student is already presnt in the mentor's student list
        const mentor_detail = await mongo.db.collection('mentors').findOne({_id:ObjectId(req.body.mentor_id)}) 
        const available = mentor_detail.students.filter((stud) => {
            return stud.student_id === req.params.stud_id
        })

        if (available.length < 1) {
            mentor_detail.students.push({ name: req.body.student_name, student_id: req.params.stud_id })
            const data = await mongo.db.collection('mentors').findOneAndUpdate(
                { _id: ObjectId(req.body.mentor_id) },
                { $set: { students: mentor_detail.students } },
                { returnDocument: "after" }
            )
            if (data && result)
            res.sendStatus(200)
        } else {
            res.send("Duplicate Entry")
        }

        
        
    }
   
    
})


module.exports = router;