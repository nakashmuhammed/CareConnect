import bcrypt from 'bcrypt';
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'
// API for adding doctor 
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Doctor image is required" });
        }

        // Checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {  
            return res.json({ success: false, message: "Missing details" });
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (min 8 characters)" });
        }

        // Hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Explicitly configure Cloudinary before uploading
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY || process.env.CLOUDINARY_API_SECRET
        });

        // Upload image to Cloudinary
// console.log("Cloud Name:", cloudinary.config().cloud_name);
// console.log("API Key:", cloudinary.config().api_key);

let imageUrl;

try {
  const imageUpload = await cloudinary.uploader.upload(
    imageFile.path,
    {
      resource_type: "auto",
      folder: "doctors"
    }
  );

//   console.log("UPLOAD SUCCESS");
//   console.dir(imageUpload, { depth: null });

  imageUrl = imageUpload.secure_url;

} catch (err) {
  console.log("UPLOAD ERROR FULL:");
  console.dir(err, { depth: null });

  return res.json({
    success: false,
    message: err.message
  });
}

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: typeof address === 'string' ? JSON.parse(address) : address,
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        return res.json({ success: true, message: "Doctor Added Successfully" });

    } catch (error) {
        console.log("===== ERROR DETAILS =====");
        console.dir(error, { depth: null });

        return res.json({
            success: false,
            message: error.message
        });
    }
};

//api for admin login
const loginAdmin=async(req,res)=>{
    try{
        const{email,password}=req.body
        if(email=== process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
                const token = jwt.sign(email+password,process.env.JWT_SECRET)
                res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentials"})
        }

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}

//api to get all doctors list for admin panel

const allDoctors = async (req,res)=>{
    try{
        const doctors = await doctorModel.find({}).select("-password")
        res.json({success:true,doctors})

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}





export { addDoctor,loginAdmin,allDoctors};