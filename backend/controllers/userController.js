import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import cloudinary from 'cloudinary'

//api to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res.json({ success: false, message: "missing details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" });
    }
    //validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password " });
    }

    //hasing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api for user login

const loginUSer = async (req, res) => {
  try {

        const{email,password}= req.body
        const user = await userModel.findOne({email})
        
        if (!user){
         return res.json({ success: false, message:'user does not exist ' });  

        }
     const isMatch = await bcrypt.compare(password,user.password)
            if (isMatch){
                const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
                res.json({success:true,token})
            }else{
                res.json({success:false ,message:"ivalid "})
            }



  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

   //api to get user profile info

   const getProfile = async (req,res)=>{
      try{
          const { userId }=req.body
          const userData = await userModel.findById(userId).select('-password')
          res.json({ success: true, userData })
      }catch(error){
          console.log(error);
    res.json({ success: false, message: error.message });
      }
   }

   const updateProfile = async (req, res) => {
    req.body = Object.fromEntries(
            Object.entries(req.body).map(([key, value]) => [
                key.trim(),
                value
            ])
        );
    
    try {
       
const { userId, name, phone, address, dob, gender } = req.body;
const imageFile = req.file;

const missingFields = {
    userId: !userId,
    name: !name,
    phone: !phone,
    address: !address,
    dob: !dob,
    gender: !gender
};

console.log("Received body:", req.body);
console.log("Missing fields:", missingFields);

if (Object.values(missingFields).some(Boolean)) {
    return res.status(400).json({
        success: false,
        message: "Required data missing",
        missingFields
    });
}

        // 2. Update basic text details in MongoDB
        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: typeof address === 'string' ? JSON.parse(address) : address,
            dob,
            gender
        });

        // 3. Optional: Handle profile image upload if a new file was provided
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageUrl = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: "Profile Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
export { registerUser,loginUSer,getProfile,updateProfile};
