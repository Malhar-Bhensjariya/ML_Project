// const Joi = require('joi');

// const profileValidation = (req, res, next) => {
//     const schema = Joi.object({
//         academics: Joi.object({
//             class10: Joi.object({
//                 school: Joi.string().required(),
//                 percentage: Joi.number().min(0).max(100).required(),
//                 yearOfCompletion: Joi.number().required()
//             }),
//             class12: Joi.object({
//                 school: Joi.string().required(),
//                 percentage: Joi.number().min(0).max(100).required(),
//                 yearOfCompletion: Joi.number().required()
//             }),
//             currentEducation: Joi.object({
//                 institution: Joi.string().required(),
//                 course: Joi.string().required(),
//                 specialization: Joi.string(),
//                 yearOfStudy: Joi.number().required(),
//                 cgpa: Joi.number().min(0).max(10).required()
//             })
//         }).required(),
//         skills: Joi.array().items(Joi.string()).min(1).required(),
//         extracurricular: Joi.array().items(
//             Joi.object({
//                 activity: Joi.string().required(),
//                 role: Joi.string().required(),
//                 description: Joi.string(),
//                 duration: Joi.string().required()
//             })
//         ),
//         internships: Joi.array().items(
//             Joi.object({
//                 company: Joi.string().required(),
//                 role: Joi.string().required(),
//                 duration: Joi.string().required(),
//                 description: Joi.string()
//             })
//         ),
//         achievements: Joi.array().items(
//             Joi.object({
//                 title: Joi.string().required(),
//                 description: Joi.string(),
//                 year: Joi.number().required()
//             })
//         ),
//         futureGoals: Joi.object({
//             shortTerm: Joi.string().required(),
//             longTerm: Joi.string().required(),
//             dreamCompanies: Joi.array().items(Joi.string())
//         })
//     });

//     const { error } = schema.validate(req.body);
//     if (error) {
//         return res.status(400).json({ 
//             message: 'Validation error', 
//             details: error.details.map(err => err.message)
//         });
//     }

//     next();
// };

// module.exports = profileValidation;
