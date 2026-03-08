
import mongoose from "mongoose";

const projectSchemas = mongoose.Schema({

    title : {
        type : String,

    },

    steps : {
        type : String,
        
    },

    difficulty : {
        type : String,
    },

    requiredParts : {
        type : String,
         
    }

})

const Projects = mongoose.model('Project', projectSchemas);

export default Projects;