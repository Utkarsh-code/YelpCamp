const mongoose=require('mongoose');
const Review= require('./review')
const Schema=mongoose.Schema;

const opts={toJSON: {virtuals: true}};

const CampgroundSchema=new Schema({
    title:String,
    price:Number,
    images:[
        {
            url:String,
            filename:String
        }
    ],

    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },

    description:String,
    location:String,
    author: {
         type:Schema.Types.ObjectId,
         ref:'User'
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function (){
     return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
             <p>${this.description.substring(0, 20)}...</p>`
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in:doc.reviews
            }
        })
    }
})

module.exports=mongoose.model('Campground', CampgroundSchema);