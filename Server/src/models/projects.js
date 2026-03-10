
import mongoose from "mongoose";

const projectSchemas = new mongoose.Schema({

    title : {
        type : String,
        required : true,
    },

    steps : [{
        type : String,
        required : true  
    }],

    difficulty : {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },

    requiredParts : [{
        partId : {
            type : mongoose.Schema.ObjectId,
            ref : 'Part',
            required : true
        },

        quantity : {
            type : Number,
            default : 1, 
        }
         
    }]

}, { timestamps : true });

const Projects = mongoose.model('Project', projectSchemas);

export default Projects;