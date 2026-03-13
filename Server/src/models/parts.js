
import mongoose from "mongoose";

const partsSchemas = new mongoose.Schema({

    name : {
        type : String,
        required : true,
    },

    material : {    // like plastic, metal, etc.
        type : String,
        required : true,
    },

    confidence : {
        type : Number
    },

    commonSources : [{   //e.g., "Found in old appliances"
        type : String,
        
    }]
}, { timestamps : true } );

const Parts = mongoose.model('Part', partsSchemas);

export default Parts