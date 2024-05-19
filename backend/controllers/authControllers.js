const bcrypt = require("bcryptjs");
const {User, validateRegisterUser, validateLoginUser} = require("../models/User")
/**---------------------------------
 *@desc Register New User
 *@router /app/auth/register
 * @method POST
 --------------------------------*/
module.exports.registerUserCtrl = async (req, res) => {
    try {
        //validation
        const {error} = validateRegisterUser(req.body)
        if (error) {
            return res.status(400).json({massage: error.details[0].message})
        }
        //is user already exists
        let user = await User.findOne({email: req.body.email})
        if (user) {
            return res.status(400).json({massage: "user already exists"})
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        user = new User({
            username: req.body.username,
            storeName: req.body.storeName,
            email: req.body.email,
            password: hashedPassword
        })

        //new user and save in db
        await user.save();
        //send res to client
        res.status(201).json({message: "you registered successfully, please log in"})
    } catch (e) {
        console.log(e)
    }
}
/**---------------------------------
 *@desc Login User
 *@router /app/auth/login
 * @method POST
 --------------------------------*/
module.exports.loginUserCtrl = async (req, res) => {
    try {
        //1.validation
        const {error} = validateLoginUser(req.body)
        if (error) {
            return res.status(400).json({massage: error.details[0].message})
        }
        //2.Is User Exist
        const user = await User.findOne({email: req.body.email})
        if (!user) {
            return res.status(400).json({massage: "Is User Not Exist "})

        }
        //3.Password is valid
        //هنا يروح يجيب الباسورد من الداتا بيس ويقارنه بل الباسورد الموجود بل الداتابيس
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({massage: "Password or Email invalid"})
        }
        //4.generate New Token (JWT)
        const token = user.generateAuthToken()
        //5.res To clint
        res.status(200).json({
            _id: user._id,
            isAdmin: user.isAdmin,
            profilePhoto: user.profilePhoto,
            token,
            username:user.username,
            storeName:user.storeName
        })

    } catch (e) {
        console.log(e)
    }
}