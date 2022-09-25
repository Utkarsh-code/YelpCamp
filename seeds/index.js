
const mongoose=require('mongoose');
const cities=require('./cities');
const {places, descriptors}=require('./seedHelpers');
const Campground = require('../models/campground');

 mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser:true,
 //   useCreateIndex:true,
    useUnifiedTopology:true
});


const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

//const sample=array => array[Math.floor(Math.random() * array.length)];
const sample= array => array[Math.floor(Math.random() *array.length)];

const seedDB=async () => {
    await Campground.deleteMany({});
    for(let i=0; i<300; i++){
        const random1000= Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp= new Campground({
            author:'620a50a8c4354c10bd2edf30',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
           // image:'https://source.unsplash.com/collection/483251',
            description:'Facere placeat quis illo illum eveniet repellendus, veniam possimus? Quod nisi, quidem autem dicta, eum recusandae, laudantium adipisci quia blanditiis doloremque aliquid?  Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere placeat quis illo illum eveniet repellendus, veniam',
            price,

            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ] 
            },
            
            images: [
                {
                    url: 'https://res.cloudinary.com/dax2b5xr2/image/upload/v1645096581/YELPCAMP/xdanfrndohtzmkvnuzer.jpg',
                    filename: 'YELPCAMP/xdanfrndohtzmkvnuzer'
                }
              ]
        })
        await camp.save();
    }

}
seedDB().then( () => {
    mongoose.connection.close();
})

