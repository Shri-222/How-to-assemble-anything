
import mongoose from "mongoose";

const partsSchemas = new mongoose.Schema({

    name : {
        type : String,
        
    },

    material : {    // like plastic, metal, etc.
        type : String,

    },

    commonSources : {   //e.g., "Found in old appliances"
        type : String,

    }
})

const Parts = mongoose.model('Part', partsSchemas);

export default Parts